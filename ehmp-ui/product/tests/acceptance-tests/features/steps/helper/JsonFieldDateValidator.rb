# Define the default date format the FHIR API will return dates as
class DefaultDateFormat
  include Singleton
  @@format =  /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d-\d\d:\d\d/

  def self.format
    @@format
  end
end

# Verify dates returned in Json objects are in expected date format
class JsonFieldDateValidator
  def initialize
    @@debug_output = []
    @@defined_error_msg = ""
  end

  def error_message
    return  @@defined_error_msg
  end

  def debug_output
    return @@debug_output
  end

  def all_matches_date_format(fieldpath, dateformat, jsonobject)
    # pull all values for fieldpath
    # loop values and verify all match the provided dateformat

    steps = fieldpath.split('.')
    allvalues = []

    #loop through all json records and pull out all possible values for the provided path
    #this result could contain nil values if path does not exist in record
    jsonobject.each do | onerecord |
      save_all_values_of_path(0, steps, onerecord, allvalues)
    end # jsonobject.each

    # assumption is that if allvalues.length is 0, then the path did not resolve
    if allvalues.length == 0
      @@defined_error_msg = "#{fieldpath} was not found in provided json"
      return false
    end
    matches = true
    allvalues.each do | tempvalue |
      regexresult = dateformat.match(allvalues[0])
      was_found = !regexresult.nil?
      matches = matches && was_found
    end #allvalues.each
    unless matches
      @@defined_error_msg = "all values did not match provided dateformat: #{allvalues}"
    end #unless
    return matches
  end

  def matches_date_format(fieldpath, dateformat, jsonobject)
    # pull all values for fieldpath
    # return false if value array > 1
    # verify single value matches the provided date format

    steps = fieldpath.split('.')
    allvalues = []

    #loop through all json records and pull out all possible values for the provided path
    #this result could contain nil values if path does not exist in record
    jsonobject.each do | onerecord |
      save_all_values_of_path(0, steps, onerecord, allvalues)
    end # jsonobject.each

    if allvalues.length == 0
      @@defined_error_msg = "#{fieldpath} was not found in provided json"
      return false
    end

    if allvalues.length > 1
      fullmsg = "This function only verifies the format of a unique json path."
      fullmsg.concat("  If user would like to check multiple values, use function all_matches_date_format")
      @@defined_error_msg = fullmsg
      return false
    end
    regexresult = dateformat.match(allvalues[0])
    was_found = !regexresult.nil?
    unless was_found
      @@defined_error_msg = "value at #{fieldpath} was '#{allvalues[0]}' and did not match expected date format"
    end
    return was_found
  end

  private

  #recursive function that saves all the possible values for a provided path
  #steps_to_climb: array of tags leading to a tag-value pair
  #index: where the function is in the steps_to_climb array
  #object: jsonObject that could possibly contain the searched for tag-value pair
  #array_results: an array of all possible values
  def save_all_values_of_path(index, steps_to_climb, object, array_result)
    if object.class == NilClass
      #we are looking for a tag-value that does not exist in this path
      @@debug_output.push("at index #{index} for steps #{steps_to_climb} we ran out of object")
      @@debug_output.push("returning a #{object.class}")
      array_result.push(object)
      return
    end #if

    if index == steps_to_climb.length-1
      #end of regression calls, we have found the value we were looking for
      @@debug_output.push("at index #{index} for steps #{steps_to_climb} we found a value")

      @@debug_output.push("array_result: #{array_result}")
      temp_obj = object[steps_to_climb[index]]
      if temp_obj.class.name.eql?("Array")
        @@debug_output.push("The value is an array, adding each array element")
        array_result.concat(temp_obj)
      else
        @@debug_output.push("The value is an object, adding #{temp_obj.to_s}")
        array_result.push(temp_obj.to_s)
      end

      @@debug_output.push("index: #{temp_obj}")
      @@debug_output.push("returning a #{temp_obj.class}")
      return
    end

    temp_obj = object[steps_to_climb[index]]
    @@debug_output.push("1 temp_obj: #{temp_obj.class}")
    #we have encountered an array
    if temp_obj.class.name.eql?("Array")
      @@debug_output.push("at index #{index} for steps #{steps_to_climb} we found an array")
      index=index+1
      (0..temp_obj.length-1).each do | i |
        save_all_values_of_path(index, steps_to_climb, temp_obj[i], array_result)
        @@debug_output.push("returned: #{array_result} ")

      end # for
      return

    else
      #we have encountered a hashmap, continue stepping
      @@debug_output.push("at index #{index} for steps #{steps_to_climb} we found a hash (#{steps_to_climb[index]})")
      save_all_values_of_path(index+1, steps_to_climb, temp_obj, array_result)
    end #if
  end #end save_all_values_of_path
end
