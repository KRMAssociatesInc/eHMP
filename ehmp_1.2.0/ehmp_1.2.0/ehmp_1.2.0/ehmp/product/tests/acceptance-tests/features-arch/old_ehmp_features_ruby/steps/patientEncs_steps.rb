When(/^the client requests encounters for the patient "(.*?)"$/) do |pid|
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.EncounterViewDef", pid
end
