path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

When(/^a user "(.*?)" with password "(.*?)" requests demographics for that patient "(.*?)" in VPR format$/) do |user, pass, pid|
  p path = QueryVPR.new("patient", pid, "false").path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, user, pass)
end

When(/^the client requests demographics for that patient "(.*?)" in VPR format$/) do |pid|
  p path = QueryVPR.new("patient", pid, "false").path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client breaks glass and repeats a request for demographics for that patient "(.*?)" in VPR format$/) do |pid|
  p path = QueryVPR.new("patient", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
