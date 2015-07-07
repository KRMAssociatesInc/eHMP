path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultHmpLogin.rb'

class QuerySearch
  def initialize(datatype, last_name, auto_acknowledge = "true")
 
    @path = String.new(DefaultLogin.fhir_url)
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

if __FILE__ == $PROGRAM_NAME
  p QuerySearch.new("one", "1").path
  p QuerySearch.new("two", "2", "true").path
  p QuerySearch.new("three", "3", "false").path
end
