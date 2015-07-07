class AuditTestUsers
  @@users = {}

  @@users["B362;pu1234"] = "pu1234!!"
  @@users["UnauthorizedUser"] = "pa55w0rd"
  @@users["AuditLogTester"] = "xx1234!!"

  def self.password_for(username)
    return @@users[username]
  end
end

Given(/^an authorized client "(.*?)" has requested allergies for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("allergy", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, AuditTestUsers.password_for(username))
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

end

Given(/^an authorized client "(.*?)" has requested vitals for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("vital", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, AuditTestUsers.password_for(username))
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

end

When(/^audit logs for patient "(.*?)" are requested$/) do |pid|
  path = QueryRDKAudit.new("patient", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, "AuditLogTester", AuditTestUsers.password_for("AuditLogUser"))
  #expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^the audit log entry contains$/) do |table|
  dateformat = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d-\d\d:\d\d/

  @json_object = JSON.parse(@response.body)

  json_verify = JsonVerifier.new

  audit_array = @json_object["log"]
  expect(audit_array.length).to be > 0
  result_array = []
  result_array.push(audit_array[audit_array.length-1])

  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output
    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.matches_date_format(fieldpath, dateformat, result_array)
    elsif fieldvaluestring.eql? "IS_SET"
      found = json_verify.defined?([fieldpath], result_array)
    elsif fieldvaluestring.eql? "IS_NOT_SET"
      found = json_verify.not_defined?([fieldpath], result_array)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      found = json_verify.object_contains_partial_value(fieldpath, fieldvalue, result_array)
    else
      found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)
      result_array = json_verify.subarry
    end

    if found == false
      output = json_verify.output
      output.each do | msg|
        p msg
      end #output.each
      puts "for field #{fieldpath}: #{json_verify.error_message}"
    end # if found == false
    expect(found).to be_true
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

When(/^audit logs for user "(.*?)" are requested$/) do |username|
  path = QueryRDKAudit.new("user", username).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, "AuditLogUser", AuditTestUsers.password_for("AuditLogUser"))
end

Given(/^the rdk audit logs are cleared$/) do
  base_path = DefaultLogin.rdk_url
  path = "#{base_path}/audit/clear"
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, "AuditLogUser", AuditTestUsers.password_for("AuditLogUser"))
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

if __FILE__ == $PROGRAM_NAME
  p AuditTestUsers.password_for("B362;pu1234")
  p AuditTestUsers.password_for("badname")
end
