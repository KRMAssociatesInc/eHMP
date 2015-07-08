class LabResultsGist <  ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Lab Results Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=lab_results_grid] .panel-title"))
    add_verify(CucumberLabel.new("Lab Results Ten Check"), VerifyContainsText.new, AccessHtmlElement.new(:id, "labs_problem_name_Leukocytes__Blood_Quantitative"))
    add_verify(CucumberLabel.new("Lab Results Five Check"), VerifyContainsText.new, AccessHtmlElement.new(:id, "labs_problem_name_TRIGLYCERIDE"))
  end
end

Then(/^user sees Lab Results Gist$/) do
  vg = LabResultsGist.instance
  expect(vg.wait_until_action_element_visible("Lab Results Gist Title", 60)).to be_true
  expect(vg.perform_verification("Lab Results Gist Title", "LAB RESULTS")).to be_true
end

#Verify the first coloumn of the Lab Results Coversheet
Then(/^the first coloumn of the Lab Results gist contains the rows for patient "(.*?)"$/) do |patient, table|
  driver = TestSupport.driver

  TestSupport.wait_for_page_loaded

  vg = LabResultsGist.instance
  matched_patient = true

  p patient
  case patient
  # if (patient == "Ten,Patient")
  when "Ten,Patient"
    expect(vg.wait_until_action_element_visible("Lab Results Ten Check", 60)).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Leukocytes__Blood_Quantitative").text == table.rows[0][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Granulocytes_100_Leukocytes__Blood_Quantitative_Automated_Count").text == table.rows[1][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Platelet_Mean_Volume__Blood_Quantitative_Automated").text == table.rows[2][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Basophils_100_Leukocytes__Blood_Quantitative_Automated_Count").text == table.rows[3][0]).to be_true

    driver.execute_script("arguments[0].scrollIntoView(false)", driver.find_element(:id, "labs_problem_name_Monocytes_100_Leukocytes__Blood_Quantitative_Automated_Count"))
    expect(driver.find_element(:id, "labs_problem_name_Eosinophils_100_Leukocytes__Blood_Quantitative_Automated_Count").text == table.rows[4][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Hemoglobin__Blood_Quantitative").text == table.rows[5][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Lymphocytes_100_Leukocytes__Blood_Quantitative_Automated_Count").text == table.rows[6][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Monocytes_100_Leukocytes__Blood_Quantitative_Automated_Count").text == table.rows[7][0]).to be_true

    driver.execute_script("arguments[0].scrollIntoView(false)", driver.find_element(:id, "labs_problem_name_Mean_Corpuscular_Volume__RBC_Quantitative_Automated_Count"))
    expect(driver.find_element(:id, "labs_problem_name_Platelets__Blood_Quantitative_Automated_Count").text == table.rows[8][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Erythrocyte_Mean_Corpuscular_Hemoglobin__RBC_Quantitative_Automated_Count").text == table.rows[9][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Erythrocyte_Mean_Corpuscular_Hemoglobin_Concentration__RBC_Quantitative_Automated_Count").text == table.rows[10][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Mean_Corpuscular_Volume__RBC_Quantitative_Automated_Count").text == table.rows[11][0]).to be_true

    driver.execute_script("arguments[0].scrollIntoView(false)", driver.find_element(:id, "labs_problem_name_Hematocrit__Blood_Quantitative_Automated_Count"))
    expect(driver.find_element(:id, "labs_problem_name_Erythrocyte_Distribution_Width_CV__RBC_Quantitative_Automated_Count").text == table.rows[12][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Erythrocytes__Blood_Quantitative_Automated_Count").text == table.rows[13][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_Hematocrit__Blood_Quantitative_Automated_Count").text == table.rows[14][0]).to be_true
# elsif (patient == "Five,Patient")

  when "Five,Patient"
    expect(vg.wait_until_action_element_visible("Lab Results Five Check", 60)).to be_true
    bottom_element = driver.find_element(:id, "labs_problem_name_POTASSIUM")
    expect(driver.find_element(:id, "labs_problem_name_HDL").text == table.rows[0][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_TRIGLYCERIDE").text == table.rows[1][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_LDL_CHOLESTEROL").text == table.rows[2][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_CHOLESTEROL").text == table.rows[3][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_CREATININE").text == table.rows[4][0]).to be_true
    driver.execute_script("arguments[0].scrollIntoView(false)", bottom_element)
    expect(driver.find_element(:id, "labs_problem_name_UREA_NITROGEN").text == table.rows[5][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_HEMOGLOBIN_A1C").text == table.rows[6][0]).to be_true
    expect(driver.find_element(:id, "labs_problem_name_POTASSIUM").text == table.rows[7][0]).to be_true
  else
    p "Use only Five,Patient or Ten,Patients"
    matched_patient = false
  end

  expect(matched_patient).to be_true
end#Lab Results Coversheet rows
