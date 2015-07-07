require 'page-object'
# This is the patient search page object
class PatientSearchPage1
  include PageObject

  page_url "#{ENV['BASE']}/#patient-search-screen"

  # Patient Search / Landing Page page objects
  text_field(:patient_search_input, id: 'patientSearchInput')
end
