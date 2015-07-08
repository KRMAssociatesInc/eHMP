require 'httparty'
require 'rspec/expectations'
require 'agilex-loadgen/TestRunnerUtil.rb'
require 'json'

class HTTPartyWithAuthorization
  include HTTParty

  # Authorization header is Base64 encoding of "9E7A;500:pu1234;pu1234!!"
  @@header = { 'Authorization' => 'Basic OUU3QTs1MDA6cHUxMjM0O3B1MTIzNCEh' }
  @@time_start = Time.new
  @@time_done = Time.new
  @@default_timeout = 300
   
  def self.time_elapsed_last_call
    return @@time_done - @@time_start
  end

  def self.post_with_authorization(path)
    @@time_start = Time.new
    directory = post(path, { :verify => false, :headers => @@header, :timeout => @@default_timeout })
    @@time_done = Time.new
    return directory
  end

  def self.get_with_authorization(path)
    @@time_start = Time.new
    directory = get(path, { :verify => false, :headers => @@header, :timeout => @@default_timeout })
    @@time_done = Time.new
    return directory
  end
end

class SETENV
  @@hmp_url = ENV.keys.include?('EHMP_IP') ? 'https://' + ENV['EHMP_IP'] + ":8443": "https://10.3.3.4:8443"
  @@fhir_url = ENV.keys.include?('VE_API_IP') ? 'https://' + ENV['VE_API_IP'] : "https://10.3.3.5"
  @@jds_url = ENV.keys.include?('JDS_IP') ? 'http://' + ENV['JDS_IP'] + ":9080" : "http://10.2.2.110:9080"
  @@run_id = ENV.keys.include?('ID') ? 'ENV[ID] = ' + ENV['ID'] : "[INFO] There is no ENV[ID] to print"
  @@perf_url = ENV.keys.include?('Perf-Monitor_IP') ? 'http://' + ENV['Perf-Monitor_IP'] + ":9080" : "http://10.4.4.200:9200/ehmp/transactions"

  def self.fhir_url
    return @@fhir_url
  end
  
  def self.hmp_url
    return @@hmp_url
  end

  def self.jds_url
    return @@jds_url
  end

  def self.run_id
    return @@run_id
  end

  def self.perf_url
    return @perf_url
  end  
end  

def wait_until_operational_data_is_synced(base_fhir_url)
  #base_fhir_url = SETENV.fhir_url
  path = "#{base_fhir_url}/admin/sync/operational"

  time_out = 600
  wait_time = 5
  is_synced = false
  current_time = Time.new
  wait_until = current_time + time_out
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until

    begin
      # p path
      @response = HTTPartyWithBasicAuth.get_with_authorization(path)
      json = JSON.parse(@response.body)
      sync_complete = json["data"]["items"][0]["syncOperationalComplete"]
      if sync_complete
        p "operational data has been synced"
        is_synced = true
        break
      else
        p "operational data not synced yet, wait #{wait_time} seconds"
        p json
        sleep wait_time
      end # if
    rescue Exception => e
      p "call to check if operational data has been synced caused an exception: #{e}"
      p @response.body
      sleep wait_time
    end # rescue
  end # for
end

class HTTPartyWithBasicAuth
  include HTTParty
  @@auth = { :username => "9E7A;pu1234", :password => "pu1234!!" }
  @@time_start = Time.new
  @@time_done = Time.new

  @@default_time_out = 300
  def self.time_elapsed_last_call
    return @@time_done - @@time_start
  end
  
  def self.check_host(path)
    if path.include? "C877;"
      @@auth = { :username => "C877;pu1234", :password => "pu1234!!" }
    end
  end

  def self.post_with_authorization(path)
    # "Authorization", "Basic QjM2Mjs1MDA6cHUxMjM0O3B1MTIzNCEh"
    # directory = post(path, { :verify => false, :headers => @@header,  :basic_auth => @@auth })
    check_host(path)
    @@time_start = Time.new
    directory = post(path, { :verify => false, :basic_auth => @@auth, :timeout => @@default_time_out })
    @@time_done = Time.new
    return directory
  end

  def self.get_with_authorization(path)
    #  @response = HTTParty.get(@dataHref, { :verify => false, :headers => { 'Accept' => 'application/json' }, :basic_auth => auth })

    # directory = get(path, { :verify => false, :headers => @@header,  :basic_auth => @@auth})
    check_host(path)
    @@time_start = Time.new
    directory = get(path, { :verify => false, :basic_auth => @@auth, :timeout => @@default_time_out })
    @@time_done = Time.new
    return directory
  end

  def self.get_with_authorization_for_user(path, user, pass)
    @@time_start = Time.new
    auth = { :username => user, :password => pass }
    directory = get(path, { :verify => false, :basic_auth => auth, :timeout => @@default_time_out })
    @@time_done = Time.new
    return directory
  end

  def self.put_with_authorization(path)
    check_host(path)
    @@time_start = Time.new
    directory = put(path, { :verify => false, :basic_auth => @@auth, :timeout => @@default_time_out })
    @@time_done = Time.new
    return directory
  end

  def self.delete_with_authorization(path)
    check_host(path)
    @@time_start = Time.new
    directory = delete(path, { :verify => false, :basic_auth => @@auth,  :timeout => @@default_time_out })
    @@time_done = Time.new
    return directory
  end
end

class QueryVPR
  def initialize(datatype, pid, auto_acknowledge = "true")
    @path = String.new(SETENV.fhir_url)
    @path.concat("/vpr/")
    @path.concat(pid)
    @path.concat("/")
    @path.concat(datatype)
    @number_parameters = 0
    add_acknowledge(auto_acknowledge)
  end
  
  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
  
  def path
    return @path
  end
end # class

class QuerySearch
  def initialize(datatype, last_name, auto_acknowledge = "true")
 
    @path = String.new(SETENV.fhir_url)
    @path.concat("/vpr/search/Patient/")
    @number_parameters = 0
    add_parameter(datatype, last_name)
    add_acknowledge(auto_acknowledge)
  end
  
  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
  
  def path
    return @path
  end
end # class

class QueryFhir
  def initialize(datatype)
    @path = String.new(SETENV.fhir_url)
    @path.concat("/fhir/")
    @path.concat(datatype)
    @number_parameters = 0
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def add_format(requested_format)
    add_parameter("_format", requested_format)
  end

  def path
    return @path
  end
end

class QueryPath
  def initialize(start_path)
    @path = String.new(SETENV.hmp_url)
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

def query_with_path(path, pid)
  query_path = QueryPath.new(path)
  query_path.add_pid pid
  query_path.add_pagination 1000
  query_path.add_start_range "19930416"
  query_path.add_end_range
  p query_path.path
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end # query_with_path

def query_with_path_no_range(path, pid)
  query_path = QueryPath.new(path)
  query_path.add_pid pid
  query_path.add_pagination 1000
  p query_path.path
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end

def get_dod_document(edipi, eventId, file_extension)
  path = "/documents/dod/#{edipi}/#{eventId}.#{file_extension}"
  query_path = QueryPath.new(path)
  p query_path.path
  @response = HTTPartyWithAuthorization.get_with_authorization(query_path.path)
end

Before do |scenario|
  # Feature name
  case scenario
    when Cucumber::Ast::Scenario
      @feature_name = scenario.feature.name
    when Cucumber::Ast::OutlineTable::ExampleRow
      @feature_name = scenario.scenario_outline.feature.name
  end

   # Scenario name
  case scenario
    when Cucumber::Ast::Scenario
      @scenario_name = scenario.name
    when Cucumber::Ast::OutlineTable::ExampleRow
      @scenario_name = scenario.scenario_outline.name
   end

  # Tags (as an array)
  @scenario_tags = scenario.source_tag_names
end

Given(/^a patient with "(.*?)" in multiple VistAs$/) do |arg1|
  #there is no way to verify this step now.
end

Then(/^a successful response is returned$/) do
  expect(@response.code).to eq(200)
  #p 'http response code = ' + (@response.code).to_s 
end

Then (/^the result is validated$/) do 
  response = JSON.parse(@response.body)
  expect(response).to be_true
  # p response
end  

Then (/^background$/) do 
  puts '[INFO] PID = ' + Process.pid.to_s 
  puts '[INFO] CurrentTime: ' + (Time.now.to_f).to_s
end

Then (/^print system time$/) do 
  puts '[INFO] PID = ' + Process.pid.to_s 
  puts '[INFO] CurrentTime: ' + (Time.now.to_f).to_s
  rid =  SETENV.run_id
  puts rid
end

################################## FHIR api REST endpoints steps

Given(/^a patient with pid "(.*?)" has been synced through Admin API$/) do | pid |
  wait_until_operational_data_is_synced(SETENV.fhir_url)
  base_url = SETENV.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  p path
  @start_time = Time.now.to_f
  begin
    @response = HTTPartyWithBasicAuth.put_with_authorization(path)
    p "Expected response code 201, received #{@response.code}" unless @response.code == 201
    #expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
  rescue Timeout::Error
    p "Sync timed out"
  end
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'patient_sync', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )

  time_out = 180
  wait_time = 2

  current_time = Time.new
  wait_until = current_time + time_out
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    if @response.code != 200
      p "not sync yet, wait #{wait_time} seconds"
      sleep wait_time
    else
      break
    end # if
  end # for
  p "Waited #{Time.new - current_time} secs"
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^a client requests an asynchronous load for patient with icn "(.*?)"$/) do |icn|
  base_url = SETENV.fhir_url
  path = "#{base_url}/sync/loadAsync?icn=#{icn}"
  @start_time = Time.now.to_f   
  @response = HTTPartyWithAuthorization.post_with_authorization(path)
  @end_time = Time.now.to_f
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
  expect(@response.code).to eq(200)
end

When(/^user requests allergies in FHIR format for a patient, "(.*?)"$/) do  |pid|
  #https://10.3.3.5/fhir/AdverseReaction?subject.identifier=9E7A;100022&_format=json&_ack=true
  temp = QueryFhir.new("AdverseReaction")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f  
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_adversereaction', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^user requests labs in FHIR format for a patient, "(.*?)"$/) do  |pid|
  #https://10.3.3.5/fhir/DiagnosticReport?subject.identifier=10105&_format=json&_ack=true
  temp = QueryFhir.new("DiagnosticReport")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_diagnosticReport', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
end
   
Then(/^user requests vitals in FHIR format for a patient, "(.*?)"$/) do  |pid|
  #https://10.3.3.5/fhir/Observation?subject.identifier=10108&_format=json&_ack=true
  temp = QueryFhir.new("Observation")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f  
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)  
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_observation', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
end

Then(/^user requests demographics in FHIR format for a patient, "(.*?)"$/) do  |pid|
  #https://10.3.3.5/fhir/patient?identifier=9E7A;100022&_format=json&_ack=true
  temp = QueryFhir.new("patient")
  temp.add_parameter("identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f 
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_patient', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^the client requests non-va medication results for that patient "(.*?)" in FHIR format$/) do |pid|  
  #https://10.3.3.5/fhir/MedicationStatement?subject.identifier=9E7A;100033&_format=json&_ack=true
  temp = QueryFhir.new("MedicationStatement")    
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)  
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_MedicationStatement', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s   
end

When(/^the client requests in-patient medication results for that patient "(.*?)" in FHIR format$/)  do |pid| 
  #https://10.3.3.5/fhir/MedicationAdministration?subject.identifier=9E7A;100033&_format=json&_ack=true
  temp = QueryFhir.new("MedicationAdministration")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_MedicationAdministration', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s     
end

When(/^the client requests out-patient medication results for the patient "(.*?)" in FHIR format$/) do |pid|
  #https://10.3.3.5/fhir/MedicationDispense?subject.identifier=5000000318&_format=json&_ack=true
  temp = QueryFhir.new("MedicationDispense")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_MedicationDispense', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s     
end

When(/^the client requests radiology report results for that patient "(.*?)" in FHIR format$/) do |pid|
  #https://10.3.3.5/fhir/DiagnosticReport?subject.identifier=10107&domain=rad&_format=json&_ack=true
  temp = QueryFhir.new("DiagnosticReport")
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("domain", "rad")
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'fhir_rad', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s     
end

################################## vpr api REST endpoints steps

When(/^the client requests allergies from VPR for the patient, "(.*?)"$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;100022/allergy?_ack=true
  full_path = QueryVPR.new("allergy", pid).path
  p full_path
  @start_time = Time.now.to_f 
  @response = HTTPartyWithBasicAuth.get_with_authorization(full_path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_allergy', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^the client requests vital from VPR for the patient, "(.*?)"$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;100022/vital?_ack=true
  full_path = QueryVPR.new("vital", pid).path
  p full_path
  @start_time = Time.now.to_f 
  @response = HTTPartyWithBasicAuth.get_with_authorization(full_path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_vital', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^the client requests demographics from VPR for the patient, "(.*?)"$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;100022/patient?_ack=true
  full_path = QueryVPR.new("patient", pid).path
  p full_path
  @start_time = Time.now.to_f 
  @response = HTTPartyWithBasicAuth.get_with_authorization(full_path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_patient', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^the user searches for a patient "(.*?)" in VPR format$/) do |last_name|
  #https://10.3.3.5/vpr/search/Patient/?name=EIGHT
  path = QuerySearch.new("fullName", last_name).path
  p path
  @start_time = Time.now.to_f  
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_search', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^the user searches in summary results for a patient "(.*?)" in VPR format$/) do |last_name|
  #https://10.3.3.5/vpr/search/Patient/?name=EIGHT&resultsRecordType=summary
  path = QuerySearch.new("fullName", last_name).add_parameter("resultsRecordType", "summary")
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_search_RecordTypesummary', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s
end

When(/^the user searches medication for the patient "(.*?)" with the "(.*?)" in VPR format$/) do |pid, text|
  #https://10.3.3.5/vpr/11016/search/MED?text=ANALGESICS
  path = QueryVPR.new("search/MED", pid).add_parameter("text", text)
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_search_Med', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
end

When(/^the client requests labs for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/lab?_ack=true
  path = QueryVPR.new("lab", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_lab', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
end

When(/^the client requests problem lists for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/problem?_ack=true
  path = QueryVPR.new("problem", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_problem', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
end

When(/^the client requests medications for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;100033/med?_ack=true
  path = QueryVPR.new("med", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_med', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end

When(/^the client requests document for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/5000000009/document?_ack=true  
  path = QueryVPR.new("document", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_document', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests radiology report results for that patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/10146/rad?_ack=true
  temp = QueryVPR.new("rad", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_rad', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end

When(/^the client requests order results for that patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/5000000009/order?_ack=true
  temp = QueryVPR.new("order", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_order', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s   
end

When(/^the client requests anatomic pathology for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/10110/accession?_ack=true
  path = QueryVPR.new("accession", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_accession', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s     
end

When(/^the client requests immunization for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/10108/immunization?_ack=true  
  path = QueryVPR.new("immunization", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_immunization', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end

When(/^the client requests consult results for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/10107/consult?_ack=true 
  temp = QueryVPR.new("consult", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'vpr_consult', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests appointments for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/C877;737/appointment?_ack=true
  temp = QueryVPR.new("appointment", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_appointment', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests consult results for the patient "(.*?)" in VPR format_HDR$/) do |pid|
  #https://10.3.3.5/vpr/C877;737/consult?_ack=true
  temp = QueryVPR.new("consult", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_consult', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests cpt for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/C877;737/cpt?_ack=true
  temp = QueryVPR.new("cpt", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_cpt', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests documents for the patient "(.*?)" in VPR format_HDR$/) do |pid|
  #https://10.3.3.5/vpr/C877;737/document?_ack=true
  path = QueryVPR.new("document", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_document', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests educations for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;737/education?_ack=true
  path = QueryVPR.new("education", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_education', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests exams for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;737/exam?_ack=true
  path = QueryVPR.new("exam", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_exams', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests factors for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;737/factor?_ack=true
  path = QueryVPR.new("factor", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_factor', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests images for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/9E7A;737/image?_ack=true
  path = QueryVPR.new("image", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_image', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end


When(/^the client requests immunization for the patient "(.*?)" in VPR format_HDR$/) do |pid|
  #https://10.3.3.5/vpr/11016/immunization?_ack=true  
  path = QueryVPR.new("immunization", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_immunization', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end

When(/^the client requests order results for the patient "(.*?)" in VPR format_HDR$/) do |pid|
  #https://10.3.3.5/vpr/11016/mh?_ack=true
  temp = QueryVPR.new("order", pid)
  p temp.path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_order', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s   
end

When(/^the client requests mentalhealth for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/order?_ack=true
  path = QueryVPR.new("mh", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_mentalhealth', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests pointofvisits for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/pov?_ack=true
  path = QueryVPR.new("pov", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_pointofvisits', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests problem lists for the patient "(.*?)" in VPR format_HDR$/) do |pid|
  #https://10.3.3.5/vpr/11016/problem?_ack=true
  path = QueryVPR.new("problem", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_problem', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s  
end

When(/^the client requests procedure results for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/procedure?_ack=true
  path = QueryVPR.new("procedure", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_procedure', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests skin results for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/skin?_ack=true
  path = QueryVPR.new("skin", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_skin', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests surgery results for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/surgery?_ack=true
  path = QueryVPR.new("surgery", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_surgery', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

When(/^the client requests visit results for the patient "(.*?)" in VPR format$/) do |pid|
  #https://10.3.3.5/vpr/11016/visit?_ack=true
  path = QueryVPR.new("visit", pid).path
  p path
  @start_time = Time.now.to_f    
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'hdr_visit', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s      
end

Given(/^the client requests Meds for the patient "(.*?)"$/) do |pid|
  #https://10.3.3.4:8443/vpr/view/gov.va.cpe.vpr.queryeng.MedsViewDef?_dc=1396988436165&pid=9E7A;71&page=1&row.start=0&row.count=1000&range.startHL7=19930416&range.endHL7=20140710
  @start_time = Time.now.to_f    
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.MedsViewDef", pid
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'DoD_MedViewDef', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end

When(/^the client requests unfiltered documents for the patient "(.*?)"$/) do |pid|
  #https://10.3.3.4:8443/vpr/view/gov.va.cpe.vpr.queryeng.NotesUnfilteredViewDef?_dc=1396988436165&pid=10108&page=1&row.start=0&row.count=1000&range.startHL7=19930416&range.endHL7=20140710
  @start_time = Time.now.to_f    
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.NotesUnfilteredViewDef", pid
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'DoD_NotesUnfilteredViewDef', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end

When(/^the client requests problems for the patient "(.*?)"$/) do |pid|
  #https://10.3.3.4:8443/vpr/view/gov.va.cpe.vpr.queryeng.ProblemViewDef?_dc=1396988436165&pid=10108&page=1&row.start=0&row.count=1000
  @start_time = Time.now.to_f    
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.ProblemViewDef", pid
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'DoD_ProblemViewDef', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end


When(/^the client requests document "(.*?)", "(.*?)", "(.*?)"$/) do |edipi, eventid, file_extension|
  @start_time = Time.now.to_f    
  get_dod_document edipi, eventid, file_extension
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'DoD_document', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s   
end


When(/^the client requests documents for the patient "(.*?)"$/) do |pid|
  @start_time = Time.now.to_f    
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.NotesViewDef", pid
  @end_time = Time.now.to_f
  @elap= (@end_time - @start_time)
  @result = HTTParty.post(SETENV.perf_url, 
    :body => { :transaction_name => 'DoD_NotesViewDef', 
               :start_time => @start_time,
               :end_time => @end_time,
               :elapsed_time =>  @elap.round(3),
               :tags => @scenario_tags,
               :snario_name => @scenario_name
             }.to_json,
    :headers => { 'Content-Type' => 'application/json' } )
  puts '[INFO] Responese time = ' + (@end_time - @start_time).to_s    
end



