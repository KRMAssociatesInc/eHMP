#When(/^the client requests unfiltered documents for the patient "(.*?)"$/) do |pid|
#  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.NotesUnfilteredViewDef", pid
#end
When(/^the client requests document "(.*?)", "(.*?)", "(.*?)"$/) do |edipi, eventid, file_extension|
  get_dod_document edipi, eventid, file_extension
end
