require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/orders_page'
require_relative '../lib/pages/global_date_filter_page'

describe 'F144: Orders ( f144_US1775_orders_spec.rb )', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
    @login.currentUser_element.when_visible(20)
    full_patient_name = 'Eight,Patient'
    @common_test.mysite_patient_search full_patient_name, full_patient_name
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:applet) { OrdersPage.new(@driver) }
  let(:global_date_filter) { GlobalDateFilter.new(@driver) }

  context 'US1775: Include orders in the Coversheet' do
    it 'Verify user can filter by order type - consult' do
      # prep test
      applet.navigate_to_orders_expanded
      applet.click_show_filter_button(Coversheet::ORDER_APPLET) unless applet.all_range_element.visible?
      applet.all_range_element.when_visible
      applet.all_range_element
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      applet.scroll_table
      Watir::Wait.until { applet.orders_applet_finish_loading? }

      type = 'Consult'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Laboratory' do
      type = 'Laboratory'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Medication, Infusion' do
      type = 'Medication, Infusion'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Medication, Inpatient' do
      type = 'Medication, Inpatient'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Medication, Non-VA' do
      type = 'Medication, Inpatient'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Medication, Outpatient' do
      type = 'Medication, Outpatient'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Nursing Order' do
      type = 'Nursing Order'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Radiology' do
      type = 'Radiology'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
    it 'Verify user can filter by order type - Dietetics Order' do
      type = 'Dietetics Order'
      applet.orderType = type
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.type_ex_Column_elements, type)).to eq(true)
    end
  end
end
