#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative '../lib/module/util.rb'
require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/laborders_writeback_page'
require_relative '../lib/pages/orders_page'
require_relative '../lib/pages/orders_form_page'
require_relative '../lib/common/ehmp_constants.rb'

include Util

# Team Neptune
describe 'Story# US6962: f432_laborderswriteback_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)
    @search = SearchPage.new(@driver)
    @lab_orders_writeback_page = LabOrdersWriteBackPage.new(@driver)
    @orders = OrdersPage.new(@driver)
    @order_form = LabOrdersWriteBackPage.new(@driver)
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }

  # context 'TC27418: User logs in and searches for Fourhundredseventy, Patient', tc27418: true do
  context "TC27418: User logs in and searches for #{FOURHUNDREDSEVENTY_PATIENT}", tc27418: true do
    it '. Login as default and search by #{FOURHUNDREDSEVENTY_PATIENT}' do
      @common_test.login_with_default
      @common_test.mysite_patient_search('Fourhundredseventy,Patient', 'Fourhundredseventy,Patient')
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it 'and the user makes the coversheet screen active' do
      @driver.goto(BASE_URL + '#cover-sheet')
      coversheet.screenNm_element.when_visible
      expect(coversheet.screenNm).to eq('Coversheet')
    end

    xit 'and the expected elements are displayed on the orders pop up' do
      @lab_orders_writeback_page.plusButton
      @lab_orders_writeback_page.generalMedicine_element.when_visible(@default_timeout)
      @lab_orders_writeback_page.generalMedicine_element.click
      @lab_orders_writeback_page.confirmButton
      @order_form.check_if_order_form_inputs_present
      expect(@order_form.order_form_title).to eq(ORDER_MODAL_TITLE)
    end

    xit 'and the user orders a new lab order' do
      @lab_orders_writeback_page.availableLabTestField
      @lab_orders_writeback_page.availableLabTestField_element.clear
      @lab_orders_writeback_page.availableLabTestField = 'PLASMA CELLS'
      @lab_orders_writeback_page.addButton
    end
  end
end
