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

describe 'F144: orders ( f144_orders_defects_spec.rb) ', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
    full_patient_name = 'Seven,Patient'
    p "performing patient search for #{full_patient_name}"
    @common_test.mysite_patient_search full_patient_name, full_patient_name
  end

  after(:all) do
    @driver.close
  end

  let(:orders_applet) { OrdersPage.new(@driver) }

  context 'US2921: Orders: Add additional filtering (f144_4_lab_results_base_applet_single_page).' do
    text_filter_term = 'CREATININE'
    it 'When the user is viewing the expanded orders applet' do
      orders_applet.navigate_to_orders_expanded
    end
    it 'and the user has set the date filter to All' do
      orders_applet.click_show_filter_button(Coversheet::ORDER_APPLET) unless orders_applet.all_range_element.visible?
      orders_applet.all_range_element.when_visible
      orders_applet.all_range_element
      Watir::Wait.until { orders_applet.orders_applet_finish_loading? }
    end
    it "When the user performs a text filter using the text '#{text_filter_term}'" do
      expect(orders_applet.textfilter_element.visible?).to eq(true)
      pre_filter_row_count = orders_applet.ordersRows_elements.length
      orders_applet.textfilter = text_filter_term
      Watir::Wait.until { orders_applet.ordersRows_elements.length != pre_filter_row_count }
    end
    it 'Then the orders applet filters to correct rows' do
      expect(orders_applet.column_contains_substring(orders_applet.orderColumn_elements, text_filter_term)).to eq(true)
    end
  end
end
