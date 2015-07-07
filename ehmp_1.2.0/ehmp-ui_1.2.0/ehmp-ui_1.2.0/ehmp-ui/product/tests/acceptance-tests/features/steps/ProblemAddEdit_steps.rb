# Leave this constant alone.  It switches Debug Messages on and off
DEBUG=false

class ProblemAdd < AccessBrowserV2
  include Singleton
  def initialize
    super

    #
    # Added to support:
    #    @DE438 @US1893 @US2902 @US2931 
    #    Scenario: Adding a new problem
    #
    add_action(CucumberLabel.new("ClickVisitInfoBoxAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='setVisitContextBtn']"))
    add_action(CucumberLabel.new("SetEncounterLocationAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='urn:va:appointment:9E7A:3:A;3000521.09;23']"))
    add_action(CucumberLabel.new("ClickConfirmButtonAction"), ClickAction.new, AccessHtmlElement.new(:css, "#setVisitBtn"))
    add_action(CucumberLabel.new("ClickAddButtonAction"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='center']/div/div/div/div/div[1]/span[2]/span[2]/span/button/span/span"))
    add_action(CucumberLabel.new("EnterProblemAction"), SendKeysAction.new, AccessHtmlElement.new(:css, "#bs-problem"))
    add_verify(CucumberLabel.new("ClickUseTermButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:id, "freeTextBtn"))
    add_action(CucumberLabel.new("ClickUseTermButtonAction"), ClickAction.new, AccessHtmlElement.new(:id, "freeTextBtn"))
    add_verify(CucumberLabel.new("AddProblemModalHeaderVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#mainModalLabel"))
    add_verify(CucumberLabel.new("AddProblemBackButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#addProblemBackBtn"))
    add_verify(CucumberLabel.new("AddProblemAddButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#addProblemSubmitBtn"))
    add_verify(CucumberLabel.new("AddProblemCancelButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#cancelBtn"))
    add_verify(CucumberLabel.new("ProblemStatusActiveButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#active"))
    add_verify(CucumberLabel.new("ProblemStatusInactiveButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#inactive"))
    add_verify(CucumberLabel.new("ProblemAcuityUnknownButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#unknown"))
    add_verify(CucumberLabel.new("ProblemAcuityAcuteButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#acute"))
    add_verify(CucumberLabel.new("ProblemAcuityChronicButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#chronic"))
    add_action(CucumberLabel.new("Date"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "dp-problem"))
    add_action(CucumberLabel.new("Provider"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "respProvider"))
    add_action(CucumberLabel.new("Service"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "serviceLocation"))
    add_action(CucumberLabel.new("ClickAddProblemButtonAction"), ClickAction.new, AccessHtmlElement.new(:css, "#addProblemSubmitBtn"))
    add_verify(CucumberLabel.new("MSTYes"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mstYes"))
    add_verify(CucumberLabel.new("MSTNo"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mstNo"))
    add_verify(CucumberLabel.new("HNYes"), VerifyContainsText.new, AccessHtmlElement.new(:id, "headNeckCancerYes"))
    add_verify(CucumberLabel.new("HNNo"), VerifyContainsText.new, AccessHtmlElement.new(:id, "headNeckCancerNo"))
    add_action(CucumberLabel.new("AddCommentButtonAction"), ClickAction.new, AccessHtmlElement.new(:css, "#addCommentBtn"))
    add_action(CucumberLabel.new("InsertCommentAction"), SendKeysAction.new, AccessHtmlElement.new(:css, "#comment-list > ul > li > input"))
    add_action(CucumberLabel.new("InsertTabAction"), SendKeysAction.new, AccessHtmlElement.new(:css, "#comment-list > ul > li > input"))
    add_action(CucumberLabel.new("InsertReturnAction"), SendKeysAction.new, AccessHtmlElement.new(:css, "#comment-list > ul > li > input"))
    add_verify(CucumberLabel.new("ProblemAddedVerify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#urn-va-problem-9E7A-301-890"))
  end

  def verify(id, value)
    driver = TestSupport.driver
    ctext = driver.find_element(:id, id).attribute('value') # for input tag
    p ctext
    return (ctext == value)
  end
end # END of ProblemAdd Class Def

def debug_message(message)
  print message if DEBUG
end

##########################################################
# Added to support:
#    @DE438 @US1893 @US2902 @US2931 @DE638
#    Scenario: Adding a new problem
#
Given(/^the add-edit user clicks on Visit Information box in header$/) do
  con = ProblemAdd.instance
  con.perform_action("ClickVisitInfoBoxAction")
end

And(/^the add-edit user selects "(?:.*?)" for encounter$/) do
  con = ProblemAdd.instance
  con.perform_action("SetEncounterLocationAction")
end

And(/^add-edit user clicks on "Add_Item"$/) do
  con = ProblemAdd.instance
  con.perform_action("ClickAddButtonAction")
end

And(/^user enters search term "(.*?)"$/) do |problem|
  @problem = problem
  con = ProblemAdd.instance
  con.perform_action("EnterProblemAction", problem)
end

When(/^user clicks "(.*?)" button$/) do |button|
  con = ProblemAdd.instance
  if button.match("Use Entered Term")
    con.perform_action("ClickUseTermButtonAction")
  elsif button.match("Add Active Problem")
    expect(con.perform_action("ClickAddProblemButtonAction")).to be_true, "was not able to click on the Add Problem button"
  else
    fail!(ScriptError, ArgumentError.new('Button Failed to produce desired result!'))
  end
end

And(/^the problem modal header contains the problem$/) do
  header = "Add Problem: " + @problem + " (ICD-9-CM 799.9)" # possible w/ "Use Entered Term"
  debug_message "Checking for the Add Problem header:\n" + header + "\n"
  con = ProblemAdd.instance
  expect(con.perform_verification("AddProblemModalHeaderVerify", header)).to be_true
end

And(/^the problem modal contains three buttons "(.*?)", "(.*?)" and "(.*?)"$/) do |back, cancel, add|
  con = ProblemAdd.instance
  expect(con.perform_verification("AddProblemBackButtonVerify", back)).to be_true
  expect(con.perform_verification("AddProblemCancelButtonVerify", cancel)).to be_true
  expect(con.perform_verification("AddProblemAddButtonVerify", add)).to be_true
end

And(/^modal contains two buttons "(.*?)" and "(.*?)" for problem Status$/) do |active, inactive|
  con = ProblemAdd.instance
  expect(con.perform_verification("ProblemStatusActiveButtonVerify", active)).to be_true
  expect(con.perform_verification("ProblemStatusInactiveButtonVerify", inactive)).to be_true
end

And(/^modal contains three buttons "(.*?)" "(.*?)" and "(.*?)" for problem Acuity$/) do |unknown, acute, chronic|
  con = ProblemAdd.instance
  expect(con.perform_verification("ProblemAcuityUnknownButtonVerify", unknown)).to be_true
  expect(con.perform_verification("ProblemAcuityAcuteButtonVerify", acute)).to be_true
  expect(con.perform_verification("ProblemAcuityChronicButtonVerify", chronic)).to be_true
end

Given(/^user enters today date in Onset Date$/) do
  con = ProblemAdd.instance
  currentdt = Time.now
  dt = currentdt.strftime("%Y-%m-%d")
  debug_message "Date computed for form: #{dt}\n"
  @date = currentdt.strftime("%m/%d/%Y")
  debug_message "Date computed for comparison: #{@date}\n"
  expect(con.perform_action("Date", dt)).to be_true, "problem setting date"
end

Given(/^Resp Provider is populated with current user$/) do
  user = "USER,PANORAMA"
  con = ProblemAdd.instance
  driver = TestSupport.driver
  #value = driver.find_element(:id, "problem-provider").attribute('value')
  value = driver.find_element(:id, "respProvider").attribute('value')
  expect(value).to eq(user)
end

Given(/^Service is populated with current clinic appointment$/) do
  appt = "GENERAL MEDICINE"
  con = ProblemAdd.instance
  driver = TestSupport.driver
  ser = driver.find_element(:id, "serviceLocation").attribute('value')
  expect(ser).to eq(appt)
end

Then(/^each treatment factor has "(.*?)" and "(.*?)" buttons$/) do |yes, no|
  con = ProblemAdd.instance
  driver = TestSupport.driver
  driver.manage.timeouts.implicit_wait = 10

  expect(con.static_dom_element_exists?("MSTYes")).to be_true
  con.wait_until_action_element_visible("MSTYes", 60)
  expect(con.perform_verification("MSTYes", yes)).to be_true

  expect(con.static_dom_element_exists?("MSTNo")).to be_true
  con.wait_until_action_element_visible("MSTNo", 60)
  expect(con.perform_verification("MSTNo", no)).to be_true

  expect(con.static_dom_element_exists?("HNYes")).to be_true
  con.wait_until_action_element_visible("HNYes", 60)
  expect(con.perform_verification("HNYes", yes)).to be_true

  expect(con.static_dom_element_exists?("HNNo")).to be_true
  con.wait_until_action_element_visible("HNNo", 60)
  expect(con.perform_verification("HNNo", no)).to be_true
end

Then(/^user Adds Comment "(.*?)" for a problem$/) do |comment|
  con = ProblemAdd.instance
  driver = TestSupport.driver
  con.perform_action("AddCommentButtonAction")
  con.perform_action("InsertCommentAction", comment)
  checkmark = driver.find_element(:css, ".save-comment")
  driver.action.move_to(checkmark).click.perform

  # verify that the comment is there
  cvalue = driver.find_element(:css, ".commentText").attribute("value")
  debug_message "comment = #{comment}\n"
  debug_message "cvalue = #{cvalue}\n"
  expect(cvalue).to eq(comment)
end

Then(/^the problem is added in the Active Problem list$/) do
  #begin TODO:LG 2/19/2015
  #con = ProblemAdd.instance
  #driver = TestSupport.driver
  #table = driver.find_element(:css, "#data-grid-problems")
  #rows = table.find_elements(:xpath, "//*[@id='urn-va-problem-9E7A-301-885']/td[1]")
  #puts "I am Here"
  #rows = table.find_elements(:xpath, 'tbody/tr')
  
  #for row in rows
  #retcode = true
  # debug_message "ROW: " + row.text + "\n"
  # elements = row.find_elements(:xpath, 'td')
  # elnum = 0
  # for element in elements
  #   elnum = elnum + 1
  #   value = element.text
  #   debug_message "Comparing problem(#{@problem}) to value(#{value})\n"
  #   if elnum == 1
  #     retcode = false
  #     break
  #   elsif elnum == 4
  #     retcode = false
  #     break
  #   elsif elnum == 5
  #     retcode = false
  #     break
  #   end
  # end # end of COLS
  # # If we get to the end of a row and retcode survived, then we break out
  # if retcode
  #   debug_message "End of Row: retcode true: exiting...\n"
  #   break
  # end
  #end # end of ROWS
  #
  #unless retcode
  #fail!(ScriptError, ArgumentError.new(@problem + " not seen in Problem List"))
  #end
  
  #=end

  driver = TestSupport.driver
  number = driver.find_elements(:xpath, "//*[@id='data-grid-problems']/tbody/tr").size
  #puts "+++   number of problems in the list: #{number}  +++"
  arg1 = "headache1234"
  i = 1
  while i < number+1
    h = driver.find_element(:xpath, "//*[@id='data-grid-problems']/tbody/tr[#{i}]/td").text
    if arg1.eql? h
      #puts " +++  the added problem: #{arg1}  was found   +++"
      #expect(con.perform_verification()).to be_true
      driver.find_element(:xpath, "//*[@id='data-grid-problems']/tbody/tr[#{i}]/td").click
      break
    else
      i += 1
    end
  end
end

##########################################################
# Added to support:
#    @US1893_AddProblem_ErrorCheck @chahn
#    Scenario: Error check on Add problem modal
#


