require 'HtmlGenerator.rb'

class MainPageHMPAttributeParameters
  def main_page
    HtmlGenerator.add_verify("PhysicianName", "id", "userbutton-1368-btnInnerEl", "text")

    HtmlGenerator.add_action_and_verify("CPRS Default", "xpath", "//span[contains(string(), 'CPRS Default')]", 'Click', "attribute")
    HtmlGenerator.add_action_and_verify("Clinics", 'xpath', "//span[contains(string(), 'Clinics')]/ancestor::a", 'Click')
    HtmlGenerator.add_action_and_verify("Wards", 'xpath', "//span[contains(string(), 'Wards')]/ancestor::a", 'Click')
    HtmlGenerator.add_action_and_verify("All", 'xpath', "//div[contains(@id, 'patientpicker')]/descendant::span[contains(string(), 'All')]/ancestor::a", 'Click')

    HtmlGenerator.add_action_and_verify("Search Field", 'xpath', "//input[contains(@id, 'searchfield')]", 'SendKeys')
    HtmlGenerator.add_verify("Patient List", 'xpath', "//h5[contains(@class, 'media-heading')]", 'findElementsWhenDisplayed?')
    HtmlGenerator.add_action_and_verify("Confirm Change the Selected Button", 'xpath', "//a/descendant::span[contains(string(), 'Confirm')]", 'Click')

    HtmlGenerator.add_action_and_verify("Search Bar", 'xpath', "//input[contains(@id, 'searchbar-1327')]", 'SendKeysAndEnter')

    HtmlGenerator.add_action_and_verify("Close", 'xpath', "//span[contains(string(), 'Close')]", 'Click')

    HtmlGenerator.add_action_and_verify("New Task", 'xpath', "//span/span[contains(string(), 'New Task')]/span", 'Click')
    HtmlGenerator.add_action_and_verify("Task", 'xpath', "//label[contains(string(), 'Task')]//ancestor::td/following-sibling::td/input", 'sendKeys', 'value')
    HtmlGenerator.add_action_and_verify("Due", 'xpath', "//label[contains(string(), 'Due')]//ancestor::td/following-sibling::td/table/tbody/tr/td/input", 'sendKeys', 'value')

    HtmlGenerator.add_action("Type", "xpath", "//label[contains(string(), 'Type')]//ancestor::td/following-sibling::td/table/tbody/tr/td[2]/div", "comboSelect")
    HtmlGenerator.add_verify("Type", "xpath", "//label[contains(string(), 'Type')]//ancestor::td/following-sibling::td/descendant::input", 'value')

    HtmlGenerator.add_action_and_verify("Description", 'xpath', "html/body", 'type', 'text')
    HtmlGenerator.add_action_and_verify("Claim Task", 'xpath', "//label[contains(string(), 'Claim Task')]//ancestor::td/following-sibling::td/div/input", 'click')
    HtmlGenerator.add_action_and_verify("Done", 'xpath', "//label[contains(string(), 'Done')]//ancestor::td/following-sibling::td/div/input", 'click')
    HtmlGenerator.add_action_and_verify("Cancel", 'xpath', "//span[contains(string(), 'Cancel')]/span", 'click')
    HtmlGenerator.add_action_and_verify("Save", 'xpath', "//span[contains(string(), 'Save')]/span", 'click')

    HtmlGenerator.add_action_and_verify("Outpatient Meds", 'xpath', "//div[contains(string(), 'Outpatient Meds')]/ancestor::td/div", 'click')
    HtmlGenerator.add_action_and_verify("Inpatient Meds", 'xpath', "//div[contains(string(), 'Inpatient Meds')]/ancestor::td/div", 'click')
    HtmlGenerator.add_verify("Outpatient Meds Table", 'xpath', "//div[contains(string(), 'Outpatient Meds')]/ancestor::td/div/ancestor::tbody/tr", 'text')
    HtmlGenerator.add_verify("Inpatient Meds Table", 'xpath', "//div[contains(string(), 'Inpatient Meds')]/ancestor::td/div/ancestor::tbody/tr", 'text')

    HtmlGenerator.add_verify("Lab Results Table", 'xpath', "//tbody[contains(string(), 'Laboratory')]/tr", 'text')
    HtmlGenerator.add_verify("Visit Results Table", 'xpath', "//tbody[contains(string(), 'Visit')]/tr", 'text')
    HtmlGenerator.add_verify("Laboratory Report Results Table", 'xpath', "//tbody[contains(string(), 'Laboratory Report')]/tr", 'text')
    HtmlGenerator.add_verify("Progress Note Results Table", 'xpath', "//tbody[contains(string(), 'Progress Note')]/tr", 'text')
  end

  def main_page_locator_with_arg(locator_arg1, locator_arg2)
    HtmlGenerator.add_action_and_verify("Patient Name", 'xpath', "//h5[contains(string(), '#{locator_arg1}')]", 'click', 'findelEments')

    HtmlGenerator.add_action_and_verify("Patient Name Selected", 'xpath', "//h4[contains(string(), '#{locator_arg1}')]", 'click', 'findelEments')
    HtmlGenerator.add_action_and_verify("Patient Details", 'xpath', "//h4[contains(string(), '#{locator_arg1}')]/following-sibling::table[contains(string(), '#{locator_arg2}')]", 'elementVisible?')
    HtmlGenerator.add_action_and_verify("SSN", 'xpath', "//h4[contains(string(), '#{locator_arg1}')]/following-sibling::table/tbody/tr/td[1]", 'text')
    HtmlGenerator.add_action_and_verify("DOB", 'xpath', "//h4[contains(string(), '#{locator_arg1}')]/following-sibling::table/tbody/tr/td[2]", 'text')
    HtmlGenerator.add_action_and_verify("Age", 'xpath', "//h4[contains(string(), '#{locator_arg1}')]/following-sibling::table/tbody/tr/td[2]/span[1]", 'text')
    HtmlGenerator.add_action_and_verify("Gender", 'xpath', "//h4[contains(string(), '#{locator_arg1}')]/following-sibling::table/tbody/tr/td[2]/span[2]", 'text')
    HtmlGenerator.add_action_and_verify("Search Optien Drop List", 'xpath', "//td/div[contains(string(), '#{locator_arg1}')]", 'click')
    HtmlGenerator.add_action_and_verify("More Search MedsReiew Tasks", 'xpath', "//span[contains(string(), '#{locator_arg1}')]", 'Click')

    HtmlGenerator.add_action_and_verify("Directives Allergies", 'xpath', "//span[contains(string(), '#{locator_arg1}')]", 'click')
    HtmlGenerator.add_action_and_verify("Directives Allergies Results", 'xpath', "//li[contains(string(), '#{locator_arg1}')]/following-sibling::*", 'text')
    HtmlGenerator.add_action_and_verify("Filters", 'xpath', "//span[contains(string(), '#{locator_arg1}')]", 'click')
    HtmlGenerator.add_action_and_verify("Date Range", 'xpath', "//span[contains(string(), '#{locator_arg1}')]", 'click')
    HtmlGenerator.add_action_and_verify("Group/Sort", 'xpath', "//span[contains(string(), '#{locator_arg1}')]", 'click')

    HtmlGenerator.add_action_and_verify("Search bar drop list", 'xpath', "//div[contains(string(), '#{locator_arg1}') and contains(string(), '#{locator_arg1}')]/span", 'click')
    HtmlGenerator.add_action_and_verify("Search Results drop list", 'xpath', "//tr/td/div[contains(string(), '#{locator_arg1}')]", 'click')
  end
end
