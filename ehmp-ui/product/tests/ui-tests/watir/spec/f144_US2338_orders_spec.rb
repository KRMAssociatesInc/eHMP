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

describe 'F144: Orders ( f144_US2338_orders_spec.rb )', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
    @login.currentUser_element.when_visible(20)
    full_patient_name = 'Eight,Patient'
    @common_test.mysite_patient_search full_patient_name, full_patient_name
    @loop_count = 0
    @order_column = nil
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:applet) { OrdersPage.new(@driver) }
  let(:global_date_filter) { GlobalDateFilter.new(@driver) }
  context 'US2338: As a user I can step through the orders in the list' do
    it 'When the user is viewing the coversheet' do
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::ORDER_APPLET).to eq(true)
      global_date_filter.select_all
      Watir::Wait.until { applet.orders_applet_finish_loading? }
      applet.scroll_table
    end
    it 'And the user views an order in the modal' do
      order_rows = applet.ordersRows_elements
      expect(order_rows.length).to be > 1, 'Unable to perform test, order applet does not have enough rows to perform test'
      @loop_count = order_rows.length < 10 ? (order_rows.length - 1) : 10
      @order_column = applet.order_cs_Column_elements
      order_rows[0].scroll_into_view
      order_rows[0].click

      applet.modalTitle_element.when_visible
      expect(applet.modalTitle_element.text.strip).to eq(@order_column[0].text)
    end
    it 'Verify user can step through the orders using the next button' do
      (1..@loop_count).each do |i|
        applet.nextButton
        applet.modalTitle_element.when_visible
        expect(applet.modalTitle_element.text.strip).to eq(@order_column[i].text)
      end
    end
    it 'Verify user can step through the orders using the previous button' do
      @loop_count.downto(1).each_with_index do |i|
        applet.previousButton
        applet.modalTitle_element.when_visible
        expect(applet.modalTitle_element.text.strip).to eq(@order_column[i - 1].text)
      end
    end
  end
end
