path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultHmpLogin.rb'

class QueryCDS
  def initialize(clientname, domain, icn)
    @path = String.new(DefaultLogin.fhir_url)
    @path.concat("/repositories.domain.ext/fpds/")
    @path.concat(domain)
    @path.concat("/")
    @number_parameters = 0
    add_parameter("clientName", clientName)
    add_parameter("nationalId", icn)
    add_parameter("templateId", "GenericObservationRead1")
    add_parameter("filterId", "GENERIC_VISTA_LIST_DATA_FILTER")
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
    return @path
  end
end # class

if __FILE__ == $PROGRAM_NAME
  p QueryCDS.new("one", "1").path
  p QueryCDS.new("two", "2", "true").path
  p QueryCDS.new("three", "3", "false").path
  
  test = QueryCDS.new("test", "1")
  test.add_parameter("filter", "like('categoryName','Pathology')")
  p test.path
end
