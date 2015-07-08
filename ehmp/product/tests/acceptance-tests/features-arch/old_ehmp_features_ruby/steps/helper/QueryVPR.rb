path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultHmpLogin.rb'

class QueryVPR
  def initialize(datatype, pid, auto_acknowledge = "true")
    @path = String.new(DefaultLogin.fhir_url)
    @path.concat("/vpr/")
    @path.concat(pid)
    if datatype != "patient"
      @path.concat("/")
      @path.concat(datatype)
    end
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

if __FILE__ == $PROGRAM_NAME
  p QueryVPR.new("one", "1").path
  p QueryVPR.new("two", "2", "true").path
  p QueryVPR.new("three", "3", "false").path
  
  p QueryVPR.new("labs/uid", "3", "false").path
  
  test = QueryVPR.new("test", "1")
  test.add_parameter("filter", "like('categoryName','Pathology')")
  p test.path
end
