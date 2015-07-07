require 'rspec/expectations'
require 'httparty'
require 'json'
require 'rexml/document'
require 'jsonpath'
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultHmpLogin.rb'

base_url = DefaultLogin.hmp_url
When(/^I search for (JSON|XML) "(.*?)" Resources with a "(.*?)" of "(.*?)"$/) do |format, rt, sp, sv|
  @format = format.downcase
  data_href = "#{base_url}/fhir/#{rt}?_format=#{@format}&#{sp}=#{sv}"
  p data_href
  @response = HTTPartyWithCookies.get_with_cookies(data_href)
end

Then(/^the response is successful$/) do
  expect(@response.code).to eq 200, "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^the reponse contains JSON with$/) do | table |
  case @format
  when "json"
    @fhir_bundle = JSON.parse(@response.body)
    table.rows.each do | row |
      path = row[0]
      expected = row[1]
      expect(JsonPath.on(@fhir_bundle, path).map(&:to_s)).to include expected
    end
  when "xml"
    fail "pending"
  end
end

Then(/^the endpoint responds back with a json object$/) do
  expect { JSON.parse(@response.body) }.to_not raise_error
end

When(/^client requests patient data via the allergy fhir resource for patient "(.*?)"$/) do |patientid|
  url_path = "/fhir/AdverseReaction?_format=json&subject.identifier=#{patientid}"
  full_path = "#{base_url}#{url_path}"
  @response = HTTPartyWithCookies.get_with_cookies(full_path)
end
