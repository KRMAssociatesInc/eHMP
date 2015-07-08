
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "PatientPickerDomElements.rb"

Given(/^patient has a "(.*?)" posting$/) do |expected_posting|
  posting = expected_posting + "posting"
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.wait_until_element_present(posting, 10)
  expect(patient_details.static_dom_element_exists?(posting)).to be_true
end

Then(/^user views the posting details$/) do
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.perform_action("Postings")
end

Then(/^the user closes the posting panel$/) do
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.perform_action("Close Button")
end

Then(/^the posting panel displays allergy "(.*?)" with details$/) do |allergy_name, table|
  driver = TestSupport.driver
  header_xpath = "//h3[contains(string(), '#{allergy_name}')]"
  header_id = driver.find_element(:xpath=> header_xpath).attribute("id")

  errors = Array.new
  error_thrown = false

  table.rows.each do | row |
    row.each do |column |
      table_column_xpath = "//h3[@id='#{header_id}']/following-sibling::table[1]/descendant::td[contains(string(), '#{column}')]"
      begin
        driver.find_element(:xpath=>table_column_xpath)
      rescue
        # TODO: Farid wrote a error generator to handle this kind of case, figure out how to use it
        error_thrown = true
        errors.push "did not find #{column} under header #{allergy_name}"
      end
    end
  end

  p errors if error_thrown
  expect(error_thrown).to be_false

end
