$ErrorActionPreference='Stop'
if(-not $IsWindows){throw 'This helper reads the Windows-protected local recovery key.'}
$keyPath=Join-Path $env:USERPROFILE '.codex/private-backups/triumphant-hq/offsite-recovery-key.dpapi'
$bytes=[Security.Cryptography.ProtectedData]::Unprotect([IO.File]::ReadAllBytes($keyPath),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
[Convert]::ToHexString($bytes).ToLowerInvariant() | Set-Clipboard
Write-Output 'Recovery key copied. Save it in your password manager as TriumphantTech offsite backup key, then clear the clipboard. Do not paste it in chat.'
