#http://10.4.4.105:8888/patientrecord/labpanels?pid=9E7A%3B1&_ack=true&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class LabsByPanel < BuildQuery
  def initialize(parameter_hash_table)
    super()
    title = "patient-record-labsbypanel"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0

    parameter_hash_table.each do |key, value|
      add_parameter(key, value) unless value.nil? || value.empty?
    end
  end # initialize
end # class

When(/^the client requests a response in VPR format from RDK API with the labsbypanel parameters$/) do |parameter_table|
  parameter_hash_table = parameter_table.hashes[0]
  path = LabsByPanel.new(parameter_hash_table).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
