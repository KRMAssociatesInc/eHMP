#Team Europa
#F277_CDSRulesResultsList.feature

class RulesResults < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Priority"), VerifyContainsText.new, AccessHtmlElement.new(:id, "rules_results-priority"))
    add_verify(CucumberLabel.new("Title"), VerifyText.new, AccessHtmlElement.new(:id, "rules_results-title"))
    add_verify(CucumberLabel.new("Due Date"), VerifyText.new, AccessHtmlElement.new(:id, "rules_results-dueDateFormatted"))
    add_verify(CucumberLabel.new("Done Date"), VerifyText.new, AccessHtmlElement.new(:id, "rules_results-doneDateFormatted"))
  end
end

#Validate columns in the Applet expanded view
Then(/^the Rules Results expanded columns are$/) do |table|
  cols = RulesResults.instance
  driver = TestSupport.driver
  cols.wait_until_element_present("Priority", 10)
  elements = driver.find_elements(:xpath, "//*[@id='data-grid-rules_results']/thead/tr/th")
  expect(elements.length).to_not eq(0)
  expect(elements.length).to eq(table.rows.length)
  table.rows.each do |column_name|
    header = cols.static_dom_element_exists?(column_name[0])
    p "#{column_name[0]} was not found" unless header
    expect(header).to be_true
  end
end
