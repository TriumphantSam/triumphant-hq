param([ValidateSet('staging','production')][string]$Environment='staging')
$ErrorActionPreference='Stop'
if(-not $IsWindows){throw 'This backup uses Windows current-user DPAPI protection.'}
$repoRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$workerRoot=Join-Path $repoRoot 'workers/triumph-automations'
$wrangler=Join-Path $workerRoot 'node_modules/wrangler/bin/wrangler.js'
$backupRoot=Join-Path $env:USERPROFILE '.codex/private-backups/triumphant-hq'
[IO.Directory]::CreateDirectory($backupRoot) | Out-Null
$backupRoot=[IO.Path]::GetFullPath($backupRoot)
$acl=[Security.AccessControl.DirectorySecurity]::new()
$acl.SetAccessRuleProtection($true,$false)
$sid=[Security.Principal.WindowsIdentity]::GetCurrent().User
$rule=[Security.AccessControl.FileSystemAccessRule]::new($sid,'FullControl','ContainerInherit,ObjectInherit','None','Allow')
$acl.AddAccessRule($rule)
[IO.FileSystemAclExtensions]::SetAccessControl([IO.DirectoryInfo]::new($backupRoot),$acl)
$stamp=[DateTime]::UtcNow.ToString('yyyyMMddTHHmmssZ')+'-'+[guid]::NewGuid().ToString('N').Substring(0,8)
$prefix=Join-Path $backupRoot "$Environment-$stamp"
$sqlPath="$prefix.sql"
$restorePath="$prefix.restore.sql"
$protectedPath="$prefix.sql.dpapi"
$manifestPath="$prefix.manifest.json"
$database=if($Environment -eq 'production'){'triumph_db'}else{'triumph_db_staging'}
Push-Location $workerRoot
try {
  $identity=& node $wrangler whoami 2>&1 | Out-String
  if($LASTEXITCODE -ne 0 -or -not $identity.Contains('a9bf344e401d603c114b152f500e6722')){throw 'Wrong or unavailable Cloudflare account. Sign in to TriumphantTech first.'}
  & node $wrangler d1 export $database --remote --env $Environment --output $sqlPath | Out-Null
  if($LASTEXITCODE -ne 0){throw 'D1 export failed.'}
  Add-Type -AssemblyName System.Security
  $bytes=[IO.File]::ReadAllBytes($sqlPath)
  $cipher=[Security.Cryptography.ProtectedData]::Protect($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
  [IO.File]::WriteAllBytes($protectedPath,$cipher)
  $recovered=[Security.Cryptography.ProtectedData]::Unprotect([IO.File]::ReadAllBytes($protectedPath),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
  [IO.File]::WriteAllBytes($restorePath,$recovered)
  $reportText=& node (Join-Path $PSScriptRoot 'verify-backup.mjs') $restorePath
  if($LASTEXITCODE -ne 0){throw 'The protected export failed isolated restore checks.'}
  $report=$reportText | ConvertFrom-Json
  $manifest=[ordered]@{environment=$Environment;database=$database;createdAt=[DateTime]::UtcNow.ToString('o');protection='Windows DPAPI CurrentUser';remoteRestorePerformed=$false;verified=$report}
  $manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding utf8
  [pscustomobject]@{Environment=$Environment;Backup=$protectedPath;Manifest=$manifestPath;Restore='Isolated in-memory SQLite verified';RemoteDatabaseChanged=$false} | ConvertTo-Json
} finally {
  foreach($temporary in @($sqlPath,$restorePath)){
    $resolved=[IO.Path]::GetFullPath($temporary)
    if(-not $resolved.StartsWith($backupRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Temporary backup path escaped its folder.'}
    if(Test-Path -LiteralPath $resolved){Remove-Item -LiteralPath $resolved -Force}
  }
  Pop-Location
}
