When(/^the client requests lab orders for the patient "(.*?)" and order "(.*?)" in VPR format$/) do |pid, uid|
  #https://10.3.3.5/vpr/11016/labs/urn:va:order:9E7A:227:16682
  path = QueryVPR.new("labs/#{uid}", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests lab orders for the patient "(.*?)" and order "(.*?)" in VPR format from RDK API$/) do |pid, uid|
  #http://10.4.4.105:8888/patientrecord/labsbyorder?pid=11016&orderUid=urn:va:order:9E7A:227:16682
  path = QueryRDK.new("#{uid}", pid).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
