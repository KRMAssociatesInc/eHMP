# methods are dynamically created for each item in this list
# new new_obj containing methods that were created dynamically

class RecordSpecifications
  def self.create_obj(new_obj, *fields)
    c = Class.new do 
      fields.each do |field|
        define_method field do
          instance_variable_get("@#{field}")
        end
        define_method "#{field}=" do |arg|
          instance_variable_set("@#{field}", arg)
        end
      end
    end

    Kernel.const_set new_obj, c
  end
end

RecordSpecifications.create_obj "MyNewObj", "record_type", "domain_type", "volume_of_records", "data_attributes", "whatever"

new_obj = MyNewObj.new
new_obj.volume_of_records = 10
puts new_obj.volume_of_records 
new_obj.data_attributes = "User Defined"
puts new_obj.data_attributes # => "Maxima"
new_obj.whatever = "abcdefgh"
puts new_obj.whatever 

# example record types: patient records
# example domain types for a patient record: allergies, vitals, labs, rads, demographics

 new_obj.record_type='PatientRecordTest'
 puts  new_obj.record_type
 new_obj.domain_type='Allergies'
 puts  new_obj.domain_type

p "METHODS for RecordSpecs: #{new_obj.methods}" 
p "INSTANCE VARIABLES for RecordSpecs: #{new_obj.instance_variables}"

# creates JSON files 
# create_xxxx_json.rb files use Forgery to dynamically generate test data records
# JSON files are written for the domain specified

   case new_obj.domain_type
      when 'Allergies'
        require_relative './create_allergies_json.rb'
        allergy = AllergyJson.new
        allergy.create_file 
      when 'Vitals'
        require_relative './create_vitals_json.rb'
        vitals = VitalsJson.new
        vitals.create_file 
    end
 










