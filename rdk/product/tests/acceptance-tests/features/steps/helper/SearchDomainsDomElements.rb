path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'singleton'
require 'HTMLAction.rb'
require 'AccessHtmlElement.rb'

#
class SearchElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Search Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@id, 'searchpanel')]/descendant::input[contains(@id, 'searchbar')]"))

    access_search_result_list = AccessHtmlElement.new(:class, "cpe-search-result-summary")
    add_verify(CucumberLabel.new("Search Results"), InElementList.new(access_search_result_list), access_search_result_list)

    add_action(CucumberLabel.new("Past Month"), ClickAction.new, AccessHtmlElement.new(:xpath, "todo"))
    add_action(CucumberLabel.new("Past Week"), ClickAction.new, AccessHtmlElement.new(:xpath, "todo"))
    add_action(CucumberLabel.new("Yesterday"), ClickAction.new, AccessHtmlElement.new(:xpath, "todo"))
    add_action(CucumberLabel.new("Today"), ClickAction.new, AccessHtmlElement.new(:xpath, "todo"))
    add_action(CucumberLabel.new("Tomorrow"), ClickAction.new, AccessHtmlElement.new(:xpath, "todo"))
    add_action(CucumberLabel.new("Search Clinics close button"), ClickAction.new, AccessHtmlElement.new(:xpath, "//input[@placeholder='Search Clinics']/ancestor::div[contains(@id, 'popupmenu')]/descendant::*[contains(string(), 'Close')]/ancestor::a"))
    add_action(CucumberLabel.new("Search Wards close button"), ClickAction.new, AccessHtmlElement.new(:xpath, "//input[@placeholder='Search Wards']/ancestor::div[contains(@id, 'popupmenu')]/descendant::*[contains(string(), 'Close')]/ancestor::a"))

    add_verify(CucumberLabel.new("Search Clinics"), VerifyPlaceholder.new, AccessHtmlElement.new(:xpath, "//input[@placeholder='Search Clinics']"))
    add_verify(CucumberLabel.new("Search Wards"), VerifyPlaceholder.new, AccessHtmlElement.new(:xpath, "//input[@placeholder='Search Clinics']"))

    @access_result_titles = AccessHtmlElement.new(:xpath, "//div[contains(@id, 'searchresults')]/descendant::div[contains(@class, 'x-grid-group-title')]")
    add_verify(CucumberLabel.new("Number of result titles"), VerifyXpathCount.new(@access_result_titles), @access_result_titles)

    @access_result_summaries = AccessHtmlElement.new(:class, "cpe-search-result-summary")
    add_verify(CucumberLabel.new("Number of result summaries"), VerifyXpathCount.new(@access_result_summaries), @access_result_summaries)

    @access_results = AccessHtmlElement.new(:class, "cpe-search-result")
  end

  def build_title_xpath(title_text)
    xpath = "//div[contains(@class,'x-grid-group-hd-collapsible')]/div[contains(string(), '#{title_text}')]"
    return xpath
  end

  def build_result_row(text, text_date)
    result_row = "//div[@class='cpe-search-result']/div[contains(string(), '#{text}')]/following-sibling::div[contains(string(), '#{text_date}')]"
    return result_row
  end

  def result_displayed?(text, text_date)
    driver = TestSupport.driver
    row_path = build_result_row(text, text_date)

    search_result_elements =  driver.find_elements(:xpath, row_path)
    if search_result_elements.length > 0
      return true
    end
    return false
  end

  def summary_displayed?(text)
    driver = TestSupport.driver
    search_result_elements =  driver.find_elements(@access_result_summaries.how, @access_result_summaries.locator)
    search_result_elements.each do |element|
      if element.text.start_with?(text)
        return true
      end #end if
    end # loop
    return false
  end # summary_displayed?
end

#
class OpenTitle
  include HTMLAction
  def initialize
    @access_result_titles = AccessHtmlElement.new(:class, "x-grid-group-title")
  end

  def perform_action(_html_element, title_text)
    p "OpenTitle perform_action"
    title_row = build_results_title_row_xpath(title_text)
    classes = title_row.attribute("class")
    if classes.include? "x-grid-group-hd-collapsed"
      p "title is closed"
      title_element = get_title_element(title_text)
      title_element.click
    end
  end

  def build_results_title_row_xpath(text)
    driver = TestSupport.driver
    xpath = "//div[contains(string(), '#{text}')]/ancestor::tr"
    begin
      wait = Selenium::WebDriver::Wait.new(:timeout => 5) # seconds
      wait.until { driver.find_element(:xpath, xpath) }
      return driver.find_element(:xpath, xpath)
    rescue Exception=> e
      p "there was an error #{e}"
      search_result_elements =  driver.find_elements(@access_result_titles.how, @access_result_titles.locator)
      search_result_elements.each do |element|
        p element.text
      end # each do
    end # rescue
    return nil
  end

  def get_title_element(text)
    driver = TestSupport.driver
    search_result_elements =  driver.find_elements(@access_result_titles.how, @access_result_titles.locator)
    search_result_elements.each do |element|
      if element.text.start_with?(text)
        return element
      end
    end
    fail "unable to find search result of #{text}"
  end
end
