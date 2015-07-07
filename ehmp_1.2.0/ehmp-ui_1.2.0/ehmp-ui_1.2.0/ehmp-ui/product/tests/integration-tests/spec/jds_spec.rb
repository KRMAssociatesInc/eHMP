# Encoding: utf-8
require 'spec_helper'
include SpecHelper

describe 'JDS' do

  let(:host)     { SERVICES['jds']['ip'] }
  let(:port)     { SERVICES['jds']['services']['rest']['port'] }
  let(:protocol) { SERVICES['jds']['services']['rest']['ssl'] ? 'https' : 'http' }
  let(:base_uri) { "#{protocol}://#{host}:#{port}" }

  let(:uid)      { 'urn:va:data' }
  let(:data)     do
    'Around the sixteenth century, there emerged in most of the European languages the term “design” or
     its equivalent. . . . Above all, the term indicated that designing was to be separated from doing.'
  end

  # Smoke Test
  context 'when working' do
    it 'responds to /ping' do
      response = HTTParty.get(
        "#{base_uri}/ping",
        headers: {
          'Content-Type' => 'application/json',
          'Accept' => 'application/json'
        }
      )
      expect(response.code).to eq(200)
      expect(response.headers['Content-Type']).to eq('application/json')
      expect(response.parsed_response['status']).to eq('running')
    end
  end

  # Operational Test
  context 'REST API' do
    it 'receives posted data' do
      response = HTTParty.post(
        "#{base_uri}/data",
        body: {
          uid: uid,
          data: data
        }.to_json
      )
      expect(response.code).to eq(201)
      expect(response.headers['Content-Type']).to eq('application/json')
      expect(response.headers['location']).to eq("#{base_uri}/data/#{uid}")
    end

    it 'responds with data' do
      response = HTTParty.get(
        "#{base_uri}/data/#{uid}"
      )
      expect(response.code).to eq(200)
      expect(response.headers['Content-Type']).to eq('application/json')
      expect(response.parsed_response['data']['totalItems']).to eq(1)
      expect(response.parsed_response['data']['items'][0]['data']).to eq(data)
    end

    it 'deletes data' do
      response = HTTParty.delete(
        "#{base_uri}/data/#{uid}"
      )
      expect(response.code).to eq(200)
    end

    it 'responds with error to non-existent data' do
      response = HTTParty.get(
        "#{base_uri}/data/#{uid}"
      )
      expect(response.parsed_response['error']['errors'][0]['reason']).to eq(104)
      expect(response.parsed_response['error']['errors'][0]['message']).to eq('Bad key')
      expect(response.parsed_response['error']['message']).to eq('Not Found')
      expect(response.code).to eq(404)
    end
  end

end
