require 'forgery'

class Forgery::PatientRecord < Forgery

  def self.allergies
    dictionaries[:allergies].random.unextend
  end

  def self.vitals
    dictionaries[:vitals].random.unextend
  end
  
  def self.symptoms
    dictionaries[:symptoms].random.unextend
  end
  
  def self.patientIEN
    dictionaries[:patientIEN].random.unextend
  end
  
end
