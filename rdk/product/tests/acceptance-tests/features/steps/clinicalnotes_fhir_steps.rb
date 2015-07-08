When(/^the client requests clinical notes for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = QueryRDKAll.new("Composition")
  temp.add_parameter("subject.identifier", pid)
  #temp.add_parameter("domain", "imun")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests clinical notes for that sensitive patient "(.*?)"$/) do |pid|
  temp = QueryRDKAll.new("Composition")
  temp.add_parameter("subject.identifier", pid)
  #temp.add_parameter("domain", "imun")
  temp.add_acknowledge("false")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client breaks glass and repeats a request for clinical notes for that patient "(.*?)"$/) do |pid|
  temp = QueryRDKAll.new("Composition")
  temp.add_parameter("subject.identifier", pid)
  #temp.add_parameter("domain", "imun")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests "(.*?)" clinical notes for the patient "(.*?)" in FHIR format$/) do |limit, pid|
  temp = QueryRDKAll.new("Composition")
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  temp.add_parameter("limit", limit)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end
