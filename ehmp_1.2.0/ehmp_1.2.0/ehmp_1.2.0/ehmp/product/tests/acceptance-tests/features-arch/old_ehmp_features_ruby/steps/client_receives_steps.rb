path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

class DefaultInitialize
  def site_initialize
    define_source_site = { 'VISTA' => 'nosource', 'PANORAMA' => /urn:va:.*:9E7A/, 'KODAK' => /urn:va:.*:C877/, 'DOD' => /urn:va:.*:DOD/ }
    return define_source_site
  end
end

Then(/^the client receives (\d+) VPR "(.*?)" result\(s\)$/) do |number_of_results, site_name|
  fail "Expected response code 200, received #{@response.code}: response body #{@response.body}" unless @response.code == 200
  runtime_json_object = JSON.parse(@response.body)
  total_size = runtime_json_object['data']['totalItems']

  fieldsource = "data.items.uid"
  default_site = DefaultInitialize.new
  define_source_site = default_site.site_initialize

  find_json = FindJsonValueForField.new
  source_allvalues = find_json.find_value_from_json_for_field(runtime_json_object, fieldsource)
  
  errors = "There is no recourd returned."
  fail errors unless source_allvalues.size > 0
  
  count_value = CountValue.new
  count_source = count_value.count_source_allvalues(define_source_site, source_allvalues)
  find_site_value = count_value.find_site_value_from_source(define_source_site, count_source, site_name)
  expect(find_site_value).to eq(number_of_results.to_i)
end

When(/^the client receives (\d+) FHIR "(.*?)" result\(s\)$/) do |number_of_results, site_name|
  fail "Expected response code 200, received #{@response.code}: response body #{@response.body}" unless @response.code == 200
  runtime_json_object = JSON.parse(@response.body)
  
  fieldsource = "entry.content.identifier.value"
  default_site = DefaultInitialize.new
  define_source_site = default_site.site_initialize

  find_json = FindJsonValueForField.new
  source_allvalues = find_json.find_value_from_json_for_field(runtime_json_object, fieldsource)

  errors = "There is no recourd returned."
  fail errors unless source_allvalues.size > 0
  
  count_value = CountValue.new
  count_source = count_value.count_source_allvalues(define_source_site, source_allvalues)
  find_site_value = count_value.find_site_value_from_source(define_source_site, count_source, site_name)
  expect(find_site_value).to eq(number_of_results.to_i)
end

class CountValue
  def count_source_allvalues(define_source_site, source_allvalues)
    @num_vista_results = 0
    @num_kodak_results = 0
    @num_panorama_results = 0
    @num_dod_results = 0
    num_results = {}
    @not_define_value = []    
    @source_dod = define_source_site["DOD"]
    @source_panorama = define_source_site["PANORAMA"]
    @source_kodak = define_source_site["KODAK"]

    if source_allvalues.class == Array
      @total_size = source_allvalues.size
      source_allvalues.each do | value |
        num_results = count_num_of_host(value)
      end
    else
      @total_size = 1
      num_results = count_num_of_host(source_allvalues)
    end
    return num_results
  end
  
  def count_num_of_host(value)
    if @source_panorama.match(value) != nil
      @num_panorama_results = @num_panorama_results + 1
    elsif @source_kodak.match(value) != nil
      @num_kodak_results = @num_kodak_results + 1
    elsif @source_dod.match(value) != nil
      @num_dod_results = @num_dod_results + 1
    else
      @not_define_value << value
    end
    num_results = { 'TOTAL' => @total_size, 'VISTA' => @num_panorama_results + @num_kodak_results, 'PANORAMA' => @num_panorama_results, 'KODAK' => @num_kodak_results , 'DOD' => @num_dod_results }
    return num_results
  end

  def find_site_value_from_source(define_source_site, count_source, site_name)
    source_sites_name = define_source_site.keys
    site_name_include = source_sites_name.include? site_name.upcase
    
    errors = "The request site name [#{site_name}] did not find on define sites: #{source_sites_name} "
    fail errors unless site_name_include
    
    unless count_source['TOTAL'] == count_source['PANORAMA'] + count_source['KODAK'] + count_source['DOD']
      puts '*************************************************************'
      puts '*                                                           *'
      puts '* There is some other undefine site(s) found in the result: *'
      @not_define_value.each do |value|
        puts '* ' + value
      end
      puts '*                                                           *'
      puts '*************************************************************'
    end
    return count_source[site_name.upcase]
  end
end

Then(/^corresponding matching FHIR records totaling "(.*?)" are displayed$/) do |total|
  fail "Expected response code 200, received #{@response.code}: response body #{@response.body}" unless @response.code == 200
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["totalResults"]
  expect(result_array.to_s).to eq(total), "response total items was #{total}: response body #{result_array}"
end
