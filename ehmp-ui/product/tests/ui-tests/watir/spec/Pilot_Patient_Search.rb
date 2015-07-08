#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search'
require_relative '../lib/pages/common_test'
require_relative '../lib/pages/patient_overview'

describe 'Story#:1100: Pilot_login.rb', :acceptance => true do
  include DriverUtility

  before(:all) do

    initializeConfigurations(BASE_URL)
	@login = LoginPage.new(@driver)
	@search = SearchPage.new(@driver)
	@commonTest = CommonTest.new(@driver)
	@overView = PatientOverview.new(@driver)

	@commonTest.login_with("pu1234", "pu1234!!", "PANORAMA")
	@login.currentUser_element.when_visible(timeout=20)
	expect(@login.currentUser_element.text.strip.include?("USER, PANORAMA")).to eq(true)

  end

  after(:all) do
    @driver.close
  end

	context "AC#1001|TC#1201: Global Search happy path and negative scenarios. \n" do

	  patientSearchScenario = [

		  { :facility => "PANORAMA", :lName => "Eight", :fName => "Patient|Patient", :doB => "|04/07/1935", :ssN => "|666-00-0008", :gender => "Male", :errMsg => "" },
		  { :facility => "PANORAMA", :lName => "Eight", :fName => "|Patient", :doB => "|04/07/1935", :ssN => "666-00-0008|666-00-0008", :gender => "Male", :errMsg => "" },
		  { :facility => "PANORAMA", :lName => "Eight", :fName => "|Patient", :doB => "04/07/1935|04/07/1935", :ssN => "|666-00-0008", :gender => "Male", :errMsg => "" },
		  { :facility => "PANORAMA", :lName => "Eight", :fName => "|Patient", :doB => "04/07/1935|04/07/1935", :ssN => "666-00-0008|666-00-0008", :gender => "Male", :errMsg => "" },
		  { :facility => "PANORAMA", :lName => "Eight", :fName => "Patient|Patient", :doB => "04/07/1935|04/07/1935", :ssN => "666-00-0008|666-00-0008", :gender => "Male", :errMsg => "" },
		  { :facility => "PANORAMA", :lName => "Eight", :fName => "|Patient", :doB => "|04/07/1935", :ssN => "0008|666-00-0008", :gender => "Male", :errMsg => "Error: SSN must match the format: 123-45-6789 or 123456789." },
		  { :facility => "PANORAMA", :lName => "Smith", :fName => "John|", :doB => "|n", :ssN => "|n", :gender => "Male", :errMsg => "Search returned too many results please refine your search criteria and try again." },
		  { :facility => "PANORAMA", :lName => "Unknown", :fName => "Patient|", :doB => "|n", :ssN => "|n", :gender => "Male", :errMsg => "No results were found." },
		  { :facility => "PANORAMA", :lName => "zzzretfivefifty", :fName => "Patient|", :doB => "|04/07/1935", :ssN => "|666-21-2121", :gender => "Male", :errMsg => "RESTRICTED RECORD" },
		  # { :facility => "PANORAMA", :lName => "BCMA", :fName => "Eighteen-Patient", :doB => "", :ssN => "", :gender => "Male", :errMsg => "yes" },
		  { :facility => "PANORAMA", :lName => " Eight ", :fName => " Patient |Patient", :doB => "|04/07/1935", :ssN => "|666-00-0008", :gender => "Male", :errMsg => "" },
	  # { :facility => "KODAK", :lName => "DODONLY", :fName => "PATIENT|Patient", :doB => "|09/09/1969", :ssN => "|666-33-0018", :gender => "Male", :errMsg => "" }
	  # { :facility => "KODAK", :lName => "BCMA", :fName => "Eighteen-Patient", :doB => "", :ssN => "", :gender => "Male", :errMsg => "yes" }

	  ]

	  preFacility = "PANORAMA"
	  i = 1
	  patientSearchScenario.each do |scenario|

		  if scenario[:errMsg] == ''
			  logText = ". Verify that global search returned the correct patient and after confirm selection, patient's information accurately displayed in overview. \n Meta data: "
			  metaData = scenario[:facility].upcase + '|'+ scenario[:lName] + '|'+ scenario[:fName].split("|")[0] + '|' + scenario[:doB].split("|")[0] + '|' + scenario[:ssN].split("|")[0]
		  else
			  logText = ". Verify that the correct error message displayed resulted from this global search."
			  metaData = scenario[:facility].upcase + '|' + scenario[:lName] + '|' + scenario[:fName].split("|")[0] + '|' + scenario[:doB].split("|")[0] + '|' + scenario[:ssN].split("|")[0] + "|" + scenario[:errMsg]
		  end

		it logText + metaData do

			if scenario[:errMsg] != ''
				refreshPage()
			end

			if scenario[:facility].upcase != preFacility
				@login.currentUser
				@login.logout_element.when_visible
				@login.logout
				@commonTest.login_with("pu1234", "pu1234!!", scenario[:facility].upcase)
				@login.currentUser_element.when_visible(timeout=20)
				# puts "displayedUserText=" + @login.displayedUser.strip
				#expect(@login.currentUser_element.text.strip.include?('USER, ' + scenario[:facility].upcase)).to eq(true)
				#Toggle the user drop down
				# @login.currentUser
				# @login.displayedUser_element.when_visible
				# expect(@login.displayedUser.strip.include?(scenario[:facility].upcase)).to eq(true)
			elsif @overView.screenNm?
				@search.returnToPatientSrch_element.click
				@search.allPatientTab_element.when_visible(timeout=10)
			end

			@commonTest.allPatientSearch(scenario[:lName], scenario[:fName].split('|')[0], scenario[:doB].split('|')[0], scenario[:ssN].split('|')[0])
			patientName = scenario[:lName].strip + ',' + scenario[:fName].split('|')[0].strip
			if scenario[:errMsg] == '' or scenario[:errMsg] == 'RESTRICTED RECORD'
				expect(@search.isThisPatientInThePatientListTable(1, patientName)).to eq(true)
				@search.clickTheRightPatientFromTable(patientName)
				if scenario[:errMsg] != 'RESTRICTED RECORD'
					@search.firstConfirm_element.when_visible(timeout=10)
					@search.firstConfirm
					@search.secondConfirmBtn_element.when_visible(timeout=20)
					@search.secondConfirmBtn
				else
					@search.restrictRecrdConf_element.when_visible(timeout=10)
					expect(@search.restrictedTitle_element.text.strip.upcase.include?(scenario[:errMsg]))
					@search.restrictRecrdConf
					#This is actually the 2nd confirm button for the Restricted Record
					@search.firstConfirm_element.when_visible(timeout=10)
					@search.firstConfirm
				end

				@overView.screenNm_element.when_visible(timeout=20)
				#Verify that the data displayed in Overview are accurate
				tempArry = @overView.oVDoB.split(" (")
				expect(tempArry[0]).to eq(scenario[:doB].split("|")[1])
				pdob = DateTime.strptime(scenario[:doB].split("|")[1], format="%m/%d/%Y")
				expectedAge = calculatePatientAge(pdob).to_s + 'y)'
				expect(tempArry[1]).to eq(expectedAge)

				expect(@overView.oVSsn.include?(scenario[:ssN].split("|")[1])).to eq(true)
				expect(@overView.oVGender).to eq(scenario[:gender])

			else
				expect(@search.patientErrMsg).to eq(scenario[:errMsg])
			end

			preFacility = scenario[:facility].upcase
			i = i + 1
	  	end

	  end

  end

  ################ Begin local functions ####################

end
