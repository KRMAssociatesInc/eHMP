require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'common_test_page'
require_relative 'common_elements_page'

# Timeline page object
class TimelinePage < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @common_test = CommonTest.new(driver)
    @driver = driver
  end

  span(:screenNm, id: 'screenName')

  TIMELINE_INSTANCE_ID = '[data-instanceid=newsfeed]'
  TIMELINE_TABLE_ID = 'data-grid-newsfeed'

  span(:appletTitle, css: "#{TIMELINE_INSTANCE_ID} .panel-title")
  element(:emptyRow, :tr, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} tr .empty")
  elements(:tableRows, :tr, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} tbody tr")
  element(:dateHeader, :th, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} #newsfeed-activityDateTime")
  element(:activityHeader, :th, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} #newsfeed-activity")
  element(:typeHeader, :th, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} #newsfeed-displayType")
  element(:enteredByHeader, :th, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} #newsfeed-primaryProviderDisplay")
  element(:facilityHeader, :th, css: "#{TIMELINE_INSTANCE_ID} ##{TIMELINE_TABLE_ID} #newsfeed-facilityName")

  element(:headers, :thead, css: "##{TIMELINE_TABLE_ID} thead")
  link(:timeline_link, href: '#news-feed')
  element(:headers, :thead, css: "##{TIMELINE_TABLE_ID} thead")

  def navigate_to_timeline
    @driver.goto(BASE_URL + '#news-feed')
    screenNm_element.when_visible(@default_timeout)
    Watir::Wait.until { screenNm == 'Timeline' }
    Watir::Wait.until { finished_loading? }
  end

  def finished_loading?
    return true if emptyRow_element.visible?
    return true if tableRows_elements.length > 0
    false
  end
end
