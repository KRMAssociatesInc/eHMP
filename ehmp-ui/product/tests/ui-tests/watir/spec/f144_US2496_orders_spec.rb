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

describe 'F144: Orders ( f144_US2496_orders_spec.rb )', acceptance: true do
  include DriverUtility
  dread_row_count = 0
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
    @login.currentUser_element.when_visible(20)
    full_patient_name = 'BCMA,Eight'
    @common_test.mysite_patient_search full_patient_name, full_patient_name
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:applet) { OrdersPage.new(@driver) }
  let(:global_date_filter) { GlobalDateFilter.new(@driver) }
  context 'US2496: Persistent filters when switching applet views ( coversheet to expanded )- order type' do
    it 'When the user is viewing the coversheet' do
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::ORDER_APPLET).to eq(true)
      global_date_filter.select_all
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      applet.scroll_table
    end
    it 'and the user filters by order type' do
      pre_filter_row_count = applet.ordersRows_elements.length
      applet.orderType = 'Laboratory'
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      Watir::Wait.until { applet.ordersRows_elements.length != pre_filter_row_count }
      dread_row_count = applet.ordersRows_elements.length
    end
    it 'When the user expands the orders applet' do
      applet.click_maximize_applet_button Coversheet::ORDER_APPLET
      Watir::Wait.until { applet.screenNm == 'Orders' }
      Watir::Wait.until { applet.orders_applet_finish_loading? }
    end
    it 'Verify the order type is set' do
      expect(applet.orderType).to eq('Laboratory')
    end
    it 'Verify the order applet is filtered by order type' do
      expect(applet.ordersRows_elements.length).to eq(dread_row_count)
    end
  end
  context 'US2496: Persistent filters when switching applet views ( expanded to coversheet )- order type' do
    it 'When the user is viewing the expanded applet' do
      expect(applet.screenNm).to eq('Orders')
    end
    it 'and the user filters by order type' do
      expect(applet.orderType).to eq('Laboratory')
      dread_row_count = applet.ordersRows_elements.length
    end
    it 'When the user minimizes the orders applet' do
      applet.click_minimize_applet_button Coversheet::ORDER_APPLET
      Watir::Wait.until { applet.screenNm == 'Coversheet' }
      Watir::Wait.until { applet.orders_applet_finish_loading? }
    end
    it 'Verify the order type is set' do
      expect(applet.orderType).to eq('Laboratory')
    end
    it 'Verify the order applet is filtered by order type' do
      expect(applet.ordersRows_elements.length).to eq(dread_row_count)
    end
  end
  # context 'US2496: Persistent filters when switching applet views - text filter' do
  # end
end
