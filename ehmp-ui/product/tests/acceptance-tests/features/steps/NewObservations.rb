class Wireframe < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("observation"), ClickAction.new, AccessHtmlElement.new(:id, "new-observation"))
    add_verify(CucumberLabel.new("sidebar"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@class='sidebar-nav']/following-sibling::span"))
    add_action(CucumberLabel.new("addActiveProblem"), ClickAction.new, AccessHtmlElement.new(:id, "addActiveProblem"))
    add_action(CucumberLabel.new("addAllergy"), ClickAction.new, AccessHtmlElement.new(:id, "addAllergy"))
    add_action(CucumberLabel.new("addVitals"), ClickAction.new, AccessHtmlElement.new(:id, "addVitals"))
    add_action(CucumberLabel.new("visitCancelBtn"), ClickAction.new, AccessHtmlElement.new(:id, "visitCancelBtn"))
    add_action(CucumberLabel.new("modalCloseBtn"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
  end
end     

Then(/^the user clicks the new observation$/) do
  wireframe = Wireframe.instance
  wireframe.wait_until_action_element_visible("observation", 60)
  expect(wireframe.static_dom_element_exists?("observation")).to be_true
  expect(wireframe.perform_action("observation")).to be_true
end

Then(/^the user click the new Active Problem$/) do
  wireframe = Wireframe.instance
  driver = TestSupport.driver
  wireframe.wait_until_action_element_visible("addActiveProblem", 60)
  expect(wireframe.static_dom_element_exists?("addActiveProblem")).to be_true
  expect(wireframe.perform_action("addActiveProblem")).to be_true
end

Then(/^the user click on Cancel$/) do
  wireframe = Wireframe.instance
  expect(wait_until_present_and_perform_action(wireframe, "visitCancelBtn")).to be_true
end

Then(/^the user click on Close$/) do
  wireframe = Wireframe.instance
  expect(wait_until_present_and_perform_action(wireframe, "modalCloseBtn")).to be_true
end

Then(/^the user click the Allergy$/) do
  wireframe = Wireframe.instance
  driver = TestSupport.driver
  wireframe.wait_until_action_element_visible("addAllergy", 60)
  expect(wireframe.static_dom_element_exists?("addAllergy")).to be_true
  expect(wireframe.perform_action("addAllergy")).to be_true
end

Then(/^the user click the Vitals$/) do
  wireframe = Wireframe.instance
  driver = TestSupport.driver
  wireframe.wait_until_action_element_visible("addVitals", 60)
  expect(wireframe.static_dom_element_exists?("addVitals")).to be_true
  expect(wireframe.perform_action("addVitals")).to be_true
end


