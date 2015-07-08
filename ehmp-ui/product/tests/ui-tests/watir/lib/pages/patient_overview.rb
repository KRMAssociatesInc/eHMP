require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# require_relative 'common_elements'

# PatientOveriew page for $BASE/#overview
class PatientOverview
  include PageObject

  span(:oVDoB, id: 'patientDemographic-patientInfo-dob')
  span(:oVSsn, id: 'patientDemographic-patientInfo-ssn')
  span(:oVGender, id: 'patientDemographic-patientInfo-gender')
  span(:screenNm, id: 'screenName')

end

