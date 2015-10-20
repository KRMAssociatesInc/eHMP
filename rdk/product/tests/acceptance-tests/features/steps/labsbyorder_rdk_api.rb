When(/^the client requests lab orders for the patient "(.*?)" and order "(.*?)" in VPR format from RDK API$/) do |pid, uid|
  resource_query = RDKQueryPagination.new('patient-record-labsbyorder')
  resource_query.add_parameter("pid", pid)
  resource_query.add_parameter("uid", "#{uid}")
  resource_query.add_parameter("_ack", 'true')
  path = resource_query.path

  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
