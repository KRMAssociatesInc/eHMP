require 'QueryRDK.rb'

class QueryRDKSearchDetail < BuildQuery
  def initialize
    super
    domain_path = RDClass.resourcedirectory_fetch.get_url("patient-record-search-detail")
    @path.concat(domain_path)
  end
end

When(/^the client searches$/) do |table|
  build_query = QueryRDKSearchDetail.new

  table.rows.each do |key, value|
    build_query.add_parameter(key, value)
  end
  path = build_query.path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the response contains (\d+) results$/) do |total|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]
  expect(result_array.length.to_s).to eq(total), "response total groups was #{total}: response body #{result_array.length}"
end

Then(/^the search results contain$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = @json_object["data"]["items"]
  search_json(result_array, table)
end
