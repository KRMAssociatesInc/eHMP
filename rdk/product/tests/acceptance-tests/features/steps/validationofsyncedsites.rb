Then(/^data sync completion will be reported when successful$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]["syncedSites"]
  runtime_array = table.rows[0]
  # expect(result_array).to eq runtime_array
  result_array.should match_array(runtime_array)
end
