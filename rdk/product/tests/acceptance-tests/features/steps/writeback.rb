When(/^the client requests for the patient param"(.*?)" and pid "(.*?)"$/) do |arg1, arg2 |
  path = Writeback.new(arg1, arg2).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^wait (\d+) seconds$/) do |seconds|
  sleep seconds.to_i
end
