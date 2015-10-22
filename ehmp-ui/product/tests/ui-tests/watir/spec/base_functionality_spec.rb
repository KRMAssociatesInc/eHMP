require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'rspec_helper'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/documents_page'
require_relative '../lib/pages/med_review_page'
require_relative '../lib/pages/timeline_page'
require_relative '../lib/pages/record_search_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/vitals_gist_page'
require_relative '../lib/pages/encounters_gist_page'
require_relative '../lib/pages/immunization_gist_page'
require_relative '../lib/pages/medication_expanded_page'
require_relative '../lib/pages/conditions_gist_page'
require_relative '../lib/pages/allergies_page'
require_relative '../lib/pages/reports_page'
require_relative '../lib/pages/appointments_page'
require_relative '../lib/pages/problems_page'
require_relative '../lib/pages/orders_page'

describe 'US7433: Verify base functionality.', smoketest: true do
  include DriverUtility

  before(:all) do
    # initialize_configurations(BASE_URL, BROWSER_NAME)
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
    full_patient_name = 'Bcma,Eight'
    # full_patient_name = 'Eight,Patient'
    p "performing patient search for #{full_patient_name}"
    @common_test.mysite_patient_search full_patient_name, full_patient_name
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:documents) { Documents.new(@driver) }
  let(:medreview) { MedReview.new(@driver) }
  let(:timeline) { TimelinePage.new(@driver) }
  let(:recordsearch) { RecordSearch.new(@driver) }
  let(:search) { SearchPage.new(@driver) }
  let(:overview_encountersapplet) { EncountersGistPage.new(@driver) }
  let(:overview_vitalsgistapplet) { VitalsGistPage.new(@driver) }
  let(:immunization_gist_applet) { ImmunizationGistPage.new(@driver) }
  let(:overview_med_gist_applet) { MedicationExpanded.new(@driver) }
  let(:overview_conditions_gist_applet) { ConditionsGistPage.new(@driver) }
  let(:overview_allergy_gist_applet) { AllergiesGistPage.new(@driver) }
  let(:overview_reports_applet) { ReportsPage.new(@driver) }
  let(:coversheet_appointment_applet) { AppointmentPage.new(@driver) }
  let(:coversheet_problems_applet) { ProblemsPage.new(@driver) }
  let(:coversheet_orders_applet) { OrdersPage.new(@driver) }

  context 'The cover sheet screen should load without issue. ' do
    it 'When the user views the cover sheet screen' do
      coversheet.navigate_to_coversheet
      # put this expect here so each it-do has a verification
      expect(coversheet.applet_visible? Coversheet::ACTIVE_MEDICATION_APPLET).to eq(true)
    end # it

    it 'TC405: Verify the active medications applet is displayed' do
      # applet headers should be displayed
      coversheet.activeMedHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet.activeMedHeaderMedication?).to eq(true)
      expect(coversheet.activeMedHeaderFacility?).to eq(true)

      expect(coversheet.active_med_applet_finish_loading?).to eq(true)
    end # it

    it 'TC406: Verify the allergy applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::ALLERGY_GRID_APPLET).to eq(true)
      coversheet.allergyGist_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet.allergy_gist_applet_finish_loading?).to eq(true)
    end # it

    it 'TC407: Verify the appointment and vists applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::APPOINTMENT_APPLET).to eq(true)

      coversheet_appointment_applet.appointmentHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet_appointment_applet.appointmentHeaderDate?).to eq(true)
      expect(coversheet_appointment_applet.appointmentHeaderDescription?).to eq(true)
      expect(coversheet_appointment_applet.appointmentHeaderLocation?).to eq(true)
      expect(coversheet_appointment_applet.appointmentHeaderFacility?).to eq(true)

      expect(coversheet_appointment_applet.appointment_applet_finish_loading?).to eq(true)
    end # it

    # the immunization applet base test has a debug tag on it, not sure why
    # it 'and the immunization applet is displayed' do
    #   expect(coversheet.applet_visible? Coversheet::IMMUNIZATION_APPLET).to eq(true)

    #   coversheet.immHeaders_element.when_visible(APPLET_LOAD_TIME)
    #   expect(coversheet.immHeaderVacName?).to eq(true)
    #   expect(coversheet.immHeaderReaction?).to eq(true)
    #   expect(coversheet.immHeaderDate?).to eq(true)
    #   expect(coversheet.immHeaderFacility?).to eq(true)

    #   expect(coversheet.immunization_applet_finish_loading?).to eq(true)
    # end # it

    it 'TC409: Verify the lab results applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::LAB_RESULTS_GRID_APPLET).to eq(true)

      coversheet.labResultHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet.labResultHeaderDate?).to eq(true)
      expect(coversheet.labResultHeaderTest?).to eq(true)
      expect(coversheet.labResultHeaderFlag?).to eq(true)
      expect(coversheet.labResultHeaderResult?).to eq(true)

      expect(coversheet.lab_results_applet_finish_loading?).to eq(true)
    end # it

    it 'TC411: Verify the orders applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::ORDER_APPLET).to eq(true)

      coversheet_orders_applet.ordersHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet_orders_applet.ordersHeaderDate?).to eq(true)
      expect(coversheet_orders_applet.ordersHeaderStatus?).to eq(true)
      expect(coversheet_orders_applet.ordersHeaderOrder?).to eq(true)
      expect(coversheet_orders_applet.ordersHeaderFacility?).to eq(true)

      expect(coversheet_orders_applet.orders_applet_finish_loading?).to eq(true)
    end # it

    it 'TC412: Verify the problems/conditions applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::PROBLEM_APPLET).to eq(true)

      coversheet_problems_applet.problemsHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet_problems_applet.problemsHeaderDescription?).to eq(true)
      expect(coversheet_problems_applet.problemsHeaderAcuity?).to eq(true)

      expect(coversheet_problems_applet.problem_applet_finish_loading?).to eq(true)
    end # it

    it 'TC414: Verify the vitals applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::VITALS_APPLET).to eq(true)
      coversheet.vitalATable_element.when_visible
      expect(coversheet.vitalGistRows_elements.length).to be > 2
    end # it

    it 'TC415: Verify Community Health Summaries applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::CH_SUMMARIES).to eq(true)

      coversheet.chsHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet.chsHeaderDate?).to eq(true)
      expect(coversheet.chsHeaderAuthor?).to eq(true)

      expect(coversheet.community_health_summaries_applet_finish_loading?).to eq(true)
    end # it

    it " Verify 'An error has occured' is not displayed in any of the applets" do
      expect(coversheet.errorMessage_elements.length).to be == 0
    end # it
  end # context

  context 'The overview screen should load without issue. ' do
    it 'When the user views the overview screen' do
      overview.navigate_to_overview

      # put this expect here so each it-do has a verification
      expect(overview.applet_visible? PatientOverview::LAB_RESULTS).to be(true)
    end # it

    it 'TC416: Verify the lab result gist applet is displayed' do
      overview.labResultHeader_element.when_visible(APPLET_LOAD_TIME)
      expect(overview.labResultHeaderName?).to eq(true)
      expect(overview.labResultHeaderResult?).to eq(true)
      expect(overview.labResultHeaderLast?).to eq(true)

      expect(overview.labresults_gist_applet_finish_loading?).to eq(true)
    end # it

    it 'TC417: Verify the vitals gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::VITALS).to be(true)

      overview_vitalsgistapplet.vitalsGrid_element.when_visible(APPLET_LOAD_TIME)
      expect(overview_vitalsgistapplet.vitalsHeaderType?).to eq(true)
      expect(overview_vitalsgistapplet.vitalsHeaderResult?).to eq(true)
      expect(overview_vitalsgistapplet.vitalsHeaderLast?).to eq(true)
      expect(overview_vitalsgistapplet.vitalsHeaderGraph?).to eq(true)

      expect(overview_vitalsgistapplet.vitals_gist_applet_finish_loading?).to eq(true)
    end # it

    it 'TC418: Verify the immunization gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::IMMUNIZATIONS).to be(true)

      immunization_gist_applet.immPillGist_element.when_visible(APPLET_LOAD_TIME)
      expect(immunization_gist_applet.immunization_gist_applet_finish_loading?).to eq(true)
    end # it

    it 'TC419: Verify medication gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::MEDICATIONS).to be(true)

      overview_med_gist_applet.medGistHeader_element.when_visible(APPLET_LOAD_TIME)
      expect(overview_med_gist_applet.medGistHeaderName?).to eq(true)
      expect(overview_med_gist_applet.medGistHeaderDesc?).to eq(true)
      expect(overview_med_gist_applet.medGistHeaderRefills?).to eq(true)
      expect(overview_med_gist_applet.medGistHeaderChange?).to eq(true)
      expect(overview_med_gist_applet.medGistHeaderLast?).to eq(true)

      expect(overview_med_gist_applet.med_gist_applet_finish_loading?).to eq(true)
    end # it

    it 'TC420: Verify the conditions gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::CONDITIONS).to be(true)

      overview_conditions_gist_applet.conditionsGrid_element.when_visible(APPLET_LOAD_TIME)
      expect(overview_conditions_gist_applet.conditionsHeaderName?).to eq(true)
      expect(overview_conditions_gist_applet.conditionsHeaderAcuity?).to eq(true)
      expect(overview_conditions_gist_applet.conditionsHeaderLast?).to eq(true)
      expect(overview_conditions_gist_applet.conditionsHeaderHxOccur?).to eq(true)
      expect(overview_conditions_gist_applet.conditionsHeaderGraph?).to eq(true)

      expect(overview_conditions_gist_applet.conditions_applet_finish_loading?).to eq(true)
    end # it

    it 'TC421: Verify the allergy gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::ALLERGIES).to be(true)

      overview_allergy_gist_applet.allergyPillGist_element.when_visible(APPLET_LOAD_TIME)
      expect(overview_allergy_gist_applet.allergy_gist_applet_finish_loading?).to eq(true)
    end # it

    it 'TC422: Verify the report gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::REPORTS).to be(true)

      overview_reports_applet.reportHeaders_element.when_visible(APPLET_LOAD_TIME)
      expect(overview_reports_applet.reportHeaderDate?).to eq(true)
      expect(overview_reports_applet.reportHeaderType?).to eq(true)
      expect(overview_reports_applet.reportHeaderEnteredBy?).to eq(true)

      expect(overview_reports_applet.report_applet_finish_loading?).to eq(true)
    end # it

    it 'TC423: Verify encounter gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::ENCOUNTERS).to be(true)

      overview_encountersapplet.encountersGrid_element.when_visible(APPLET_LOAD_TIME)
      expect(overview_encountersapplet.encounterVisit?).to eq(true)
      expect(overview_encountersapplet.encounterAppointments?).to eq(true)
      expect(overview_encountersapplet.encounterAdmissions?).to eq(true)
      expect(overview_encountersapplet.encounterProcedures?).to eq(true)

      expect(overview_encountersapplet.encounter_applet_finish_loading?).to eq(true)
    end # it

    it " Verify 'An error has occured' is not displayed in any of the applets" do
      expect(overview.errorMessage_elements.length).to be == 0
    end # it
  end # context

  xcontext 'The document screen should load without issue - DE1786' do
    it 'When the user views the document screen' do
      documents.navigate_to_documents
      documents.appletTitle_element.when_visible
      expect(documents.appletTitle.strip).to eq('DOCUMENTS')
    end # it

    it 'TC408: Verify the document applet is displayed' do
      documents.dateHeader_element.when_visible
      expect(documents.headers_elements.length).to be > 0
      expect(documents.finished_loading).to eq(true)
    end # it
  end # context

  context 'The timeline screen should load without issue' do
    it 'When the user views the timeline screen' do
      timeline.navigate_to_timeline
    end

    it 'TC410: Verify the timeline applet is displayed' do
      timeline.appletTitle_element.when_visible
      expect(timeline.appletTitle.strip).to eq('TIMELINE')

      timeline.headers_element.when_visible
      expect(timeline.dateHeader?).to eq(true)
      expect(timeline.activityHeader?).to eq(true)
      expect(timeline.typeHeader?).to eq(true)
      expect(timeline.enteredByHeader?).to eq(true)
      expect(timeline.facilityHeader?).to eq(true)

      expect(timeline.finished_loading?).to eq(true)
    end # it
  end # context

  context 'The user should be able to perform a text search' do
    it 'TC413: Verify text search results are displayed' do
      coversheet.navigate_to_coversheet

      coversheet.searchField_element.when_visible
      coversheet.searchField = 'pulse'
      coversheet.searchField_element.send_keys :enter

      recordsearch.numberOfResults_element.when_visible
      expect(recordsearch.screenNm).to eq('Search Record')
      recordsearch.searchResults_element.when_visible
      recordsearch.singleSearchResult_element.when_visible(APPLET_LOAD_TIME)
      expect(recordsearch.searchGroupItems_elements.length).to be > 0
    end # it
  end # context

  context 'The med review screen should load without issue' do
    it 'When the user views the med review screen' do
      medreview.navigate_to_medreview
    end # it

    it 'TC486: Verify the med review applet is displayed' do
      medreview.appletTitle_element.when_visible
      expect(medreview.appletTitle.strip).to eq('MEDICATION REVIEW')
      medreview.mainContentArea_element.when_visible(EXTENDED_TIMEOUT)

      expect(medreview.outpatientGrouping?).to eq(true)
      expect(medreview.inpatientGrouping?).to eq(true)
    end # it
  end # context

  context 'The user should be able to perform a global search' do
    search_last_name = 'Eight'
    search_first_name = nil
    search_dob_str = nil
    search_ssn_str = '666000008'
    full_patient_name = 'Eight,Patient'
    dob = '04/07/1935'
    dob_date = Date.new(1935, 4, 7)
    gender = 'Male'
    ssn = '666-00-0008'

    it 'TC404: Verify user can complete a global search' do
      search.navigate_to_patient_search_screen

      # perform patient search
      @common_test.all_patient_search(search_last_name, search_first_name, search_dob_str, search_ssn_str, '')
      search.patientInTheList_element.when_visible
      search.click_the_right_patient_from_table(full_patient_name)

      # verify confirmation header
      search.confirmationHeader_element.when_visible(@default_timeout)
      expect(search.confirmationHeader.strip).to eq(full_patient_name.upcase)
      search.confirmationHeader_dob_element.when_visible

      expect(search.confirmationHeader_dob.strip).to eq(dob)
      expected_age = "#{calculate_patient_age(dob_date)}y"
      expect(search.confirmationHeader_age.strip).to eq(expected_age)
      expect(search.confirmationHeader_gender.strip).to eq(gender)
      expect(search.confirmationHeader_ssn.strip).to eq(ssn)

      # confirm patient selection
      search.firstConfirm_element.when_visible
      search.firstConfirm
      search.secondConfirmBtn_element.when_visible
      search.secondConfirmBtn

      # verify patient data on default screen
      overview.screenNm_element.when_visible
      overview.patientName_element.when_visible
      expect(overview.patientName).to eq(full_patient_name)
    end
  end
end # describe
