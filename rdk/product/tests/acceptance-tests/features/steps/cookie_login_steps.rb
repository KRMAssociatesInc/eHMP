require 'QueryRDK.rb'

class BuildQueryWithTitle < BuildQuery
  def initialize(title)
    super()
    domain_path = RDClass.resourcedirectory_fetch.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0
  end
end

When(/^client requests the authentication list without authentication$/) do
  path = RDClass.resourcedirectory_fetch.get_url('authentication-list')
  p path
  @response = HTTParty.get(path)
end

Then(/^the authentication list response contains fields$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = @json_object["data"]["items"]
  search_json(result_array, table)
end

Given(/^the client has logged in with a cookie$/) do
  # The code used in this function was pulled from an example 
  # https://github.com/jnunemaker/httparty/blob/master/examples/tripit_sign_in.rb
  default_auth = HTTPartyWithBasicAuth.auth
  
  access_code = default_auth['accessCode']
  verify_code = default_auth['verifyCode']
  site = default_auth['site']
  jsonreq = { "accessCode"=> access_code, "verifyCode" => verify_code, "site" => site } 
  reqjson = jsonreq.to_json

  authentication_path = RDKQuery.new('authentication-authentication').path
  authentication_response = HTTParty.get(authentication_path)
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(authentication_path, reqjson, { 'Content-Type' => 'application/json', 'Cookie' => authentication_response.headers['Set-Cookie'] })

  @cookie = @response.request.options[:headers]['Cookie']
end

def request_restricted_resource_with_cookie(cookie)
  # the 'restricted resource' choosen was patient-search-pid because it was 
  # identified as a low cost request
  # pid = 10108V420871, was choosen because it is a common patient used in testing

  pid = "10108V420871"
  title = "patient-search-pid"
  query = BuildQueryWithTitle.new(title)
  query.add_parameter('pid', pid)
  path = query.path
  return HTTParty.get path, headers: { 'Cookie' => cookie }
end

Given(/^the client has requested a restricted resource$/) do
  @response = request_restricted_resource_with_cookie @cookie
end

When(/^the client refreshes the session$/) do
  path = RDClass.resourcedirectory_fetch.get_url('authentication-refreshToken')
  p path
  @response = HTTParty.get path, headers: { 'Cookie' => @cookie }
end

Given(/^the client has verified it can access a restricted resource$/) do
  @response = request_restricted_resource_with_cookie @cookie
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^the client destroys the sesion$/) do
  path = RDClass.resourcedirectory_fetch.get_url('authentication-destroySession')
  p path
  @response = HTTParty.delete path, headers: { 'Cookie' => @cookie }
end
