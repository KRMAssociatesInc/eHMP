#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test'

describe 'Story#1101: Pilot_login.rb', :acceptance => true do
  include DriverUtility

  before(:all) do

  initializeConfigurations(BASE_URL)
	@login = LoginPage.new(@driver)
	@commonTest = CommonTest.new(@driver)


  end

  after(:all) do
    @driver.close
  end

  context 'AC#1002|TC#1202: Test the ehmp login functionality' do
    it '. Type in all credentials to login' do
		@commonTest.login_with("pu1234", "pu1234!!", "PANORAMA")
    end

  	it '. Verify that user logged in correctly' do
  		@login.currentUser_element.when_visible(timeout=20)
  		expect(@login.navTitle_element.text.strip).to eq("Patient Selection")
  		expect(@login.currentUser_element.text.strip.include?("USER, PANORAMA")).to eq(true)
  	end

  end


end
