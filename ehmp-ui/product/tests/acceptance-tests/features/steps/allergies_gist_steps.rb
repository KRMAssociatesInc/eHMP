class AllergiesGist <  ADKContainer
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("Allergies Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=allergy_grid] .panel-title"))
    add_verify(CucumberLabel.new("AllergiesGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-pill-gist-items"))
    add_verify(CucumberLabel.new("Allergy Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'allergy_grid-pill-gist-items'))
    add_action(CucumberLabel.new("Control - Applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=allergy_grid] .applet-maximize-button"))
    add_verify(CucumberLabel.new("Allergies Gist Applet Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=allergy_grid] .panel-title"))
    add_action(CucumberLabel.new("Control - Applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=allergy_grid] #grid-filter-button-allergy_grid"))
    add_action(CucumberLabel.new("Control - Applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=allergy_grid] .form-search input"))
    add_verify(CucumberLabel.new("Allergies Gist Applet Filter Result"), VerifyContainsText.new, AccessHtmlElement.new(:id, "pill-gist-popover-urn:va:allergy:ABCD:16:106"))
  end
end 

Before do
  @ag = AllergiesGist.instance
end

Then(/^user sees Allergies Gist$/) do
  expect(@ag.wait_until_action_element_visible("Allergies Gist Title", DefaultLogin.wait_time)).to be_true
  expect(@ag.perform_verification("Allergies Gist Title", "ALLERGIES")).to be_true
end

Then(/^the Allergies Gist view contains$/) do |table|  
  expect(@ag.wait_until_action_element_visible("AllergiesGridVisible", DefaultLogin.wait_time)).to be_true    
  table.rows.each do |row|
    expect(@ag.perform_verification('Allergy Details', row[0])).to be_true, "The value #{row[0]} is not present in the allergy details"
  end
end

Then(/^the Allergies Applet title is "(.*?)"$/) do |title|
  expect(@ag.wait_until_action_element_visible("Allergies Gist Applet Title", DefaultLogin.wait_time)).to be_true
  expect(@ag.perform_verification("Allergies Gist Applet Title", title)).to be_true
end

When(/^Allegies Gist Applet contains only "(.*?)"$/) do |allergy_type|
  expect(@ag.wait_until_action_element_visible("AllergiesGridVisible", DefaultLogin.wait_time)).to be_true
  expect(@ag.perform_verification("Allergies Gist Applet Filter Result", allergy_type)).to be_true
end
