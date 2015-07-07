path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultHmpLogin.rb'

#https://10.3.3.5/fhir/patient/_search?name=EIGHT,PATIENT&_format=json&_ack=true
#https://10.3.3.5/fhir/patient?identifier=10108&_format=json&_ack=false
class QueryFhir
  def initialize(datatype)
    @path = String.new(DefaultLogin.fhir_url)
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

#https://10.3.3.5/fhir/patient/_search?name=EIGHT,PATIENT&_format=json&_skip=0&_count=20&_ack=true
class SearchFhir < QueryFhir
  
  def initialize(search_type, search_value)
    @path = String.new(DefaultLogin.fhir_url)
    @path.concat("/fhir/patient/_search")
    @number_parameters = 0
    add_parameter(search_type, search_value)
    add_parameter("_format", "json")
    add_parameter("_skip", "0")
    add_parameter("_count", "500")
    add_parameter("_ack", "true")
  end
end

if __FILE__ == $PROGRAM_NAME
  p '-------- WAS HERE -----------'
  temp = QueryFhir.new("AdverseReaction")
  temp.add_parameter("subject.identifier", "5")
  temp.add_format("json")
  #p temp.path
  
  search = SearchFhir.new("name", "bob")
  p search
end
