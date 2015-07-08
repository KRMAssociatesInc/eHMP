# Encoding: utf-8
require 'spec_helper'
include SpecHelper

describe 'Solr' do

  let(:host)     { SERVICES['solr']['ip'] }
  let(:port)     { SERVICES['solr']['services']['http']['port'] }
  let(:protocol) { SERVICES['solr']['services']['http']['ssl'] ? 'https' : 'http' }
  let(:base_uri) { "#{protocol}://#{host}:#{port}" }

  let(:collection) { 'vpr' }
  let(:uid)        { '12358' }
  let(:pid)        { '1729' }
  let(:title)      { 'One Hundred Years of Solitude' }

  # Smoke Test
  context 'when working' do
    it 'responds to /ping' do
      response = HTTParty.get(
        "#{base_uri}/solr/admin/ping",
        query: {
          wt: 'json'
        }
      )
      expect(response.code).to eq(200)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['status']).to eq('OK')
    end
  end

  # Operational Test
  context 'REST API' do
    it 'responds with schema definition' do
      response = HTTParty.get(
        "#{base_uri}/solr/#{collection}/schema"
      )
      expect(response.code).to eq(200)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['schema']['name']).to eq('vpr')
    end

    it 'updates and indexes a document' do
      response = HTTParty.post(
        "#{base_uri}/solr/#{collection}/update?wt=json",
        body: {
          add: {
            doc: {
              uid: uid,
              pid: pid,
              title: title
            },
            boost: 1.0,
            overwrite: true
          },
          commit: {}
        }.to_json,
        headers: {
          'Content-Type' => 'application/json'
        }
      )
      expect(response.code).to eq(200)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['responseHeader']['status']).to eq(0)
    end

    it 'searchs for a document' do
      # see JSON specific search parameters at http://wiki.apache.org/solr/SolJSON
      # Common Query Parameters at http://wiki.apache.org/solr/CommonQueryParameters
      response = HTTParty.get(
        "#{base_uri}/solr/#{collection}/select",
        query: {
          q: "uid:#{uid}",
          wt: 'json'
        },
        headers: {
          'Accept' => 'application/json'
        }
      )
      expect(response.code).to eq(200)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['response']['numFound']).to eq(1)
      expect(parsed_response['response']['docs'][0]['uid']).to eq(uid)
      expect(parsed_response['response']['docs'][0]['title']).to include(title)
    end

    it 'removes an indexed document' do
      # see https://wiki.apache.org/solr/UpdateJSON for available update commands
      response = HTTParty.post(
        "#{base_uri}/solr/#{collection}/update?wt=json",
        body: {
          delete: {
            query: '*:*'
          },
          commit: {}
        }.to_json,
        headers: {
          'Content-Type' => 'application/json'
        }
      )
      expect(response.code).to eq(200)

      response = HTTParty.get(
        "#{base_uri}/solr/#{collection}/select",
        query: {
          q: "uid:#{uid}",
          wt: 'json',
          indent: 'true'
        }
      )
      expect(response.code).to eq(200)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['response']['numFound']).to eq(0)
    end
  end

end
