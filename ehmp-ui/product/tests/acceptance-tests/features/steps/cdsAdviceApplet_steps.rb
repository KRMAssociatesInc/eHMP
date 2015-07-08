#Team Europa
#F166_UserInvokedCDS.feature

class CdsAdvice < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Priority"), VerifyContainsText.new, AccessHtmlElement.new(:id, "cds_advice-undefined"))
    add_verify(CucumberLabel.new("Title"), VerifyText.new, AccessHtmlElement.new(:id, "cds_advice-title"))
    add_verify(CucumberLabel.new("Details"), VerifyText.new, AccessHtmlElement.new(:id, "cds_advice-details"))
    add_verify(CucumberLabel.new("Type"), VerifyText.new, AccessHtmlElement.new(:id, "cds_advice-typeText"))
  end
end

#Validate columns in the Applet expanded view
Then(/^the CDS Advice expanded columns are$/) do |table|
  cols = CdsAdvice.instance
  driver = TestSupport.driver
  cols.wait_until_element_present("Priority", 10)
  elements = driver.find_elements(:xpath, "//*[@id='data-grid-cds_advice']/thead/tr/th")
  expect(elements.length).to_not eq(0)
  expect(elements.length).to eq(table.rows.length)
  table.rows.each do |column_name|
    header = cols.static_dom_element_exists?(column_name[0])
    p "#{column_name[0]} was not found" unless header
    expect(header).to be_true
  end
end

