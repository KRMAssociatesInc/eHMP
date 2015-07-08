Then(/^the InfoButtton is present on "(.*?)" page$/) do |panel|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  wait.until { driver.find_element(:id, "urn-va-problem-9E7A-231-180") }
  wait.until { driver.find_element(:id, "urn-va-immunization-ABCD-229-44") }
  infbttns = driver.find_elements(:xpath, "//*/tr[@data-infobutton]")
  # p times
  # p infbttns.length.to_s
  expect(infbttns.length.to_s != 0).to be_true
end

Then(/^the InfoButtton page is opened by clicking on the infobutton icon$/) do
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  wait.until { driver.find_element(:id, "urn-va-problem-9E7A-231-180") }
  driver.find_element(:id, "urn-va-problem-9E7A-231-180").click

  pagehelp = driver.find_element(:id, "info-button")
  pagehelp.click

  driver.switch_to.window(driver.window_handles.last) {
    # begin
    wait = Selenium::WebDriver::Wait.new(:timeout => 120)
    wait.until {
      expect(driver.title == "CPRS OpenInfobutton").to be_true
    }
    # rescue Exception => e
    #   p "Error: #{e}"
    # end
  }
end
