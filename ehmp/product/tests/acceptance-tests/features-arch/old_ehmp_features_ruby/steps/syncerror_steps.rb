class SiteInitialize
  def site_initialize
    define_source_site = { 'PANORAMA' => '9E7A', 'KODAK' => 'C877', 'DOD' => 'DOD', 'DAS' => 'DAS', 'HDR' => 'HDR', 'VLER' => 'VLER' }
    return define_source_site
  end
end

Then(/^the client receives the expected domain$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  define_source = SiteInitialize.new
  @define_source_site = define_source.site_initialize
  check_site_match(table)
  check_expected_domain_match(table)
end

Then(/^the client will not receive sync error$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  define_source = SiteInitialize.new
  @define_source_site = define_source.site_initialize
 # check_site_match(table)
  check_expected_syncerror_match(table)
end

def check_site_match(table)
  site_name_expected = []
  site_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"].keys
  table.rows.each do |site_name, expected_domain|
    site_name = site_name.upcase
    site_name_expected << @define_source_site[site_name]
  end
  fail "Expected site: '#{site_name_expected}' \ngot:           '#{site_array}'" unless (site_name_expected - site_array).empty?
end 

def check_site_match_syncerror(table)
  site_name_expected = []
  site_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"].keys
  table.rows.each do |site_name|
    site_name = site_name.upcase
    p site_name
    p site_name_expected
    site_name_expected << @define_source_site[site_name]
  end
  fail "Expected site: '#{site_name_expected}' \ngot:           '#{site_array}'" unless (site_name_expected - site_array).empty?
end 

def check_expected_domain_match(table)
  expected_domain_match = []
  expected_domain_and_site = []
  table.rows.each do |site_name, expected_domain|
    site_name = site_name.upcase
    source_site_name = @define_source_site[site_name]
    result_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"][source_site_name]["domainExpectedTotals"].size
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

def create_error_message(expected_domain_and_site)
  error_mesg = ""
  expected_domain_and_site.each do |site_name, expected_domain, run_time_domain|
    error_mesg = error_mesg + "Site name:" + site_name + "  Expected:" + expected_domain + "  got :" + run_time_domain + ". \n"
  end
  return error_mesg
end

def check_expected_syncerror_match(table)
  expected_syncerror_match = []
  expected_syncerror_and_site = []
  table.rows.each do |site_name, k|
    site_name = site_name.upcase
    source_site_name = @define_source_site[site_name]
    result_array = @json_object["data"]["items"][0]["syncStatusByVistaSystemId"][source_site_name]["domainExpectedTotals"]["syncerror"]
    result_array = result_array.to_s
    expected_syncerror = ""
    if expected_syncerror == result_array
      expected_syncerror_match << true
    else
      expected_syncerror_match << false
      expected_syncerror_and_site << [site_name] + [expected_syncerror] + [result_array]
    end 
  end
  error_message = create_error_message(expected_syncerror_and_site) unless expected_syncerror_and_site.empty?
  fail error_message unless expected_syncerror_and_site.empty?
end

def create_error_message(expected_syncerror_and_site)
  error_mesg = ""
  expected_syncerror_and_site.each do |site_name, expected_syncerror, run_time_syncerror|
    error_mesg = error_mesg + "Site name:" + site_name + "  Expected:" + expected_syncerror + "  got :" + run_time_syncerror + ". \n"
  end
  return error_mesg
end
