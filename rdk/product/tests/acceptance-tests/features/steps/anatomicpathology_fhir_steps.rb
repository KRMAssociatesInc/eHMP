# When(/^the client requests anatomic pathology for the patient "(.*?)" in FHIR format$/) do |pid|
#   temp = QueryRDKAll.new("Composition")
#   temp.add_parameter("subject.identifier", pid)
#   #temp.add_parameter("domain", "imun")
#   temp.add_acknowledge("true")
#   p temp.path
#   @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
# end

# When(/^the client requests anatomic pathology for that sensitive patient "(.*?)"$/) do |pid|
#   temp = QueryRDKAll.new("Composition")
#   temp.add_parameter("subject.identifier", pid)
#   #temp.add_parameter("domain", "imun")
#   temp.add_acknowledge("false")
#   p temp.path
#   @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
# end

# When(/^the client breaks glass and repeats a request for anatomic pathology for that patient "(.*?)"$/) do |pid|
#   temp = QueryRDKAll.new("Composition")
#   temp.add_parameter("subject.identifier", pid)
#   #temp.add_parameter("domain", "imun")
#   temp.add_acknowledge("true")
#   p temp.path
#   @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
# end
