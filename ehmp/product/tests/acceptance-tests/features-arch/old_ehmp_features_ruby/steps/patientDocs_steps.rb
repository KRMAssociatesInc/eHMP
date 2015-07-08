When(/^the client requests documents for the patient "(.*?)"$/) do |pid|
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.NotesViewDef", pid
end
