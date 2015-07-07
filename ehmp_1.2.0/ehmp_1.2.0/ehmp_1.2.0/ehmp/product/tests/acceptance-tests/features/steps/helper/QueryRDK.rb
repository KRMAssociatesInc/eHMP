path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultHmpLogin.rb'

class BuildQuery
  
  def initialize
    @path = ''
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
  
  def path
    p @path
    return @path
  end
end

class QueryRDKAudit < BuildQuery
  def initialize(searchterm, searchvalue)
    super()
    @path.concat(DefaultLogin.rdk_url)
    @path.concat("/audit/search")
    add_parameter(searchterm, searchvalue)
  end
end

class QueryRDKSync < BuildQuery
  def initialize(command, pid = nil)
    super()
    @path.concat(DefaultLogin.rdk_url)
    @path.concat("/sync/")
    @path.concat(command)

    add_parameter("pid", pid) unless pid.nil?
  end
end

class QueryRDKDomain < BuildQuery
  # http://127.0.0.1:8888/patientrecord/domain/allergy?pid=1
  def initialize(datatype, pid = nil)
    super()
    @path.concat(DefaultLogin.rdk_url)
    @path.concat("/patientrecord/domain/")
    @path.concat(datatype)
    @number_parameters = 0
    add_parameter("pid", pid) unless pid.nil?
  end
end

class QueryRDK < BuildQuery
  # http://10.4.4.105:8888/patientrecord/labsbyorder?pid=11016&orderUid=urn:va:order:9E7A:227:16682
  def initialize(datatype, pid, auto_acknowledge = "true")
    @path = String.new(DefaultLogin.rdk_api_url)
    @path.concat("/patientrecord/labsbyorder?pid=")
    @path.concat(pid)
    @path.concat("&orderUid=")
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

#https://10.3.3.5/fhir/patient/_search?name=EIGHT,PATIENT&_format=json&_skip=0&_count=20&_ack=true
class SearchRDK < BuildQuery
  
  def initialize(resultsRecordType = nil)
    super()
    @path.concat(DefaultLogin.rdk_url)
    @path.concat("/patient-search")
    @path.concat("/#{resultsRecordType}") unless resultsRecordType.nil?
    @number_parameters = 0
  end
end

if __FILE__ == $PROGRAM_NAME
  q= QueryRDKSync.new("one", "two")
  p q.path

  p QueryRDK.new("uid", "3", "false").path
end
