class VitalsGist <  ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Vitals Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=vitals] .panel-title"))
    add_verify(CucumberLabel.new("Blood pressure Sistolic"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_BPS"))
    add_verify(CucumberLabel.new("Blood pressure Diastolic"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_BPD"))
    add_verify(CucumberLabel.new("Pulse"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_P"))
    add_verify(CucumberLabel.new("Respiration"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_R"))
    add_verify(CucumberLabel.new("Temperature"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_T"))
    add_verify(CucumberLabel.new("Pulse oximetry"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_PO2"))
    add_verify(CucumberLabel.new("Pain"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_PN"))
    add_verify(CucumberLabel.new("Weight"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_name_BMI"))
    add_verify(CucumberLabel.new("Vitals Gist Rows"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals_problem_result_BPS"))
  end
end

Then(/^user sees Vitals Gist$/) do
  vg = VitalsGist.instance
  expect(vg.wait_until_action_element_visible("Vitals Gist Title", 60)).to be_true
  expect(vg.perform_verification("Vitals Gist Title", "VITALS")).to be_true
  expect(vg.wait_until_action_element_visible("Vitals Gist Rows", 60)).to be_true
  expect(vg.perform_verification("Vitals Gist Rows", " ")).to be_true
end

#Verify the first coloumn of the Vitals Coversheet view
Then(/^the Vitals gist contains the data$/) do |table|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  vg = VitalsGist.instance
  expect(vg.wait_until_action_element_visible("Pulse", 60)).to be_true
  top_element = driver.find_element(:id, "vitals_problem_name_BPS")
  bottom_element = driver.find_element(:id, "vitals_problem_name_BMI")
  expect(driver.find_element(:id, "vitals_problem_name_BPS").text).to eq(table.rows[0][0])
  expect(driver.find_element(:id, "vitals_problem_name_BPD").text).to eq(table.rows[1][0])
  expect(driver.find_element(:id, "vitals_problem_name_P").text).to eq(table.rows[2][0])
  expect(driver.find_element(:id, "vitals_problem_name_R").text).to eq(table.rows[3][0])
  expect(driver.find_element(:id, "vitals_problem_name_T").text).to eq(table.rows[4][0])
  #expect(driver.find_element(:id, "vitals_problem_name_PO2").text == table.rows[5][0]).to be_true
  driver.execute_script("arguments[0].scrollIntoView(false)", bottom_element)
  expect(driver.find_element(:id, "vitals_problem_name_PN").text).to eq(table.rows[6][0])
  expect(driver.find_element(:id, "vitals_problem_name_WT").text).to eq(table.rows[7][0])
  expect(driver.find_element(:id, "vitals_problem_name_HT").text).to eq(table.rows[8][0])
  expect(driver.find_element(:id, "vitals_problem_name_BMI").text).to eq(table.rows[9][0])

  driver.execute_script("arguments[0].scrollIntoView(true)", top_element)
  expect(driver.find_element(:id, "vitals_problem_result_BPS").text).to eq(table.rows[0][1])
  expect(driver.find_element(:id, "vitals_problem_result_BPD").text).to eq(table.rows[1][1])
  expect(driver.find_element(:id, "vitals_problem_result_P").text).to eq(table.rows[2][1])
  expect(driver.find_element(:id, "vitals_problem_result_R").text).to eq(table.rows[3][1])
  expect(driver.find_element(:id, "vitals_problem_result_T").text).to eq(table.rows[4][1])
  #expect(driver.find_element(:id, "vitals_problem_result_PO2").text == table.rows[5][1]).to be_true
  driver.execute_script("arguments[0].scrollIntoView(false)", bottom_element)
  expect(driver.find_element(:id, "vitals_problem_result_PN").text).to eq(table.rows[6][1])
  expect(driver.find_element(:id, "vitals_problem_result_WT").text).to eq(table.rows[7][1])
  expect(driver.find_element(:id, "vitals_problem_result_HT").text).to eq(table.rows[8][1])
  expect(driver.find_element(:id, "vitals_problem_result_BMI").text).to eq(table.rows[9][1])
end #Vitals Coversheet rows
