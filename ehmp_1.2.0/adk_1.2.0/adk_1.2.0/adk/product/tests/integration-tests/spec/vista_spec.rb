# Encoding: utf-8
require 'spec_helper'
include SpecHelper

SERVICES.select { |name| name.start_with? 'vista' }.each do |vista_host, vista_info|

  describe "VistA (#{vista_host})" do

    let(:host)     { SERVICES[vista_host]['ip'] }

    describe 'FMQL' do

      let(:port)     { SERVICES[vista_host]['services']['fmql']['port'] }
      let(:protocol) { SERVICES[vista_host]['services']['fmql']['ssl'] ? 'https' : 'http' }
      let(:base_uri) { "#{protocol}://#{host}:#{port}" }

      # Smoke Test
      context 'when working' do
        it 'reponds with Rambler homepage' do
          response = HTTParty.get(
            base_uri
          )
          expect(response.code).to eq(200)
        end
      end

      # Operational Test
      context 'REST API' do
        it 'responds to queries' do
          response = HTTParty.post(
            URI.encode("#{base_uri}/fmqlEP?fmql=SELECT 2 LIMIT 10")
          )
          expect(response.code).to eq(200)
          expect(response.headers['Content-Type']).to eq('application/json')
          expect(response.parsed_response['count']).to eq('10')
          expect(response.parsed_response['fmql']['OP']).to eq('SELECT')
          expect(response.parsed_response['fmql']['TYPELABEL']).to eq('PATIENT')
        end

      end

    end

  end

end
