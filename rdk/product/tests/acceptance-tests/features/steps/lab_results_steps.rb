class LabResultsByTypeQuery < BuildQuery
  def initialize(parameter_hash_table)
    super()
    title = "patient-record-labsbytype"
    domain_path = RDClass.resourcedirectory_fetch.get_url(title)
    @path.concat(domain_path)
    @number_parameters = 0

    parameter_hash_table.each do |key, value|
      add_parameter(key, value) unless value.nil? || value.empty?
    end
  end # initialize
end # LabResultsByTypeQuery

def validate_result_counts(total_items, current_items, start_index)
  json = JSON.parse(@response.body)

  total_items = total_items.to_i
  query_total_items = json["data"]["totalItems"]
  expect(query_total_items).to eq(total_items), "recieved incorrect value for totalItems: expected #{total_items} received #{query_total_items}"

  current_items = current_items.to_i
  query_current_items = json["data"]["currentItemCount"]
  expect(query_current_items).to eq(current_items), "recieved incorrect value for currentItemCount: expected #{current_items} received #{query_current_items}"

  query_items = json["data"]["items"]
  expect(query_items.length).to eq(current_items), "recieved incorrect number of items: expected #{current_items} received #{query_items.length}"

  unless start_index.nil?
    start_index = start_index.to_i
    query_start_index = json["data"]["startIndex"]
    expect(query_start_index).to eq(start_index), "recieved incorrect value for startIndex: expected #{start_index} received #{query_start_index}"
  end
end

Then(/^the client receives "(\d+)" total items but only "(\d+)" current items$/) do |total_items, current_items|
  validate_result_counts(total_items, current_items, nil)
end

Then(/^the client receives "(\d+)" total items but only "(\d+)" current items with a start index of "(\d+)"$/) do |total_items, current_items, start_index|
  validate_result_counts(total_items, current_items, start_index)
end

When(/^the client requests a response in VPR format from RDK API with the parameters$/) do |parameter_table|
  parameter_hash_table = parameter_table.hashes[0]
  path = LabResultsByTypeQuery.new(parameter_hash_table).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
