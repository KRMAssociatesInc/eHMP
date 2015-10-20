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

describe 'F144: Orders ( f144_US2497_orders_spec.rb ) FUTURE WITH DE1571', future: true do
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
    # @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:applet) { OrdersPage.new(@driver) }
  let(:global_date_filter) { GlobalDateFilter.new(@driver) }
  context 'US2497: Clear text filters when switching quick filters on coversheet' do
    it 'When the user is viewing the coversheet' do
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::ORDER_APPLET).to eq(true)
      global_date_filter.select_all
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      applet.scroll_table
    end
    it 'and the user performs a text filter' do
      applet.click_show_filter_button(Coversheet::ORDER_APPLET) unless applet.textfilter_element.visible?
      applet.textfilter_element.when_visible

      filter_text = 'Cardiology'
      applet.textfilter = filter_text
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.order_cs_Column_elements, filter_text)).to eq(true)
    end
    it 'When the user filters by order type' do
      filter_text = 'Dietetics Order'
      applet.orderType = filter_text
      Watir::Wait.until { applet.orders_applet_finish_loading? }
    end
    it 'Verify the applet is filtered by order type' do
      expect(applet.column_contains_substring(applet.order_cs_Column_elements, 'Diet')).to eq(true)
    end
    it 'Verify the text filter is cleared'  do
      expect(applet.textfilter).to eq('')
    end
  end
  context 'US2497: Clear text filters when switching quick filters on expanded orders' do
    it 'When the user is viewing the expanded orders applet' do
      applet.navigate_to_orders_expanded
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      pre_filter_row_count = applet.ordersRows_elements.length
      applet.orderType = 'All'
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      Watir::Wait.until { applet.ordersRows_elements.length != pre_filter_row_count }
      applet.scroll_table
    end
    it 'and the user performs a text filter' do
      applet.click_show_filter_button(Coversheet::ORDER_APPLET) unless applet.textfilter_element.visible?
      applet.textfilter_element.when_visible

      filter_text = 'Cardiology'
      applet.textfilter = filter_text
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      expect(applet.column_contains_substring(applet.order_cs_Column_elements, filter_text)).to eq(true)
    end
    it 'When the user filters by order type' do
      applet.orderType = 'Dietetics Order'
      Watir::Wait.until { applet.orders_applet_finish_loading? }
    end
    it 'Verify the applet is filtered by order type' do
      expect(applet.column_contains_substring(applet.order_cs_Column_elements, 'Diet')).to eq(true)
    end
    it 'Verify the text filter is cleared'  do
      expect(applet.textfilter).to eq('')
    end
  end
end
