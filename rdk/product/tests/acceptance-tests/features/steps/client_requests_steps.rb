path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
#require 'VerifyJsonRuntimeValue.rb'

#-------------------------------------------------VPR
When(/^the client requests appointments for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("appointment", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests cpt for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("cpt", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests educations for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("education", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests documents for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("document", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests exams for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("exam", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests factors for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("factor", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests images for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("image", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests mentalhealth for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("mh", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests pointofvisits for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("pov", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests procedures for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("procedure", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests skin for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("skin", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests surgery for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("surgery", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests visit for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("visit", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests treatment for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("treatment", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests observations for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("obs", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests ptf for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("ptf", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests newsfeed for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("newsfeed", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests timeline for the patient "(.*?)" in RDK format$/) do |pid|
  query_timeline = RDKQuery.new('patient-record-timeline')
  query_timeline.add_parameter("pid", pid)
  path = query_timeline.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests medication for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("med", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests labs for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = RDKQuery.new('diagnosticreport-diagnosticreport')
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "lab")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests "(.*?)" labs for the patient "(.*?)" in FHIR format$/) do |limit, pid|
  temp = RDKQuery.new('diagnosticreport-diagnosticreport')
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "lab")
  temp.add_acknowledge("true")
  temp.add_parameter("limit", limit)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests radiology report results for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = RDKQuery.new('diagnosticreport-diagnosticreport')
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "rad")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests "(.*?)" radiology report results for the patient "(.*?)" in FHIR format$/) do |limit, pid|
  temp = RDKQuery.new('diagnosticreport-diagnosticreport')
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "rad")
  temp.add_parameter("limit", limit)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests radiology report results for the patient "(.*?)" in FHIR format with no domain param$/) do |pid|
  temp = RDKQuery.new('diagnosticreport-diagnosticreport')
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests out-patient medication results for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = RDKQuery.new('medicationdispense-getMedicationDispense')
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests in-patient medication results for the patient "(.*?)" in FHIR format$/)  do |pid|
  temp = RDKQuery.new('medicationadministration-medicationAdministration')
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests out-patient medication statement for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = RDKQuery.new('medicationdstatement-getMedicationStatement')
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests "(.*?)" out-patient medication results for the patient "(.*?)" in FHIR format$/) do |limit, pid|
  temp = RDKQuery.new('medicationdispense-getMedicationDispense')
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  temp.add_parameter("limit", limit)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests "(.*?)" in-patient medication results for the patient "(.*?)" in FHIR format$/)  do |limit, pid|
  temp = RDKQuery.new('medicationadministration-medicationAdministration')
  temp.add_parameter("subject.identifier", pid)
  temp.add_acknowledge("true")
  temp.add_parameter("limit", limit)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end
