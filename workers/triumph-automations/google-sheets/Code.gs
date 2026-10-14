/** @OnlyCurrentDoc */

// Bound to the private TriumphantTech Leads spreadsheet. No web-app deployment
// and no service-account JSON key. Configure properties before running.
function syncTriumphLeads() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet && spreadsheet.getSheetByName('Leads');
    if (!sheet) throw new Error('Create the Leads tab in the spreadsheet containing this script.');
    const headers = ['Reference','Created UTC','Source','Name','Email','Phone','Service','Enquiry','Marketing consent','Status'];
    if (sheet.getLastRow() === 0) sheet.getRange(1,1,1,10).setValues([headers]);
    const actualHeaders = sheet.getRange(1,1,1,10).getDisplayValues()[0];
    if (actualHeaders.join('|') !== headers.join('|')) throw new Error('The Leads header row must match the supplied ten columns.');
    const response = triumphRequest_('/v1/sheets/pull', {});
    const leads = response.leads || [];
    if (!leads.length) return;
    const references = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,1).getDisplayValues().map(row=>row[0]) : [];
    const acknowledged = [];
    for (const lead of leads) {
      const row = [lead.id,lead.created_at,lead.source,lead.name,lead.email,lead.phone,lead.service,lead.need,lead.consent_marketing ? 'Yes' : 'No','new'].map(triumphCell_);
      const existing = references.indexOf(lead.id);
      if (existing >= 0) sheet.getRange(existing+2,1,1,10).setValues([row]);
      else {
        sheet.getRange(sheet.getLastRow()+1,1,1,10).setValues([row]);
        references.push(lead.id);
      }
      acknowledged.push({id:lead.id,updatedAt:lead.updated_at});
    }
    SpreadsheetApp.flush();
    triumphRequest_('/v1/sheets/ack', {rows:acknowledged});
  } finally { lock.releaseLock(); }
}

function triumphCell_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@\t\r]/.test(text) ? "'"+text : text;
}

function triumphRequest_(path, data) {
  const settings = PropertiesService.getScriptProperties();
  const base = (settings.getProperty('WORKER_API_BASE') || '').replace(/\/$/,'');
  const secret = settings.getProperty('SHEETS_SYNC_SECRET') || '';
  if (!/^https:\/\/[a-z0-9.-]+$/i.test(base) || secret.length < 32) throw new Error('Set the HTTPS WORKER_API_BASE and a strong SHEETS_SYNC_SECRET in Script properties.');
  const timestamp = String(Date.now()), nonce = Utilities.getUuid(), body = JSON.stringify(data);
  const message = [timestamp,nonce,'POST',path,body].join('\n');
  const signature = Utilities.computeHmacSha256Signature(message,secret,Utilities.Charset.UTF_8).map(byte=>('0'+((byte+256)%256).toString(16)).slice(-2)).join('');
  const response = UrlFetchApp.fetch(base+path, {
    method:'post',contentType:'application/json',payload:body,
    headers:{'x-triumph-timestamp':timestamp,'x-triumph-nonce':nonce,'x-triumph-signature':signature},
    followRedirects:false,muteHttpExceptions:true,
  });
  if (response.getResponseCode()<200 || response.getResponseCode()>=300) throw new Error('The automation service rejected the sync request. Check its deployment and shared sync secret.');
  const result = JSON.parse(response.getContentText());
  if (!result.ok) throw new Error('The automation service did not confirm the sync.');
  return result;
}
