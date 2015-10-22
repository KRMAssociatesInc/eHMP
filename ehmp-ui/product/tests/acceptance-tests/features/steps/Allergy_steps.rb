  path = File.expand_path '..', __FILE__
  $LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
  path = File.expand_path '../../../../shared-test-ruby', __FILE__
  $LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
  path = File.expand_path '../helper', __FILE__
  $LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

  require 'AccessBrowserV2.rb'

  def wait_for_loading_allergy
    i = 120
    while i > 0
      element = TestSupport.driver.find_elements(:css, "#allergensLoadingIndicator")
      if element[0].displayed?
        i += 1
      # sleep 1
      else
        return
      end
    end
    fail "Loading indicator did not clear."
  end

  class AllergySearch < AccessBrowserV2
    include Singleton
    def initialize
      super
      add_action(CucumberLabel.new("Reaction Date"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "obs-date"))
      add_action(CucumberLabel.new("Reaction Time"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "obs-time")) 
      add_verify(CucumberLabel.new("panelTitle"), VerifyContainsText.new, AccessHtmlElement.new(:class, "panel-title"))
      add_action(CucumberLabel.new("allergenSearchInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "allergenSearchInput"))
      add_verify(CucumberLabel.new("allergenSearchResults"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#allergen-search-result-item-container a"))
      add_action(CucumberLabel.new("allergenSearchResults"), ClickAction.new, AccessHtmlElement.new(:css, "#allergen-search-result-item-container > li > a"))
      add_action(CucumberLabel.new("symptomSearchInput"), SendKeysAction.new, AccessHtmlElement.new(:id, "symptomSearchInput"))
      add_verify(CucumberLabel.new("symptomSearchInput"), VerifyContainsText.new, AccessHtmlElement.new(:id, "symptomSearchInput"))
      add_verify(CucumberLabel.new("LoadImage"), VerifyContainsText.new, AccessHtmlElement.new(:id, "ali-img"))
      add_verify(CucumberLabel.new("AllergySaved"), VerifyContainsText.new, AccessHtmlElement.new(:css, "td"))
      add_action(CucumberLabel.new("allergiesFilterSearch"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:name, "q-allergy_grid"))
      add_action(CucumberLabel.new("expandApplet"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='allergy_grid'] .grid-resize button"))
      add_verify(CucumberLabel.new("AddModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#addEditAllergy h4.modal-title"))
      add_verify(CucumberLabel.new("SearchModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#allergySearch h4.modal-title"))
    end
  end # AllergySearch

  Then(/^the add modal title is "(.*?)"$/) do |title|
    con = AllergySearch.instance
    con.wait_until_action_element_visible("AddModalTitle", 60)
    expect(con.static_dom_element_exists?("AddModalTitle")).to be_true
    expect(con.perform_verification("AddModalTitle", title)).to be_true
  end

  Then(/^the search modal title is "(.*?)"$/) do |title|
    con = AllergySearch.instance
    con.wait_until_action_element_visible("SearchModalTitle", 60)
    expect(con.static_dom_element_exists?("SearchModalTitle")).to be_true
    expect(con.perform_verification("SearchModalTitle", title)).to be_true
  end

  Given(/^the user enters Reaction Date "([^"]*)"$/) do |element|
    con= AllergySearch.instance
    #con.wait_until_action_element_visible("Reaction Date")
    #expect(con.static_dom_element_exists?("Reaction Date")).to be_true
    expect(con.perform_action("Reaction Date", element)).to be_true
  end # Date

  Given(/^the user enters valid Reaction Time "([^"]*)"$/) do |element|
    con= AllergySearch.instance
    #con.wait_until_action_element_visible("Reaction Time")
    expect(con.perform_action('Reaction Time', element)).to be_true
  end # time

  Given(/^the user enters invalid Reaction Time format "([^"]*)"$/) do |element|
    con= AllergySearch.instance
    
    expect(con.perform_action('Reaction Time', element)).to be_true
  end # time

  Then(/^the search results populate "([^"]*)"$/) do |element|
    con = AllergySearch.instance
    TestSupport.wait_for_page_loaded
    con.wait_until_action_element_visible("allergenSearchResults")
    expect(con.static_dom_element_exists?("allergenSearchResults")).to be_true
    con.perform_verification("allergenSearchResults", element)
    wait_for_loading_allergy
  end

  Given(/^the user selects allergen "([^"]*)"$/) do |element|
    con = AllergySearch.instance    
    expect(con.perform_action("allergenSearchResults", element)).to be_true
  end

  Given(/^the user enters allergy Search "([^"]*)"$/) do |element|
    con = AllergySearch.instance
    driver = TestSupport.driver
    con.wait_until_action_element_visible("allergenSearchInput", 60)
    expect(con.static_dom_element_exists?("allergenSearchInput")).to be_true
    con.perform_action('allergenSearchInput', element)
  end # AllergySearch

  Then(/^the user click on Allergies Expand View$/) do
    con = AllergySearch.instance
    expect(con.perform_action("expandApplet")).to be_true
  end

  Then(/^the Allergy Saved in the table/) do
    con = AllergySearch.instance
    expect(con.perform_verification("AllergySaved", "PENICILLIN")).to be_true
  end

  Then(/^the Allergy user enters Allergy name "([^"]*)"$/) do |element|
    con = AllergySearch.instance
    expect(con.perform_action("allergiesFilterSearch", element)).to be_true
  end

  Given(/^the user enters Symptoms Search "([^"]*)"$/) do |element|
    con = AllergySearch.instance

    expect(con.perform_action('symptomSearchInput', element)).to be_true
    wait_for_loading_symptoms
  end # Sympotom Search

  def wait_for_loading_symptoms
    i = 120
    while i > 0
      element = TestSupport.driver.find_elements(:css, "#symptomsLoadingIndicator")
      if element[0].displayed?
        i += 1
      # sleep 1
      else
        return
      end
    end
    fail "Loading indicator did not clear."
  end

  class Symptom< AccessBrowserV2
    include Singleton
    def initialize
      super
      # add_action(CucumberLabel.new("Symptom"), ClickAction.new, AccessHtmlElement.new(:link_text, "PAIN IN EYE"))
    end
  end # Symptom

  class Reaction< AccessBrowserV2
    include Singleton
    def initialize
      super
      add_action(CucumberLabel.new("Reaction"), ComboSelectAction.new, AccessHtmlElement.new(:id, "nature"))
      add_action(CucumberLabel.new("Symptom1"), ClickAction.new, AccessHtmlElement.new(:link_text, "PAIN IN EYE"))
      add_action(CucumberLabel.new("Symptom2"), ClickAction.new, AccessHtmlElement.new(:link_text, "PAIN OF BREAST"))
      add_action(CucumberLabel.new("Symptom1 Removed"), ClickAction.new, AccessHtmlElement.new(:id, "but-1-362"))
      add_action(CucumberLabel.new("Symptom1_Date"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#dp-1-362"))
      add_action(CucumberLabel.new("Symptom1_Time"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#tp-1-362"))
      add_action(CucumberLabel.new("comments"), SendKeysAction.new, AccessHtmlElement.new(:id, "comments"))
    end
  end # Reaction

  Given(/^the user enters Comments "([^"]*)"$/) do |element|
    con = Reaction.instance
    expect(con.perform_action("comments", element)).to be_true
  end

  Then(/^the user Selects Reaction of "([^"]*)"$/) do |nature|
    con = Reaction.instance
    expect(con.perform_action("Reaction", nature)).to be_true
  end

  Then(/^the user Selects symptoms_1 of "([^"]*)"$/) do |element|
    con = Reaction.instance
    expect(con.perform_action("Symptom1", element)).to be_true
  end

  Then(/^the user Entered symptoms_1 Date "([^"]*)"$/) do |element|
    con = Reaction.instance
    expect(con.perform_action("Symptom1_Date", element)).to be_true
  end

  And(/^the user Entered symptoms_1 Time "([^"]*)"$/) do |element|
    con = Reaction.instance
    expect(con.perform_action("Symptom1_Time", element)).to be_true
  end
  
  Then(/^the user Selects symptoms_2 of "([^"]*)"$/) do |element|
    con = Reaction.instance
    expect(con.perform_action("Symptom2", element)).to be_true
  end

  Then(/^the user Removes symptoms_1 of "([^"]*)"$/) do |element|
    con = Reaction.instance
    expect(con.perform_action("Symptom1 Removed", element)).to be_true
  end

  def wait_for_allergy_modal_to_close
    wait_until_modal_is_not_displayed
  end

  class AllergyButtons< AccessBrowserV2
    include Singleton
    def initialize
      super
      add_action(CucumberLabel.new("Add"), ClickAction.new, AccessHtmlElement.new(:id, "allergies-add-new"))
      add_action(CucumberLabel.new("Add Item"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@title='Allergies']/descendant::*[@title='Add Item']"))
      add_action(CucumberLabel.new("allergenSearchButton"), ClickAction.new, AccessHtmlElement.new(:css, "#allergenSearchButton > span.glyphicon.glyphicon-search"))
      add_verify(CucumberLabel.new("allergenSearchInput"), VerifyPlaceholder.new, AccessHtmlElement.new(:id, "allergenSearchInput"))
      add_action(CucumberLabel.new("PENICILLIN"), ClickAction.new, AccessHtmlElement.new(:css, "a.list-group-item.row-layout > div.ax_shape._nav-pills_background_pills > div.text > p"))     
      add_action(CucumberLabel.new("Observed"), ClickAction.new, AccessHtmlElement.new(:id, "btn-observer"))
      add_action(CucumberLabel.new("Historical"), ClickAction.new, AccessHtmlElement.new(:id, "btn-historical"))
      add_action(CucumberLabel.new("Severe"), ClickAction.new, AccessHtmlElement.new(:id, "btn-severe"))
      add_action(CucumberLabel.new("Moderate"), ClickAction.new, AccessHtmlElement.new(:id, "btn-moderate"))
      add_action(CucumberLabel.new("Mild"), ClickAction.new, AccessHtmlElement.new(:id, "btn-mild"))
      add_action(CucumberLabel.new("Add-Allergy"), ClickAction.new, AccessHtmlElement.new(:id, "add-allergy"))
      add_action(CucumberLabel.new("Cancel"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-allergy-cancel"))
      add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
      add_action(CucumberLabel.new("Back"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-allergy-back"))
      add_action(CucumberLabel.new("Save"), ClickAction.new, AccessHtmlElement.new(:css, "button.btn.btn-primary"))
      add_verify(CucumberLabel.new("Modal Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#mainModalDialog h4.modal-title"))
      add_verify(CucumberLabel.new("SearchModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#allergySearch h4.modal-title"))
      add_verify(CucumberLabel.new("AddModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#addEditAllergy h4.modal-title"))
      add_verify(CucumberLabel.new("Error Message"), VerifyContainsText.new, AccessHtmlElement.new(:css, "div.col-sm-12 > #error-container > #server-side-errors > #server-side-error-list > li > h6 > div.errorMsg.applet-error"))
      add_verify(CucumberLabel.new("Time Error Message"), VerifyContainsText.new, AccessHtmlElement.new(:css, "span.applet-error"))
      add_verify(CucumberLabel.new("Add New Allergy"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
      add_action(CucumberLabel.new("AllergyFilter"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-allergy_grid"))
      add_action(CucumberLabel.new("AllergyRefresh"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='allergy_grid'] .applet-refresh-button"))
      add_verify(CucumberLabel.new("Allergy Grid"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-panel-allergy_grid th"))
    end
  end   

  Then(/^the "(.*?)" displays$/) do |element|
    con = AllergyButtons.instance
    driver = TestSupport.driver
    con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
    expect(con.static_dom_element_exists?(element)).to be_true
    expect(con.perform_verification(element, '')).to be_true
  end

  Then(/^the Allergy search modal title is "(.*?)"$/) do |element|
    con = AllergyButtons.instance
    con.wait_until_action_element_visible("SearchModalTitle", 60)
    expect(con.static_dom_element_exists?("SearchModalTitle")).to be_true
    expect(con.perform_verification("SearchModalTitle", element)).to be_true
  end

  Then(/^the Allergy add modal title is "(.*?)"$/) do |element|
    con = AllergyButtons.instance
    con.wait_until_action_element_visible("AddModalTitle", 60)
    expect(con.static_dom_element_exists?("AddModalTitle")).to be_true
    expect(con.perform_verification("AddModalTitle", element)).to be_true
  end

  Then(/^the Allergy modal title is "(.*?)"$/) do |element|
    aa = AllergyButtons.instance
    expect(aa.perform_verification(element, '')).to be_true
  end

  Then(/^the duplicate Allergy error displays: "(.*?)"$/) do |element|
    con = AllergyButtons.instance
    con.wait_until_action_element_visible("Error Message", 60)
    expect(con.static_dom_element_exists?("Error Message")).to be_true
    expect(con.perform_verification("Error Message", element)).to be_true
  end

  Then(/^the Invalid Time format error dispalys "(.*?)"$/) do |element|
    con = AllergyButtons.instance
    expect(con.perform_verification("Time Error Message", element)).to be_true
  end

  Then(/^the modal contains the allergen search input/) do
    con = AllergyButtons.instance
    expect(con.perform_verification("allergenSearchInput", "Lookup causative agent")).to be_true
  end

  When(/^Allergy User Selects "([^"]*)"$/) do |element|
    con = AllergyButtons.instance
    driver = TestSupport.driver
    con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
    expect(con.static_dom_element_exists?(element)).to be_true
    con.perform_action(element, "")
    con.wait_until_action_element_invisible("Add-Allergy")
  end

  When(/^the Allergy user clicks "([^"]*)"$/) do |element|
    con = AllergyButtons.instance
    driver = TestSupport.driver
    con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
    expect(con.static_dom_element_exists?(element)).to be_true
    expect(con.perform_action(element, "")).to be_true
  end

  Then(/^the "([^"]*)" Banner displays$/) do |element|
    con = AllergyButtons.instance
    driver = TestSupport.driver
    con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
    expect(con.static_dom_element_exists?(element)).to be_true
    expect(con.perform_verification(element, '')).to be_true
  end

  Then(/^the Allergy user Cannot clicks "([^"]*)"$/) do |element|
    con = AllergyButtons.instance
    expect(con.perform_action(element, "")).to be_true
  end
