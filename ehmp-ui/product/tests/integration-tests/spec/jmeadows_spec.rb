# Encoding: utf-8
require 'spec_helper'
include SpecHelper

describe 'Jmeadows' do

  let(:host)     { SERVICES['jmeadows']['ip'] }
  let(:port)     { SERVICES['jmeadows']['services']['rest']['port'] }
  let(:protocol) { SERVICES['jmeadows']['services']['rest']['ssl'] ? 'https' : 'http' }
  let(:base_uri) { "#{protocol}://#{host}:#{port}" }

  # Smoke Test
  context 'when working' do
    it 'gets the jMeadows WSDL' do
      response = HTTParty.get(
        "#{base_uri}/jMeadows/JMeadowsDataService?WSDL"
      )
      puts "Jmeadows response.code #{response.code}"
      expect(response.code).to eq(200)
      puts "Jmeadows response.headers['Content-Type'] #{response.headers['Content-Type']}"
      expect(response.headers['Content-Type']).to eq('text/xml;charset=utf-8')
      puts "Jmeadows response.parsed_response['definitions']['types']['schema'][0]['import']['schemaLocation'] #{response.parsed_response['definitions']['types']['schema'][0]['import']['schemaLocation']}"
      expect(response.parsed_response['definitions']['types']['schema'][0]['import']['schemaLocation']).to eq("#{base_uri}/jMeadows/JMeadowsDataService?xsd=1")
    end
    it 'gets the BHIERelayService WSDL' do
      response = HTTParty.get(
        "#{base_uri}/BHIERelayService/BHIERelayService?WSDL"
      )
      puts "BHIERelayService response.code #{response.code}"
      expect(response.code).to eq(200)
      puts "BHIERelayService response.headers['Content-Type'] #{response.headers['Content-Type']}"
      expect(response.headers['Content-Type']).to eq('text/xml;charset=utf-8')
    end
    it 'gets the MockDoDAdaptor' do
      response = HTTParty.get(
        "#{base_uri}/MockDoDAdaptor/"
      )
      puts "MockDoDAdaptor response.code #{response.code}"
      expect(response.code).to eq(200)
    end
  end

  # Operational Test
  context 'SOAP call' do
    it 'gets the patient data from DoD' do
      file = File.open('./resources/jmeadows_request.xml', 'rb')
      xml_contents = file.read
      file.close
      response = HTTParty.post(
        "#{base_uri}/jMeadows/JMeadowsDataService?WSDL",
        headers: {
          'Content-Type' => 'text/xml; charset=utf-8'
        },
        body: xml_contents,
        timeout: 400
      )
      puts response
      puts "Jmeadows response.code #{response.code}"
      expect(response.code).to eq(200)
    end
  end

end
