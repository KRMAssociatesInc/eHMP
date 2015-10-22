class CwadCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("cwad details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'cwad-details'))       
  end
end 

Then(/^the cwad details view contains$/) do |table|
  cwad =CwadCoverSheet.instance
  table.rows.each do |label, value|
    expect(cwad.perform_verification('cwad details', label)).to be_true, "The label #{label} is not present in the cwad details"
    expect(cwad.perform_verification('cwad details', value)).to be_true, "The value #{value} is not present in the cwad details"
  end
end

When(/^the user opens the "(.*?)" details view$/) do |arg1|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  data_original_title = arg1
  begin
    css_string = "#patientDemographic-cwad span[data-original-title='#{data_original_title}'] span"
    posting_element = driver.find_element(:css, css_string)
    #expect(posting_element.attribute('class').include? 'label-danger').to be_true, "#{data_original_title} does not have 'label-danger'"
    posting_element.click 
    wait.until { 
      cwad_details = driver.find_element(:id, 'cwad-details')
      cwad_details_class = cwad_details.attribute('class')
      (cwad_details_class.include? 'hidden') == false 
    }
    expected_title = "#{data_original_title}".downcase
    wait.until {
      title_element = driver.find_element(:css, 'div.cwadContainer-title h5')
      cwad_title = title_element.attribute("innerHTML") 
      cwad_title.eql? expected_title
    }
  rescue Exception => e 
    p "error: #{e}"
    raise
  end
end

Then(/^the following postings are active$/) do |table|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  table.rows.each do |data_original_title|
    begin
      css_string = "#patientDemographic-cwad span[data-original-title='#{data_original_title[0]}'] span"
      posting_element = driver.find_element(:css, css_string)
      expect(posting_element.attribute('class').include? 'label-danger').to be_true, "#{data_original_title} does not have 'label-danger'"
    rescue Exception => e 
      p "error: #{e}"
      raise
    end
  end
end

Then(/^the following postings are active and open the details view$/) do |table|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  table.rows.each do |column|
    data_original_title = column[0]
    begin
      css_string = "#patientDemographic-cwad span[data-original-title='#{data_original_title}'] span"
      posting_element = driver.find_element(:css, css_string)
      expect(posting_element.attribute('class').include? 'label-danger').to be_true, "#{data_original_title} does not have 'label-danger'"
      posting_element.click 
      wait.until { 
        cwad_details = driver.find_element(:id, 'cwad-details')
        cwad_details_class = cwad_details.attribute('class')
        (cwad_details_class.include? 'hidden') == false 
      }
      expected_title = "#{data_original_title}".downcase
      wait.until {
        title_element = driver.find_element(:css, 'div.cwadContainer-title h5')
        cwad_title = title_element.attribute("innerHTML") 
        cwad_title.eql? expected_title
      }
    rescue Exception => e 
      p "error: #{e}"
      raise
    end
  end
end

Then(/^the following postings are inactive$/) do |table|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  table.rows.each do |data_original_title|
    begin
      css_string = "#patientDemographic-cwad span[data-original-title='#{data_original_title[0]}'] span"
      posting_element = driver.find_element(:css, css_string)
      expect(posting_element.attribute('class').include? 'label-danger').to be_false, "#{data_original_title} has 'label-danger' when it should not"
    rescue Exception => e 
      p "error: #{e}"
      raise
    end
  end
end

