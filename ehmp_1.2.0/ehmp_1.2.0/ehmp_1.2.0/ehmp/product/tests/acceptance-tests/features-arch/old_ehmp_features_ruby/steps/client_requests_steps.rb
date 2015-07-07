path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

#-------------------------------------------------VPR
When(/^the client requests labs for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("lab", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests anatomic pathology for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("accession", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests immunization for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("immunization", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests vitals for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("vital", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests allergies for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("allergy", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests problem lists for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("problem", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests medications for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("med", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests document for the patient "(.*?)" in VPR format$/) do |pid|
  path = QueryVPR.new("document", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests radiology report results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("rad", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests visit for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("visit", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests appointment for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("visit", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

#When(/^the client requests vler document for the patient "(.*?)" in VPR format$/) do |pid|
  #temp = QueryVPR.new("vlerdocument", pid)
  #p temp.path
  #@response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
#end

When(/^the client requests vler document for the patient "(.*?)" in VPR format$/) do |pid|
  base_jds_url = DefaultLogin.jds_url
  path = "#{base_jds_url}/vpr/#{pid}/find/vlerdocument"
  p path 
  #"{base_jds_url}/vpr/pid/find/vlerdocument"
  # "http://10.2.2.110:9080/vpr/all/index/pt-name"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests order results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("order", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests consult results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("consult", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests appointments for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("appointment", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests cpt for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("cpt", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests educations for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("education", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests exams for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("exam", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests factors for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("factor", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests images for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("image", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests mentalhealth for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("mh", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests pointofvisits for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("pov", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests procedure results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("procedure", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests skin results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("skin", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests surgery results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("surgery", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests visit results for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("visit", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end
#-------------------------------------------------FHIR
When(/^the client requests labs for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = QueryFhir.new("DiagnosticReport")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests out-patient medication results for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = QueryFhir.new("MedicationDispense")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests in-patient medication results for the patient "(.*?)" in FHIR format$/)  do |pid|  
  temp = QueryFhir.new("MedicationAdministration")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests non-va medication results for the patient "(.*?)" in FHIR format$/) do |pid|  
  temp = QueryFhir.new("MedicationStatement")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)  
end

When(/^the client requests radiology report results for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = QueryFhir.new("DiagnosticReport")
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "rad")
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

#-------------------------------------------------
When(/^the client requests data from multiple VistAs$/) do
  base_jds_url = DefaultLogin.jds_url
  p path = "#{base_jds_url}/vpr/all/index/pt-name"
  # "http://10.2.2.110:9080/vpr/all/index/pt-name"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests cds\-mock data for the domain "(.*?)" in CDS format$/) do |domain|
  temp = QueryCDS.new("dummyClient", domain, "dummyPatient")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests the sync status for patient with pid "(.*?)"/) do |pid|
  base_fhir_url = DefaultLogin.fhir_url
  p path = "#{base_fhir_url}/admin/sync/#{pid}"
  # "https://10.3.3.5/admin/sync/10108"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
When(/^the client requests pid and dfn for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("lab", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests pid for the patient "(.*?)" in VPR format$/) do |pid|
  temp = QueryVPR.new("vital", pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests demographics from the multiple system for the patient "(.*?)" in VPR format$/) do |pid|
  base_jds_url = DefaultLogin.jds_url
  p path = "#{base_jds_url}/vpr/mpid/#{pid}"
  # http://10.2.2.110:9080/vpr/mpid/9E7A;100603
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
