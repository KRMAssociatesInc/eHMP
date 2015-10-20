class SiteInitialize
  def site_initialize
    define_source_site = { 'PANORAMA' => '9E7A', 'KODAK' => 'C877', 'DOD' => 'DOD', 'DAS' => 'DAS', 'HDR' => 'HDR' }
    return define_source_site
  end
end

When(/^the client requests sync status for the patient "(.*?)" in RDK format$/) do |pid|
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  path = temp.path

  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  rescue Exception => e
    puts "Time out; " + e
  end
  
  expect(@response.code).to eq(200), "code: #{@response.code}, body: #{@response.body}"
end

When(/^the client requests sync data status for the patient "(.*?)" in RDK format$/) do |pid|
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  path = temp.path

  @response = nil
  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  rescue Exception => e
    puts "Time out; " + e
  end

  if @response.nil?
    fail "Time out on sync/datastatus"
  else
    expect(@response.code).to eq(200), "code: #{@response.code}, body: #{@response.body}"
  end
  
end

Then(/^the data status attribute should be true$/) do
  rdk_json_object = JSON.parse(@response.body)
  data_status_attribute = rdk_json_object.values
  result_status_value = []
  data_status_attribute.each do |attribute_value|
    if attribute_value.class == Hash
      result_status_value = attribute_value.values
    else
      result_status_value << attribute_value
    end
  end
  fail "Expected result: True \n got: false \n Body: #{rdk_json_object} "  if result_status_value.include? false 
end

Then(/^the data status attribute for "(.*?)" should be true if all other attributes are true$/) do |_arg1|
  rdk_json_object = JSON.parse(@response.body)
  all_sites = rdk_json_object["allSites"]
  data_status_attribute = rdk_json_object.values
  result_status_value = []
  data_status_attribute.each do |attribute_value|
    if attribute_value.class == Hash
      result_status_value = attribute_value.values
    else
      result_status_value << attribute_value
    end
  end

  if all_sites
    fail "Expected result: False \n got: True \n Body: #{rdk_json_object} "  if result_status_value.include? false 
  else
    fail "Expected result: True \n got: False \n Body: #{rdk_json_object} "  unless result_status_value.include? false 
  end
  
end

Then(/^the data stored attribute should be true when the expected domain for RDK match with JDS for the patient "(.*?)"$/) do |pid|
  rdk_json_object = JSON.parse(@response.body)
  rdk_json_sync_status = rdk_json_object["data"]["items"][0]["syncStatusByVistaSystemId"]  

  runtime_save_status = rdk_json_object["dataStored"]
  expect(runtime_save_status).to be_true

  jds_json_object = jds_call(pid)
  jds_json_sync_status =jds_json_object["data"]["items"][0]["syncStatusByVistaSystemId"]

  site_name = check_site_name_match(rdk_json_sync_status, jds_json_sync_status)

  not_matach_domain = check_expected_domain_match(site_name, rdk_json_sync_status, jds_json_sync_status)

  error_message = create_error_message(not_matach_domain) unless not_matach_domain.empty?
  fail error_message unless not_matach_domain.empty?
end

When(/^the client requests load parioitized for the patient "(.*?)" base on priority site list in RDK format$/) do |pid, table|
  # p path = QueryRDKSync.new("loadPrioritized", pid).add_parameter("prioritySelect", "userSelect")
  temp = RDKQuery.new('synchronization-loadPrioritized')
  temp.add_parameter("pid", pid)
  temp.add_parameter("prioritySelect", "userSelect")
  path = temp.path
  define_source = SiteInitialize.new
  @define_source_site = define_source.site_initialize

  table.rows.each do |site_name, _k|
    site_name = site_name.upcase
    p path += "&prioritySite=#{@define_source_site[site_name]}"
  end
  
  @response = nil
  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  rescue Exception => e
    puts "Time out; " + e
  end
  
  if @response.nil?
    fail "Time out on loadPrioritized"
  else
    expect(@response.code).to eq(201), "code: #{@response.code}, body: #{@response.body}"
  end
end

Then(/^the site "(.*?)" should be sync before "(.*?)"$/) do |site_name1, site_name2|
  
  p expect(check_symc_complete_for_site(site_name1)).to be_true
  p expect(check_symc_complete_for_site(site_name2)).to be_false
end

def check_symc_complete_for_site(site_name)
  rdk_json_object = JSON.parse(@response.body)
  site_name = site_name.upcase
  source_site_name = @define_source_site[site_name]

  result_site_name = rdk_json_object["data"]["items"][0]["syncStatusByVistaSystemId"].keys
  fail "Expected: #{site_name} \n got: #{result_site_name} " unless result_site_name.include? source_site_name
  
  sync_complete = rdk_json_object["data"]["items"][0]["syncStatusByVistaSystemId"][source_site_name]["syncComplete"]
  return sync_complete
end

# Then(/^the sync status result will get back base on priority site list for the patient "(.*?)"$/) do |pid, table|

#   p rdk_json_object = JSON.parse(@response.body)
#   sd
#   base_url = DefaultLogin.jds_url
#   p jds_path = "#{base_url}/data/find/syncstatus?filter=eq(pid,#{pid})"

#   p rdk_path = QueryRDKSync.new("load", pid).path
  
#   jds_sync_complete = false
#   while jds_sync_complete == false
#     table.rows.each do |site_name, k|
#       site_name = site_name.upcase
#       source_site_name = @define_source_site[site_name]
#       p jds_sync_complete = check_symc_complete(jds_path, source_site_name)
#       if jds_sync_complete
#         rdk_response = HTTPartyWithBasicAuth.get_with_authorization(rdk_path)
#         p rdk_sync_complete = check_symc_complete(rdk_path, source_site_name)
#       end
#     end
#   end
# end

def check_expected_domain_match(sites_name, rdk_json_object, jds_json_object)
  not_matach_domain = []
  table = sites_name[0]
  table.each do |site_name, _i|
    rdk_expected_domain = rdk_json_object[site_name]["domainExpectedTotals"].size
    jds_expected_domain = jds_json_object[site_name]["domainExpectedTotals"].size
    unless jds_expected_domain == rdk_expected_domain
      not_matach_domain << [site_name, rdk_expected_domain, jds_expected_domain]
    end
  end
  return not_matach_domain
end

def check_site_name_match(rdk_json_object, jds_json_object)
  rdk_site_name = rdk_json_object.keys  
  jds_site_name = jds_json_object.keys

  fail "Expected site: '#{jds_site_name}' \ngot:           '#{rdk_site_name}'" unless (jds_site_name - rdk_site_name).empty?
  return rdk_site_name, jds_site_name
end

def check_symc_complete(path, source_site_name)
  response = HTTPartyWithBasicAuth.get_with_authorization(path)
  sync_complete = response["data"]["items"][0]["syncStatusByVistaSystemId"][source_site_name]["syncComplete"]
  return sync_complete
end

def check_site_match(table, json_sync_status)
  site_name_expected = []
  site_array = json_sync_status.keys
  # site_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"].keys
  table.rows.each do |site_name, _expected_domain|
    site_name = site_name.upcase
    site_name_expected << @define_source_site[site_name]
  end
  fail "Expected site: '#{site_name_expected}' \ngot:           '#{site_array}'" unless (site_name_expected - site_array).empty?
end	

def old_check_expected_domain_match(table, json_sync_status)
  expected_domain_match = []
  expected_domain_and_site = []
  table.rows.each do |site_name, expected_domain|
    site_name = site_name.upcase
    source_site_name = @define_source_site[site_name]
    result_array = json_sync_status[source_site_name]["domainExpectedTotals"].size
    # result_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"][source_site_name]["domainExpectedTotals"].size
    result_array = result_array.to_s
    if expected_domain == result_array
      expected_domain_match << true
    else
      expected_domain_match << false
      expected_domain_and_site << [site_name] + [expected_domain] + [result_array]
    end	
  end
  error_message = create_error_message(expected_domain_and_site) unless expected_domain_and_site.empty?
  fail error_message unless expected_domain_and_site.empty?
end

def jds_call(pid)
  base_url = DefaultLogin.jds_url
  p path = "#{base_url}/data/find/syncstatus?filter=eq(pid,#{pid})"
  @response = nil
  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  rescue Exception => e
    puts "Time out; " + e
  end

  if @response.nil?
    fail "JDS Time out"
  else
    expect(@response.code).to eq(200), "code: #{@response.code}, body: #{@response.body}"
    json_object = JSON.parse(@response.body)
  end
  return json_object
end

def create_error_message(expected_domain_and_site)
  error_mesg = ""
  expected_domain_and_site.each do |site_name, expected_domain, run_time_domian|
    error_mesg = error_mesg + "Site name:" + site_name + "  --  Expected RDK domain: " + expected_domain.to_s + "  --  Expected JDS domain: " + run_time_domian.to_s + ". \n"
  end
  return error_mesg
end
