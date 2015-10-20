When(/^the client requests for the patient param"(.*?)" and pid "(.*?)"$/) do |arg1, arg2|
  query = RDKQuery.new('write-back-outpatient-med-formulary')
  query.add_parameter("param", arg1) 
  query.add_parameter("pid", arg2) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^wait (\d+) seconds$/) do |seconds|
  sleep seconds.to_i
end
