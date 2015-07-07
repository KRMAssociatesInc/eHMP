class ProblemSearch < AccessBrowserV2
  include Singleton
  def initialize
    super

    # In Support of Background
    add_action(CucumberLabel.new("ClickVisitInfoBoxAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='setVisitContextBtn']"))
    add_verify(CucumberLabel.new("CurrentLocationVerify"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='mainModalLabel']"))
    add_action(CucumberLabel.new("SetEncounterLocationAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:appointment:9E7A:301:A;2970415.1026;23']"))
    add_verify(CucumberLabel.new("VisitInfoVerify"), VerifyContainsText.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))

    # In Support of Scenario: Problem Search with an invalid search term ...
    add_action(CucumberLabel.new("AddVisitAction"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='problems'] button.applet-add-button"))
    add_action(CucumberLabel.new("EnterInitialValueAction"), SendKeysAction.new, AccessHtmlElement.new(:id, "problem"))
    add_verify(CucumberLabel.new("NoResultVerify"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problemsNoResults"))
    add_action(CucumberLabel.new("EnterNextValueAction"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:id, "problem"))
    add_action(CucumberLabel.new("CorrectResultsDisplayAction1"), ClickAction.new, AccessHtmlElement.new(:css, "#problem-typeahead-list li[data-name='Allergic headache']"))
    add_action(CucumberLabel.new("CorrectResultsDisplayAction2"), ClickAction.new, AccessHtmlElement.new(:css, "#problem-typeahead-list li[data-name='Chronic systolic heart failure']"))
    add_action(CucumberLabel.new("CorrectResultsDisplayAction3"), ClickAction.new, AccessHtmlElement.new(:css, "#problem-typeahead-list li[data-name='Transient hypertension of pregnancy']"))
    add_verify(CucumberLabel.new("ResultVerify"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='c19107']"))

    # In Support of Search result list extends when Extend Search box ...
    add_action(CucumberLabel.new("ExtendSearchSelectAction"), ClickAction.new, AccessHtmlElement.new(:css, "#uncoded"))

    # In Support of Any term can be used to define a problem
    add_verify(CucumberLabel.new("ProblemSearchVerify"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id=problem-typeahead-list']/li[4]"))
    add_action(CucumberLabel.new("ProblemSelectAction"), ClickAction.new, AccessHtmlElement.new(:css, "#c115206"))
    add_action(CucumberLabel.new("BackButtonAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='addProblemBackBtn']"))
    add_action(CucumberLabel.new("UseEnteredTermButtonAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='addProblemSubmitBtn']"))

    # In Support of Remove a problem
    add_action(CucumberLabel.new("ProblemSelectAction1"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-problem-9E7A-301-436"))
    add_action(CucumberLabel.new("ProblemRemoveAction"), ClickAction.new, AccessHtmlElement.new(:css, "#deleteBtn"))

    # In Support of Replace the test problem
    add_action(CucumberLabel.new("CommentsAction"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "newCommentText"))
    add_action(CucumberLabel.new("AddCommentAction"), ClickAction.new, AccessHtmlElement.new(:id, "addCommentBtn"))
  end
end

#
# IN SUPPORT OF Background
#
Given(/^problem user clicks on Visit Information box in header$/) do
  con = ProblemSearch.instance
  con.perform_action("ClickVisitInfoBoxAction")
end

And(/^the modal title "(.*?)" appears$/) do |arg1|
  con = ProblemSearch.instance
  con.perform_verification("CurrentLocationVerify", arg1)
end

And(/^the user selects "(?:.*?)" for encounter$/) do 
  con = ProblemSearch.instance
  con.perform_action("SetEncounterLocationAction")
end

And(/^Visit Information in header reflects the selected visit$/) do
  visit = "General Medicine"
  con = ProblemSearch.instance
  con.perform_verification("VisitInfoVerify", visit)
end

#
# IN SUPPORT OF Scenario: Problem Search with an invalid search term ...
#
When(/^the user selects the Add Item button$/) do
  con = ProblemSearch.instance
  con.perform_action("AddVisitAction")
end

Then(/^the user searches for the (?:SNOMED code|text term) "(.+)"$/) do |code|
  con = ProblemSearch.instance
  con.perform_action("EnterInitialValueAction", code)
end

Then(/^"No results" message should appear$/) do
  result = "No result"
  con = ProblemSearch.instance
  con.perform_verification("NoResultVerify", result)
end

Then(/^the user replaces (?:SNOMED code|search term) with "(.+)"$/) do |code|
  con = ProblemSearch.instance
  con.perform_action("EnterNextValueAction", code)
end

Then(/^correct (.*?) results should display$/) do |problem|
  con = ProblemSearch.instance
  if problem == "headache"
    con.wait_until_action_element_visible("CorrectResultsDisplayAction1", 30)
  elsif problem == "SNOMED"
    con.wait_until_action_element_visible("CorrectResultsDisplayAction2", 30)
  else
    fail!(ArgumentError.new('UNKNOWN PROBLEM TYPE', "UNKNOWN PROBLEM TYPE"))
  end
end

And(/^the results list shows the term "(.*?)"$/) do
  con = ProblemSearch.instance
  con.perform_verification("ResultVerify", arg1)
end

#
# IN SUPPORT OF Scenario:  Search result list extends when Extend Search box ...
#

And(/^the results list shows total number of items( has increased)?$/) do |arg|
  con = ProblemSearch.instance
  con.wait_until_action_element_visible("CorrectResultsDisplayAction3", 30)
  driver = TestSupport.driver
  element = nil
  elements = driver.find_elements(:css, "#problem-typeahead-list li")
  if arg 
    @after = elements.size
    if @after <= @before
      fail!(ArgumentError.new('EXTENDED SEARCH TEST FAILED', "EXTENDED SEARCH TEST FAILED"))
    else
      print "SUCCESS: more items seen!\n"
    end
  else
    @before = elements.size
  end
end

And(/^the user checks the box "Extend Search"$/) do
  con = ProblemSearch.instance
  con.perform_action("ExtendSearchSelectAction")
end

#
# IN SUPPORT OF Scenario: Any term can be used to define a problem
#
When(/^the Add Active Problem results list shows the term "(.*?)"$/) do |arg1|
  con = ProblemSearch.instance
  con.perform_verification("ProblemSearchVerify", arg1)
end

When(/^the user selects hyperlipidemia$/) do 
  con = ProblemSearch.instance
  con.perform_action("ProblemSelectAction")
end

When(/^the user clicks the Back button$/) do
  con = ProblemSearch.instance
  con.perform_action("BackButtonAction")
end

When(/^the user clicks the Use Entered Term button$/) do 
  con = ProblemSearch.instance
  con.perform_action("UseEnteredTermButtonAction")
end

#
# IN SUPPORT OF Scenario:  Remove a problem
#

When(/^user clicks on "(.*?)" in the Active Problem applet$/) do |problem|
  con = ProblemSearch.instance
  if problem.match("Chronic Systolic Heart failure")
    con.perform_action("ProblemSelectAction1")
  else
    fail!(ArgumentError.new('UNKNOWN PROBLEM SELECTED'), "UNKNOWN PROBLEM SELECTED")
  end
end

And(/^the Orion user clicks button "(.*?)"$/) do |action|
  con = ProblemSearch.instance
  if action.match("Remove")
    con.perform_action("ProblemRemoveAction")
  else
    fail!(ArgumentError.new('UNKNOWN BUTTON SELECTED', "UNKNOWN BUTTON SELECTED"))
  end
end

When(/^user enters the comment "(.*?)"$/) do |arg1|
  con = ProblemSearch.instance
  con.perform_action("Comments", arg1)
end

