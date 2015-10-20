class SiteInitialize
  def site_initialize
    define_source_site = { 'PANORAMA' => '9E7A', 'KODAK' => 'C877', 'DOD' => 'DOD', 'DAS' => 'DAS', 'HDR' => 'HDR' }
    return define_source_site
  end
end

When(/^the client requests sync with immediate response within (\d+) second for the patient "(.*?)" in RDK format$/) do |time_out, pid|
  # "http://10.4.4.105:8888/sync/load?pid=11016V630869&immediate=true"
  # path = QueryRDKSync.new("load", pid).add_parameter("immediate", "true")
  temp = RDKQuery.new('synchronization-load')
  temp.add_parameter("pid", pid)
  temp.add_parameter("immediate", "true")
  path = temp.path
  @response = nil

  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path, time_out.to_i)
  rescue Exception => e
    p "Time out; " + e 
  end

  fail "Time out; " if @response.nil?
  expect(@response.code).to eq(201), "code: #{@response.code}, body: #{@response.body}" 
end

Then(/^the sync immediate response will be reported the sync status without waiting for sync to completed$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"].keys
  runtime_array = table.rows[0]

  result_array.should match_array(runtime_array)
end
