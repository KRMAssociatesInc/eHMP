# Take a Rest Call path concatinate necessary variable data
class QueryPath
  def initialize(start_path)
    @path = String.new(DefaultLogin.hmp_url)
    @path.concat(start_path)
    @path.concat("?_dc=1396988436165")
  end

  def add_pid(pid)
    @path.concat("&pid=#{pid}")
  end

  def add_pagination(row_count)
    @path.concat("&page=1&row.start=0&row.count=#{row_count}")
  end

  def add_start_range(start_range)
    @path.concat("&range.startHL7=#{start_range}")
  end

  def add_arg(name, val)
    @path.concat("&#{name}=#{val}")
  end

  def add_end_range
    end_range = Time.now.strftime("%Y%m%d")
    @path.concat("&range.endHL7=#{end_range}")
  end

  def path
    return @path
  end
end

def query_with_path_custom_arg(path, pid, argname, argvalue)
  query_path = QueryPath.new(path)
  query_path.add_pid pid
  query_path.add_pagination 1000
  query_path.add_arg argname, argvalue
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end

def query_with_path_no_range(path, pid)
  query_path = QueryPath.new(path)
  query_path.add_pid pid
  query_path.add_pagination 1000
  #p query_path.path
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end

def query_with_path(path, pid)
  query_path = QueryPath.new(path)
  query_path.add_pid pid
  query_path.add_pagination 1000
  query_path.add_start_range "19930416"
  query_path.add_end_range
  p query_path.path
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end # query_with_path

def get_dod_document(edipi, eventId, file_extension)
  path = "/documents/dod/#{edipi}/#{eventId}.#{file_extension}"
  query_path = QueryPath.new(path)
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end

def count_number_of_results
  json = JSON.parse(@response.body)
  return json['total']
end # count_number_of_results

def current_item_count_number_of_results
  json = JSON.parse(@response.body)
  # json['data']['currentItemCount']
  return json['data']['currentItemCount']
end # count_number_of_results

Then(/^VPR return (\d+) VistA result\(s\)$/) do |num_expected_results|
#   num_expected_results = @test_patient.search_result_count
  p num_of_actual_results = current_item_count_number_of_results
  p num_expected_results = num_expected_results.to_i
  expect(num_of_actual_results).to be(num_expected_results)
end

Then(/^hmp returns "(.*?)" results$/) do |number_of_results|
  p "This step is deprecated. Stop using it"
  json = JSON.parse(@response.body)
  expect(json['total']).to be(number_of_results.to_i)
end

Then(/^the results contain data group$/) do | table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]

  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output
    found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)

    result_array = json_verify.subarry
    puts json_verify.error_message unless found
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

Then(/^the results contain$/) do | table |
  dateformat = DefaultDateFormat.format
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  allfound = true
  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output

    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.all_matches_date_format(fieldpath, dateformat, [@json_object])
    elsif fieldvaluestring.eql? "IS_SET"
      found = json_verify.defined?([fieldpath], @json_object)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      found = json_verify.object_contains_partial_value(fieldpath, fieldvalue, [@json_object])
    else
      fieldvalue = [fieldvaluestring]
      found = json_verify.object_contains_path_value_combo(fieldpath, fieldvalue, [@json_object])
    end # if
    allfound = allfound && found
    if found == false
      output = json_verify.output
      output.each do | msg|
        p msg
      end # output.each
      puts json_verify.error_message
    end # if found == false

  end # table.rows.each
  expect(allfound).to be_true
end

Then(/^hmp returns "(.*?)" procedure results$/) do |num_procedures|
  json = JSON.parse(@response.body)
  temp = ProcedureJsonVerifier.new
  subset = temp.pull_procedure_subset("Category", "CP", json)
  p subset
  expect(subset.length).to eq(num_procedures.to_i)
end
