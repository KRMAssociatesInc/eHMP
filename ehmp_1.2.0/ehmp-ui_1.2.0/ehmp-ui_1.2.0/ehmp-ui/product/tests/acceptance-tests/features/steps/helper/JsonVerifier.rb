require 'set'

#
class JsonVerifier
  attr_reader :subarry
  def initialize
    @@output = []
    @@last_path_checked = ''
    @@defined_error_msg = ''
    @subarry = []
  end

  def all_matches_date_format(fieldpath, dateformat, jsonobject)
    date_validator = JsonFieldDateValidator.new
    matched = date_validator.all_matches_date_format(fieldpath, dateformat, jsonobject)
    @@output.concat(date_validator.debug_output)
    unless matched
      @@defined_error_msg = date_validator.error_message
    end #
    return matched
  end

  def matches_date_format(fieldpath, dateformat, jsonobject)
    date_validator = JsonFieldDateValidator.new
    matched = date_validator.matches_date_format(fieldpath, dateformat, jsonobject)
    @@output.concat(date_validator.debug_output)
    unless matched
      @@defined_error_msg = date_validator.error_message
    end #
    return matched
  end

  #
  def build_subarray(fieldpath, fieldvalues, jsonobject)
    returnvalue = true
    @subarry = []
    begin

      steps = fieldpath.split('.')
      allvalues = []
      #loop through all json records, if the fieldpath contains the fieldvalues, save the record in a subarray
      index = 0
      jsonobject.each do | onerecord |
        allvalues = []
        save_all_values_of_path(0, steps, onerecord, @@output, allvalues)
        if allvalues.include? fieldvalues
          @@output.push("adding row to subarray #{index}")
          @subarry.push(onerecord)
        end #if
        index = index + 1
      end # jsonobject.each
      @@output.push("subarry length #{subarry.length}")
      if subarry.length == 0
        fail "looking for #{fieldvalues} for field #{fieldpath} but only found #{allvalues}"
      end
      returnvalue = true
    rescue Exception=>e
      @@output.push("exception was thrown and caught")
      @@defined_error_msg = e
      returnvalue = false
    end
    return returnvalue
  end #def

  def object_contains_partial_value(fieldpath, fieldvalues, jsonobject)
    returnvalue = true
    begin

      steps = fieldpath.split('.')
      allvalues = []

      #loop through all json records and pull out all possible values for the provided path
      #this result could contain nil values if path does not exist in record
      jsonobject.each do | onerecord |
        save_all_values_of_path(0, steps, onerecord, @@output, allvalues)
      end # jsonobject.each
      @@output.push("check for #{fieldvalues} within #{allvalues}")

      (0..fieldvalues.size-1).each do | i |
        #our fieldvalues might have extra quotations, remove these for comparisons
        temp = fieldvalues[i].gsub("\"", '')
        found = false
        allvalues.each do | tempvalue |
          if tempvalue.include? temp
            found = true

            break
          end #if
        end
        unless found
          allvalues_set = Set.new allvalues
          @@defined_error_msg="was looking for value #{temp} for field #{fieldpath} but only found #{allvalues_set.to_a}"
          return false
        end #if
      end #for
      returnvalue = true
    rescue Exception=>e
      @@defined_error_msg = e
      returnvalue = false
    end
    return returnvalue
  end

  # look within the 'jsonObject' at all 'fieldpath's and verify the 'fieldvalues' exist within the 'jsonObject'
  #fieldpath: string that provides an xpath-like direction to the tag-value pair. each tag seperated by '.'
  #fieldvalues: an array of values to look for in the provided jsonObject
  #jsonObject:
  def object_contains_path_value_combo(fieldpath, fieldvalues, jsonobject)
    returnvalue = true
    begin

      steps = fieldpath.split('.')
      allvalues = []

      #loop through all json records and pull out all possible values for the provided path
      #this result could contain nil values if path does not exist in record
      jsonobject.each do | onerecord |
        save_all_values_of_path(0, steps, onerecord, @@output, allvalues)
      end # jsonobject.each
      @@output.push("check for #{fieldvalues} within #{allvalues}")
      (0..fieldvalues.size-1).each do | i |
        #our fieldvalues might have extra quotations, remove these for comparisons
        temp = fieldvalues[i].gsub("\"", '')
        unless allvalues.include? temp
          allvalues_set = Set.new allvalues

          @@defined_error_msg="was looking for value #{temp} for field #{fieldpath} but only found #{allvalues_set.to_a}"
          return false
        end #if
      end #for
      returnvalue = true
    rescue Exception=>e
      @@defined_error_msg = e
      returnvalue = false
    end
    return returnvalue
  end #def

  def not_defined?(path, record)
    was_defined = self.defined?(path, record)
    if was_defined
      @@defined_error_msg = "path #{path} should not be defined in the record but was"
    end
    return !was_defined
  end

  # check if the provided path leads to a valid tag-value in the provided record
  # path: xpath-like string leading to a tag-value.  Each tag seperated by a '.'
  # record: json object
  def defined?(path, record)
    field_validator = JsonFieldValidator.new
    is_defined = field_validator.defined?(path[0], record)
    @@output.concat(field_validator.debug_output)
    unless is_defined
      @@defined_error_msg = field_validator.error_message
    end # unless
    return is_defined
  end

  def reset_output
    @@output = []
  end

  def output
    return @@output
  end

  def last_path_checked
    return @@last_path_checked
  end

  def error_message
    return @@defined_error_msg
  end #getErrorMessage

  #recursive function that saves all the possible values for a provided path
  #steps_to_climb: array of tags leading to a tag-value pair
  #index: where the function is in the steps_to_climb array
  #object: jsonObject that could possibly contain the searched for tag-value pair
  #output_string: debug info user can output to view progress of the function
  #array_results: an array of all possible values
  def save_all_values_of_path(index, steps_to_climb, object, output_string, array_result)
    if object.class == NilClass
      #we are looking for a tag-value that does not exist in this path
      @@output.push("at index #{index} for steps #{steps_to_climb} we ran out of object")
      @@output.push("returning a #{object.class}")
      array_result.push(object)
      return
    end #if

    if index == steps_to_climb.length-1
      #end of regression calls, we have found the value we were looking for
      @@output.push("at index #{index} for steps #{steps_to_climb} we found a value")

      @@output.push("array_result: #{array_result}")
      temp_obj = object[steps_to_climb[index]]
      if temp_obj.class.name.eql?("Array")
        @@output.push("The value is an array, adding each array element")
        array_result.concat(temp_obj)
      else
        @@output.push("The value is an object, adding #{temp_obj.to_s}")
        array_result.push(temp_obj.to_s)
      end

      @@output.push("index: #{temp_obj}")
      @@output.push("returning a #{temp_obj.class}")
      return
    end

    temp_obj = object[steps_to_climb[index]]
    @@output.push("1 temp_obj: #{temp_obj.class}")
    #we have encountered an array
    if temp_obj.class.name.eql?("Array")
      @@output.push("at index #{index} for steps #{steps_to_climb} we found an array")
      index=index+1
      (0..temp_obj.length-1).each do | i |
        save_all_values_of_path(index, steps_to_climb, temp_obj[i], output_string, array_result)
        @@output.push("returned: #{array_result} ")

      end # for
      return

    else
      #we have encountered a hashmap, continue stepping
      @@output.push("at index #{index} for steps #{steps_to_climb} we found a hash (#{steps_to_climb[index]})")
      save_all_values_of_path(index+1, steps_to_climb, temp_obj, output_string, array_result)
    end #if
  end #end save_all_values_of_path
end
