path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class AllergyEIETest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("EIE Button"), ClickAction.new, AccessHtmlElement.new(:id, "error"))
  end
end

class ErrorElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new('Save'), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='modal-footer']/descendant::*[@id='submit']"))
  end
end

class Comments< AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("comments"), SendKeysAction.new, AccessHtmlElement.new(:id, "comments"))
  end
end # Reaction

Given(/^two allergies have been recorded for patient "(.*?)"$/) do |_pid|
  add_simple_allergy("DUST")
  add_simple_allergy("BEE STINGS")
  p "Waiting for sync..."
  sleep 30
end

Given(/^"(.*?)" allergy has been recorded for this patient$/) do |allergen|
  search_add_allergy(allergen)
end

Then(/^the coversheet shows the allergy "(.*?)" and the user selects it$/) do |allergen|
  driver = TestSupport.driver
  el = driver.find_element(:xpath, '//*[@title="Allergies"]/descendant::*[@class="gistItem"]/descendant::*[contains(text(), "' + allergen + '")]')
  expect(el.text.strip == allergen).to be_true
  el.click
end

Then(/^the "(.*?)" reaction has been removed from the coversheet$/) do |allergen|
  #
  driver = TestSupport.driver
  displayed = false
  begin
    displayed = driver.find_element(:xpath, '//*[@title="Allergies"]/descendant::*[@class="allergyBubbleView"]/descendant::*[contains(text(), "' + allergen + '")]')
  rescue Selenium::WebDriver::Error::NoSuchElementError
    displayed = false
  end
  expect(!displayed).to be_true, allergen + " is still present"
end

When(/^the user clicks delete on the "(.*?)" reaction$/) do |reaction|
  driver = TestSupport.driver

  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url+'#allergy-list')
  driver.navigate.refresh

  reaction_element = wait_for_element('//tr/td[contains(string(), "' + reaction + '")]')

  if reaction_element.size == 0
    fail reaction + ' not found'
  end

  reaction_element[0].click
end

Then(/^the allergen Entered in Error modal appears$/) do
  buttons = AllergyButtons.instance
  buttons.wait_until_action_element_visible('Modal Title', 15)
  buttons.perform_verification('Modal Title', 'Mark Adverse Reaction to')
end

Then(/^the user clicks the EIE button$/) do
  buttons = AllergyEIETest.instance
  buttons.wait_until_action_element_visible('EIE Button', 15)
  buttons.perform_action('EIE Button', 'EIE')
end

When(/^the user clicks the add allergy button$/) do
  buttons = AllergyButtons.instance
  buttons.wait_until_action_element_visible('Add Item', 15)
  buttons.perform_action('Add Item', 'Add-Allergy')
end

Given(/^the user has recorded "([^"]*)"$/) do |element|
  comments = Reaction.instance
  comments.wait_until_action_element_visible('comments', 15)
  comments.perform_action('comments', element)
end

When(/^the user clicks the Save button$/) do
  buttons = ErrorElements.instance
  buttons.wait_until_action_element_visible('Save', 15)
  buttons.perform_action('Save')
end

Then(/^the "(.*?)" reaction has been removed$/) do |reaction|
  driver = TestSupport.driver

  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url+'#allergy-list')
  sleep 5
  driver.navigate.refresh

  wait_for_element('//td')
  p "List refreshed"
  reaction_element = wait_for_element('//td[contains(string(), "' + reaction + '")]', 10)
  if reaction_element.size != 0
    fail 'Allergen "' + reaction + '" still listed'
  end
end

def search_add_allergy(allergen)
  #
  buttons = AllergyButtons.instance
  search = AllergySearch.instance
  reaction = Reaction.instance
  comments = Comments.instance
  driver = TestSupport.driver

  p 'Searching for ' + allergen
  search.wait_until_action_element_visible('allergenSearchInput', 60)
  expect(search.static_dom_element_exists?('allergenSearchInput')).to be_true
  sleep 1
  search.perform_action('allergenSearchInput', allergen)
  search.wait_until_action_element_visible('allergenSearchResults', 60)
  search.perform_action('allergenSearchResults', allergen)

  p 'Filling out minimal data to add allergen'
  buttons.wait_until_action_element_visible('Historical', 60)
  p 'Historical'
  buttons.perform_action('Historical')
  sleep 1
  p 'Reaction'
  reaction.perform_action('Reaction', 'Allergy')
  sleep 1
  p 'Comments'
  comments.perform_action('comments', allergen+' = BAD')

  p 'Button'
  buttons.wait_until_action_element_visible('Add-Allergy', 60)
  p 'Save'
  p driver.find_element(:id, 'add-allergy').enabled?
  buttons.perform_action('Add-Allergy')

  p 'Submitted...waiting for response to close modal'
  wait_for_modal_done
end

def add_simple_allergy(allergen)
  buttons = AllergyButtons.instance
  search = AllergySearch.instance
  reaction = Reaction.instance
  comments = Comments.instance
  driver = TestSupport.driver

  p "Checking for allergen: " + allergen
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url+'#allergy-list')

  buttons.wait_until_action_element_visible('Add', 60)

  allergy_element = wait_for_element('//td[contains(string(), "' + allergen + '")]', 5)
  if allergy_element.size != 0
    p allergen + ' FOUND'
    return
  end

  p allergen + ' not found, adding'
  buttons.perform_action('Add')

  p 'Searching for ' + allergen
  search.wait_until_action_element_visible('allergenSearchInput', 60)
  expect(search.static_dom_element_exists?('allergenSearchInput')).to be_true
  sleep 1
  search.perform_action('allergenSearchInput', allergen)
  search.wait_until_action_element_visible('allergenSearchResults', 60)
  search.perform_action('allergenSearchResults', allergen)

  p 'Filling out minimal data to add allergen'
  buttons.wait_until_action_element_visible('Historical', 60)
  p 'Historical'
  buttons.perform_action('Historical')
  sleep 1
  p 'Reaction'
  reaction.perform_action('Reaction', 'Allergy')
  sleep 1
  p 'Comments'
  comments.perform_action('comments', allergen+' = BAD')

  p 'Button'
  buttons.wait_until_action_element_visible('Add-Allergy', 60)
  p 'Save'
  p driver.find_element(:id, 'add-allergy').enabled?
  buttons.perform_action('Add-Allergy')

  p 'Submitted...waiting for response to close modal'
  wait_for_modal_done
end

def wait_for_element(xpath, timeout = 120)
  driver = TestSupport.driver
  i = 0
  element = false
  while i < timeout
    element = driver.find_elements(:xpath => xpath)
    if element.size == 0
      i += 1
      sleep 1
    else
      i = timeout
    end
  end
  return element
end

def wait_for_modal_done(timeout = 60)
  driver = TestSupport.driver

  i = 0
  while i < timeout
    modal_element = driver.find_element(:id, 'modal-header')
    if modal_element.displayed?
      i += 1
      sleep 1
    else
      return
    end
  end
  fail "Modal did not close"
end
