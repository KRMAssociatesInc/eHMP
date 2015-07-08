#Verify Json tag-value combo exists in Json Object
class JsonFieldValidator
  def initialize
    @@debug_output = []
    @@defined_error_msg = "no error message provided"
  end

  def error_message
    return  @@defined_error_msg
  end

  def debug_output
    return @@debug_output
  end

  def defined?(path, record)
    unless path.class == String
      @@defined_error_msg = "Expected path variable to of type string.  Was type #{path.class}"
      return false
    end #unless

    was_defined = false
    if record.class == Array
      was_defined = defined_array?(path, record)
    elsif record.class == Hash
      was_defined = defined_hash?(path, record)
    else
      @@defined_error_msg = "Can only verify fields for a record of type Array and Hash.  Record provided was #{record.class}"
      return false
    end
    unless was_defined
      @@defined_error_msg = "path #{path} was not defined in the record"
    end
    return was_defined
  end #isDefined

  private

  def defined_hash?(path, record)
    unless path.class == String
      @@debug_output.push("defined_hash? Expected path variable to of type string.  Was type #{path.class}")
      @@defined_error_msg = "Expected path variable to of type string.  Was type #{path.class}"
      return false
    end #unless

    found = false
    begin
      steps = path.split('.')
      @@debug_output.push("defined_hash? number of steps: #{steps.length}")
      value = walk_the_object(0, steps, record)
      @@debug_output.push("defined_hash? Result of walk_the_object: #{value} ")
      found = value.class != NilClass
      @@debug_output.push("defined_hash? found #{found}")
    rescue Exception=>e
      @@debug_output.push("defined_hash? threw exception #{e}")
      @@defined_error_msg = e
      return false
    end
    return found
  end #defined_hash

  def defined_array?(path, record)
    temp_path = String.new(path) # do this so that "fake." doesn't show up in the cucumber output
    @@debug_output.push("defined_array? #{record.class}")
    unless record.class == Hash
      temp_path.prepend("fake.")
      temprecord = {}
      temprecord["fake"] = record
      #record = temprecord
    end
    @@debug_output.push("defined_array? temp_path: #{temp_path}")
    return defined_hash? temp_path, temprecord
  end #defined_array

  #recursive function
  def walk_the_object(index, steps_to_climb, object)
    @@debug_output.push("walk_the_object at index #{index} for steps #{steps_to_climb}")

    #this is the last step, return the value at this key
    if index == steps_to_climb.length-1
      @@debug_output.push("walk_the_object last step: #{object[steps_to_climb[index]]}")
      return object[steps_to_climb[index]]
    end

    #get the value at current key and keep walking
    temp_obj = object[steps_to_climb[index]]
    #I'm at an array, check each tag within the array
    if temp_obj.class.name.eql?("Array")
      @@debug_output.push("walk_the_object current obj is an array")
      index=index+1
      tempvalue = nil
      (0..temp_obj.length-1).each do | i |
        tempvalue = walk_the_object(index, steps_to_climb, temp_obj[i])
        #if tempvalue[0].class == NilClass
        if tempvalue.class == NilClass
          @@debug_output.push("walk_the_object returning NilClass")
          return tempvalue
        end
      end # for
      #return last element in the array, this is for defined? class.
      @@debug_output.push("walk_the_object returning last element #{tempvalue}")
      return tempvalue
    else
      @@debug_output.push("walk_the_object current obj is NOT an array")
      #keep walking
      aaa = walk_the_object(index+1, steps_to_climb, temp_obj)
      @@debug_output.push("walk_the_object NOT an array recursive call returned #{aaa}")
      return aaa
    end #if
  end #walk_the_object
end
