When(/^a patient with pid "(.*?)" has been synced through Admin API and wait (\d+) second for the response$/) do |pid, tiem_out|
  base_url = DefaultLogin.fhir_url
  p path = "#{base_url}/admin/sync/#{pid}"
  begin
    @response = HTTPartyWithBasicAuth.put_with_authorization(path, tiem_out)
  rescue Timeout::Error
    p "Sync timed out"
  end
end
