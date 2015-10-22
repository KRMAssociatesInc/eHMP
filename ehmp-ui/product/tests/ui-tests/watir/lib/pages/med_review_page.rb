require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'common_elements_page'

# Documents page for $BASE/#documents
class MedReview < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end

  span(:screenNm, id: 'screenName')
  span(:appletTitle, css: '.panel-title-label')

  div(:mainContentArea, css: '#medsReviewApplet_mainContentArea .medsReviewMainGroup')
  div(:outpatientGrouping, id: 'medsReviewApplet_mainContentArea_OUTPATIENTMedications_accordion_medication_review_v2')
  div(:inpatientGrouping, id: 'medsReviewApplet_mainContentArea_INPATIENTMedications_accordion_medication_review_v2')

  def navigate_to_medreview
    @driver.goto(BASE_URL + '#medication-review')
    screenNm_element.when_visible(@default_timeout)
    Watir::Wait.until { screenNm == 'Meds Review' }
  end
end
