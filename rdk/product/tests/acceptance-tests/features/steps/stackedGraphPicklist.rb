When(/^the client requests to see the vitals picklist for (\d+) records$/) do |n|
  path = RDKVitalsPicklist.new(n).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to see the labs picklist for (\d+) records$/) do |n|
  path = RDKLabsPicklist.new(n).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to see the meds picklist for (\d+) records$/) do |n|
  path = RDKMedsPicklist.new(n).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
