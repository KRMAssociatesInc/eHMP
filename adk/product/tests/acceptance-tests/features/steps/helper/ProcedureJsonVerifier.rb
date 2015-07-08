# Search the Json Object for specific data
class ProcedureJsonVerifier
  def initialize
  end

  def pull_procedure_subset(tag, value, json)
    subset = []
    json["data"].each do |result|
      if result[tag].casecmp(value) == 0
        subset.push(result)
      end
    end
    return subset
  end
end
