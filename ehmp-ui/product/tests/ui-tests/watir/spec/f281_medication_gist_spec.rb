require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/medication_expanded_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/common/ehmp_constants'

# @US3669
describe 'F281: f281_medication_results_gist_spec.rb', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:overview) { PatientOverview.new(@driver) }
  let(:applet) { MedicationExpanded.new(@driver) }
  let(:common_page) { CommonElementsPage.new(@driver) }

  context 'F281_1,2: User is able to view all active outpatient medication in a gist view under overview and modal' do
    out_patient_name = 'one,outpatient'

    it 'When user is viewing data for patient #{out_patient_name}' do
      @common_test.mysite_patient_search out_patient_name, out_patient_name
    end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'the Medications gist is displayed' do
      overview.active_meds_applet_element.when_visible(EXTENDED_TIMEOUT)
      expect(overview.active_meds_applet?).to eq(true)
    end

    it 'TC827: the medication gist view has the following information' do
      applet.name_element.when_visible(APPLET_LOAD_TIME)
      expect(applet.this_medication_in_list?('Methocarbamol 500 MG Oral Tablet'))
      expect(applet.this_description_in_list?('TAKE ONE TABLET BY MOUTH 1'))
      expect(applet.this_count_in_list?('1')).to eq(true)
    end

    it 'TC827: Verify medication modal pop-up detail for "Methocarbamol Tablet" medication name' do
      applet.name_element.click
      applet.detailViewIcon_element.when_visible(40)
      applet.detailViewIcon_element.click
      common_page.modalTitle_element.when_visible(40)
      med_name_array = applet.name.split
      med_name = med_name_array[0].upcase
      applet.med_status_element.when_visible
      expect(common_page.modalTitle_element.text.strip.upcase.include?(med_name)).to eq(true)
      common_page.closeModal
    end
  end

  context 'F281_3 US7364: User is able to filter medications by text' do
    full_patient_name = 'eightyeight,patient'
    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible(EXTENDED_TIMEOUT)
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'The Mediciations gist is displayed' do
      overview.active_meds_applet_element.when_visible(EXTENDED_TIMEOUT)
      expect(overview.active_meds_applet?).to eq(true)
    end

    it 'TC397: the user clicks the control "Filter Toggle" in the "Medications Gist applet"' do
      applet.filter_element.when_visible(APPLET_LOAD_TIME)
      expect(applet.filter?).to eq(true)
      applet.filter
    end

    filter_text = 'Lisinopril'

    it 'TC397: User enters "Listinopril" in the "Text Filter control in the "Medications Gist applet"' do
      applet.textfilter_element.when_visible(EXTENDED_TIMEOUT)
      applet.textfilter_element.clear
      pre_filter_row_count = applet.medicationNameList_elements.length
      applet.textfilter = filter_text
      Watir::Wait.until { applet.medicationNameList_elements.length != pre_filter_row_count }
      expect(applet.filtered_list_elements.length).to eq(1)
      expect(applet.this_medication_in_list?('Lisinopril 10 MG Oral Tablet')).to eq(true)
      expect(applet.this_description_in_list?('TAKE ONE TABLET BY MOUTH EVERY DAY')).to eq(true)
      expect(applet.this_count_in_list?('3')).to eq(true)
      expect(applet.this_geographic_in_list?('New')).to eq(true)
    end
  end

  context 'F281_4 US4274: View Medications Applet Single Page by clicking on Expand View' do
    full_patient_name = 'TEN,PATIENT'
    it 'When user is viewing data for patient #{full_patient_name}' do
      overview.patientSearchDiv_element.when_visible(EXTENDED_TIMEOUT)
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'The Mediciations gist is displayed' do
      overview.active_meds_applet_element.when_visible(EXTENDED_TIMEOUT)
      expect(overview.active_meds_applet?).to eq(true)
    end

    it 'TC829: The user clicks the control "Expand View" in the "Medications Gist applet' do
      common_page.maximize_applet_button_visible?('activeMeds')
      common_page.click_maximize_applet_button('activeMeds')
      expect(applet.medMaximizeAppletTitle_element.text.strip.upcase).to eq('MEDICATION REVIEW')
      applet.outPatientTitle_element.when_visible(EXTENDED_TIMEOUT)
      expect(applet.outPatientTitle_element.text.strip.upcase).to eq('OUTPATIENT MEDS')
      applet.inPatientTitle_element.when_visible(EXTENDED_TIMEOUT)
      expect(applet.inPatientTitle_element.text.strip.upcase).to eq('INPATIENT MEDS')
    end
  end

  context 'F281_5 US4684: Medication Applet is sorted by the column header Medication,Refills' do
    full_patient_name = 'eightyeight,patient'

    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible(EXTENDED_TIMEOUT)
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'The Mediciations gist is displayed' do
      overview.active_meds_applet_element.when_visible(EXTENDED_TIMEOUT)
      expect(overview.active_meds_applet?).to eq(true)
    end

    it 'TC830: The user clicks on the column header "Medication" and sorted ascending order' do
      applet.medGistHeaderName_element.when_visible(APPLET_LOAD_TIME)
      applet.medGistHeaderName_element.click
      expect(applet.verify_sort_ascending?('Medication')).to eq(true)
    end

    it 'TC830: The user clicks on the column header "Medication" and sorted descending order' do
      applet.medGistHeaderName_element.click
      expect(applet.verify_sort_descending?('Medication')).to eq(true)
    end

    it 'TC830: The user clicks on the column header "Refills" and sorted ascending order' do
      applet.medGistHeaderRefills_element.when_visible
      applet.medGistHeaderRefills_element.click
      expect(applet.verify_sort_ascending?('Refills')).to eq(true)
    end

    it 'TC830: The user clicks on the column header "Refills" and sorted descending order' do
      applet.medGistHeaderRefills_element.click
      expect(applet.verify_sort_descending?('Refills')).to eq(true)
    end
  end
end
