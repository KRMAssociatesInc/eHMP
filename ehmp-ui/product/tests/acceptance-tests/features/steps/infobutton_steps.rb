Then(/^the InfoButtton is present on "(.*?)" page$/) do |_panel|
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

Then(/^the InfoButtton is present on "(.*?)" applet "(.*?)" view$/) do |applet, view|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  if applet == "Conditions"
    driver.find_element(:xpath, "//div[@data-appletid='problems']//button[@data-original-title='Maximize Applet']").click
    wait.until { driver.find_element(:id, "urn-va-problem-9E7A-100848-886") }
    driver.find_element(:id, "urn-va-problem-9E7A-100848-886").click
    expect(driver.find_element(:id, "info-button")).to be_present
  end

  if applet == "Vitals"
    if view == "trend"
      wait.until { driver.find_element(:id, "vitals_problem_name_BPS") }
      driver.find_element(:id, "vitals_problem_name_BPS").click
      expect(driver.find_element(:id, "info-button")).to be_true
    end
    if view == "summary"
      wait.until { driver.find_element(:xpath, "//div[@class='grid-container']//tr[@data-infobutton='BP']") }
      driver.find_element(:xpath, "//div[@class='grid-container']//tr[@data-infobutton='BP']").click
      expect(driver.find_element(:id, "info-button")).to be_true
    end
    if view == "extended"
      wait.until { driver.find_element(:xpath, "//div[@data-appletid='vitals']//button[@tooltip-data-key='Maximize Applet']") }
      driver.find_element(:xpath, "//div[@data-appletid='vitals']//button[@tooltip-data-key='Maximize Applet']").click
      wait.until { driver.find_element(:id, "urn-va-vital-C877-231-28408") }
      driver.find_element(:id, "urn-va-vital-C877-231-28408").click
      expect(driver.find_element(:id, "info-button")).to be_true
    end
  end
end
