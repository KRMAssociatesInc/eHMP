

When(/^the client adds a notes for patient "(.*?)" with content "(.*?)"$/) do |pid, content|
  path = String.new(DefaultLogin.rdk_writeback_url)
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path+"/resource/write-health-data/patient/#{pid}/notes", content, { "Content-Type"=>"application/json" })
end

When(/^the client requests unsigned notes for the patient "(.*?)"$/) do |pid|
  path = String.new(DefaultLogin.rdk_writeback_url)
  @response = HTTPartyWithBasicAuth.get_with_authorization(path+"/resource/write-health-data/patient/#{pid}/notes")
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["notes"]
  @localid_delete = result_array[result_array.size-1]["localId"]
end

When(/^the client requests to delete an unsigned notes for the patient "(.*?)"$/) do |pid|
  path = String.new(DefaultLogin.rdk_writeback_url)
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path +"/resource/write-health-data/patient/#{pid}/notes/#{@localid_delete}")
end
