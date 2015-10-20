When(/^the client requests to see the vitals picklist for (\d+) records$/) do |n|
  query = RDKQuery.new('operational-data-type-vital')
  query.add_parameter("limit", n)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to see the labs picklist for (\d+) records$/) do |n|
  query = RDKQuery.new('operational-data-type-laboratory')
  query.add_parameter("limit", n)
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to see the meds picklist for (\d+) records$/) do |n|
  query = RDKQuery.new('operational-data-type-medication')
  query.add_parameter("limit", n)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
