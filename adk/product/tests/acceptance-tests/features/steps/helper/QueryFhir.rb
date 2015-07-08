path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultLogin.rb'

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

if __FILE__ == $PROGRAM_NAME
  p '-------- WAS HERE -----------'
  temp = QueryFhir.new("AdverseReaction")
  temp.add_parameter("subject.identifier", "5")
  temp.add_format("json")
  #p temp.path
end
