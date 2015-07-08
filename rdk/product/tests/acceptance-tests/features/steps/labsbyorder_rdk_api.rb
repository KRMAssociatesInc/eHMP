When(/^the client requests lab orders for the patient "(.*?)" and order "(.*?)" in VPR format from RDK API$/) do |pid, uid|
  path = QueryRDKAPI.new("#{uid}", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
