require 'rspec'
require 'httparty'
require 'json'
require 'pp'


url = ENV['BACKEND_BASEURL'] || 'https://10.2.3.5'

describe "Test rdk" do
  
  #before :each do
  #end

  #after :each do
  #end

  it "should greet with default name" do
  	response = HTTParty.get(
      "#{url}/hello-world",
      :query => {}, 
      :headers => {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }
    )
  	expect(response.code).to eq(200)
  	expect(response['content']).to eq('Hello, Stranger!')
  end

  it "should say what I tell it to" do
  	response = HTTParty.post(
      "#{url}/hello-world",
      :body => {
      	"id" => 1,
        "content" => "Hello Fuzzy Bunny!"
      }.to_json, 
      :headers => {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }
    )
  	expect(response.code).to eq(200)
  	expect(response['content']).to eq('Hello Fuzzy Bunny!')
  end

  it "should greet with with protected endpoint" do
    response = HTTParty.get(
      "#{url}/protected", 
      :basic_auth => {
          :username =>  'FuzzyB',
          :password => 'secret'
      },
      :query => {}, 
      :headers => {
        'Content-Type' => 'text/plain',
        'Accept' => 'text/plain'
      }
    )
    expect(response.code).to eq(200)
    expect(response.parsed_response).to eq('Hey there, FuzzyB. You know the secret!')
  end

end
