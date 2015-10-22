path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'QueryRDK.rb'
#require 'createorder.json'

class LabOrdersByTypeQuery < BuildQuery
  def initialize(parameter_hash_table)
    super()
    title = "write-health-data"    
    base_url = DefaultLogin.rdk_url
    writeback_url= DefaultLogin.rdk_writeback_url
    path = "#{base_url}/resource/resourcedirectory"
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    # /patient/9E7A;100470/orders?accessCode=mx1234&verifyCode=mx1234!!&site=9E7A&pid=9E7A;100470"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p domain_path
    p "domain path: #{domain_path}"
    #@path.concat(domain_path) 
    @path = "#{writeback_url}/resource/resourcedirectory/write-health-data/patient/9E7A;100470/orders?accessCode=mx1234&verifyCode=mx1234!!&site=9E7A&pid=9E7A;100470" 
    p "path: #{path}"
    p @path

    
    parameter_hash_table.each do |key, value|
      add_parameter(key, value) unless value.nil? || value.empty?
    end
  end # initialize
end # LabOrdersByTypeQuery

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

#When(/^the client request a response in VPR format from RDK API with the parameters$/) do |parameter_table|
#  parameter_hash_table = parameter_table.hashes[0]
#  p parameter_hash_table
#  path = LabOrdersByTypeQuery.new(parameter_hash_table).path
#  p path
#  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
#end

When(/^the client request a response in VPR format from RDK API with the parameters$/) do
  #path = LabOrdersByTypeQuery.new(parameter_hash_table).path 
  #@response = HTTPartyWithBasicAuth.get_with_authorization(path)
  #p Dir.entries './features/steps'
  HTTParty.post("http://10.4.4.105:9999/resource/write-health-data/patient/9E7A;100472/orders?accessCode=mx1234&verifyCode=mx1234!!&site=9E7A&pid=9E7A;100472",
                {
                  body:       File.read('./features/steps/create_order.json'),
                  headers:   
                 { 'Content-Type' => 'application/json', 
                   'Accept' => 'application/json' }     
                })  
end

Then(/^the VPR result contain$/) do |table|
  @response=HTTParty.get("http://10.2.2.110:9080/vpr/9E7A;100472/find/order",
                         {       
                           headers: { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }      
                         })  
  
  @json_object = JSON.parse(@response.body)
  #puts @json_object.class
  #puts @json_object['content']
  
  #json_verify = JsonVerifier.new
  #puts '**************************'
  #  items_ary = @json_object["data"]["items"]
  #  last_index = (items_ary.length) - 1
  #  puts items_ary[last_index]['localId']
    
  #  @json_object["data"]["items"].each do |item_ary|
  #    puts item_ary[item_ary.length]['localId']
  #  end
  # @order_id=@response.body(localId)
  #p @order_id
  result_array = @json_object["data"]["items"]
  #puts '**************************'
  #puts result_array.inspect
  search_json(result_array, table)  
end

When(/^the client updates order in VPR format from RDK API with the parameters$/) do 
  #@response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @response=HTTParty.get("http://10.2.2.110:9080/vpr/9E7A;100472/find/order",
                         {       
                           headers: { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }
                             
                         }) 
  @json_object = JSON.parse(@response.body)
  items_ary = @json_object["data"]["items"]
  last_index = (items_ary.length) - 1
  puts order_id=items_ary[last_index]['localId']
    
  @object=JSON.parse(File.read('./features/steps/update_order.json'))
  @object['orderId'] = order_id
  @object = @object.to_json
  File.write('./features/steps/update_order.json', @object)

  HTTParty.put("http://10.4.4.105:9999/resource/write-health-data/patient/9E7A;100472/orders/order_id;1?accessCode=mx1234&verifyCode=mx1234!!&site=9E7A&pid=9E7A;100472",
               { 
                 body:    File.read('./features/steps/update_order.json'),
                 headers: { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }   
               })
end

When(/^the client discontinues order in VPR format from RDK API with the parameters$/) do 
  #@response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @response=HTTParty.get("http://10.2.2.110:9080/vpr/9E7A;100472/find/order",
                         { 
                          
                           headers: { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }
                          
                         }) 
  @json_object = JSON.parse(@response.body)
  items_ary = @json_object["data"]["items"]
  last_index = (items_ary.length) - 1
  puts order_id=items_ary[last_index]['localId']
    
  @object=JSON.parse(File.read('./features/steps/discontinue_order.json'))
  @object['orderId'] = order_id
  @object = @object.to_json
  File.write('./features/steps/discontinue_order.json', @object)
  
  HTTParty.delete("http://10.4.4.105:9999/resource/write-health-data/patient/9E7A;100472/orders/order_id;1?accessCode=mx1234&verifyCode=mx1234!!&site=9E7A&pid=9E7A;100472",
                  { 
                    body:    File.read('./features/steps/discontinue_order.json'),
                    headers: { 'Content-Type' => 'application/json', 'Accept' => 'application/json' }     
                  }) 
end
    
And(/^the client clears patient with pid "(.*?)" info from vxsync$/) do |_pid|
  HTTParty.post("http://10.3.3.6:8080/sync/clearPatient?pid=9E7A;100472 ",
                { 
                 
                })    
end

Then(/^the client syncs the patient with pid "(.*?)" in vxsync$/) do |_pid|
  HTTParty.get("http://10.3.3.6:8080/sync/doLoad?pid=9E7A;100472 ",
               { 
                
               })    
end
