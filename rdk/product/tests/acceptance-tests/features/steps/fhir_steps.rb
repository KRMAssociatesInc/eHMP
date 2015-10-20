When(/^the client requests "(.*)" for the patient "(.*?)"$/) do |domain, pid|
  # temp = QueryRDKAll.new(domain)
  temp = RDKQuery.new(domain)
  temp.add_parameter("subject.identifier", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the diagnosticreport is requested for the patient "(.*?)"$/) do |pid|
  temp = RDKQuery.new('diagnosticreport-diagnosticreport')
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "lab")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

