require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'rspec_helper'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/allergies_page'
require_relative '../lib/pages/global_date_filter_page'
require_relative '../lib/pages/allergies_modal_page'

describe '(F144) US2801: Verify allergy applet modal. ( f144_allergies_modal_spec.rb )', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
    full_patient_name = 'Bcma,Eight'
    @common_test.mysite_patient_search full_patient_name, full_patient_name, true
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:applet) { AllergiesGistPage.new(@driver) }
  let(:appletmodal) { AllergiesModalPage.new(@driver) }

  context 'US2801: Allergy Applet detail modal' do
    it 'When the user is viewing an Allergy detail modal' do
      applet.navigate_to_expanded_allergies
      Watir::Wait.until(ALLOW_INITIAL_LOAD, 'Applet did not finish loading data') { applet.grid_view_finish_loading? }
      expect(applet.contains_empty_row? AllergiesGistPage::ALLERGY_GRID_TABLE_ID).to eq(false), 'There are no data rows to test with'

      applet.rows_elements[0].click
      applet.detailViewButton_element.when_visible
      applet.detailViewButton
      appletmodal.mainModal_element.when_visible
    end
    it 'Verify the modal displays expected buttons' do
      expect(appletmodal.previous?).to eq(true)
      expect(appletmodal.next?).to eq(true)
      expect(appletmodal.close?).to eq(true)
      expect(appletmodal.xclose?).to eq(true)
    end
    it 'Verify the modal displays a title that starts with Allergen' do
      expect(appletmodal.title?).to eq(true)
      expect(appletmodal.title_element.text.downcase).to include 'Allergen'.downcase
    end
    it 'Verify the modal displays labels' do
      expect(appletmodal.symptoms?).to eq(true)
      expect(appletmodal.drugClasses?).to eq(true)
      expect(appletmodal.drugClassesLabel?).to eq(true)
      expect(appletmodal.drugClassesLabel).to eq('Drug Classes:')

      expect(appletmodal.natureOfReaction?).to eq(true)
      expect(appletmodal.natureOfReactionLabel?).to eq(true)
      expect(appletmodal.natureOfReactionLabel).to eq('Nature of Reaction:')

      expect(appletmodal.originatorName?).to eq(true)
      expect(appletmodal.originatorNameLabel?).to eq(true)
      expect(appletmodal.originatorNameLabel).to eq('Entered By:')

      expect(appletmodal.originated?).to eq(true)
      expect(appletmodal.originatedLabel?).to eq(true)
      expect(appletmodal.originatedLabel).to eq('Originated:')

      expect(appletmodal.verifierName?).to eq(true)
      expect(appletmodal.verifierNameLabel?).to eq(true)
      expect(appletmodal.verifierNameLabel).to eq('Verified:')

      expect(appletmodal.observedorhistorical?).to eq(true)
      expect(appletmodal.observedorhistoricalLabel?).to eq(true)
      expect(appletmodal.observedorhistoricalLabel).to eq('Observed/Historical:')

      expect(appletmodal.observedDate?).to eq(true)
      expect(appletmodal.observedorhistoricalLabel?).to eq(true)
      expect(appletmodal.observedDateLabel).to eq('Observed Date:')

      expect(appletmodal.facilityName?).to eq(true)
      expect(appletmodal.facilityNameLabel?).to eq(true)
      expect(appletmodal.facilityNameLabel).to eq('Site:')

      expect(appletmodal.commentsLabel?).to eq(true)
    end
    it 'Verify the modal closes' do
      appletmodal.xclose
      Watir::Wait.until { appletmodal.mainModal_element.visible? == false }
    end
  end
  context 'When the user is viewing an Allergy detail modal for specific rows' do
    it 'Verify modal displays data' do
      unique_sites_rows = applet.unique_sites_rows applet.unique_sites
      row_data = {}
      unique_sites_rows.each_key do |site_key|
        p "Verifying allergy detail modal for site #{site_key}"
        # save the displayed data in a specific row
        row_data['Allergen Name'] = applet.get_cell_data(unique_sites_rows[site_key], 1)
        # Standardized Allergen does not appear to be used in the modal
        # row_data['Standardized Allergen'] = applet.get_cell_data(unique_sites_rows[site_key], 2)
        row_data['Reaction'] = applet.get_cell_data(unique_sites_rows[site_key], 3)
        row_data['Severity'] = applet.get_cell_data(unique_sites_rows[site_key], 4)
        row_data['Drug Class'] = applet.get_cell_data(unique_sites_rows[site_key], 5)
        row_data['Entered By'] = applet.get_cell_data(unique_sites_rows[site_key], 6)
        row_data['Facility'] = applet.get_cell_data(unique_sites_rows[site_key], 7)
        row_data['Comments'] = applet.get_comment(unique_sites_rows[site_key])

        # open the row detail view
        applet.class.element(:modal_row_test, :tr, id: unique_sites_rows[site_key])
        expect(open_modal(applet.modal_row_test_element))
        appletmodal.title_element.when_visible

        # check each data point against data I know about from the grid
        expect(appletmodal.title).to include(row_data['Allergen Name']), "Title (#{appletmodal.title}) should include #{row_data['Allergen Name']}"
        expect(appletmodal.symptoms).to include(row_data['Reaction']), "Symptoms should include #{row_data['Reaction']}"
        if row_data['Severity'].strip.length > 0
          expect(appletmodal.severity_element.text).to eq(row_data['Severity'])
        end
        expect(appletmodal.drugClasses).to include(row_data['Drug Class']), "Drug Class should include #{row_data['Drug Class']}"
        expect(appletmodal.originatorName).to include(row_data['Entered By']), "Entered By should include #{row_data['Entered By']}"
        expect(appletmodal.facilityName).to include(row_data['Facility']), "Site should include #{row_data['Facility']}"

        if row_data['Comments'].include? 'fa-comment'
          expect(appletmodal.comments?).to eq(true), 'Expected comments area to be displayed and it is not'
          expect(appletmodal.comments_element.text.strip.length).to be > 0, 'Expected the comments area to contain text and it does not'
        end

        appletmodal.xclose
        Watir::Wait.until { appletmodal.mainModal_element.visible? == false }
      end
    end
  end

  def open_modal(row_element)
    row_element.click
    applet.detailViewButton_element.when_visible
    applet.detailViewButton
    appletmodal.mainModal_element.when_visible
    true
  rescue => e
    p "error: #{e}"
    false
  end
end
