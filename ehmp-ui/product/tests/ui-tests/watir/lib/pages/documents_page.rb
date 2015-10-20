require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'common_elements_page'

# Documents page for $BASE/#documents
class Documents < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end

  span(:screenNm, id: 'screenName')
  span(:appletTitle, css: '.panel-title-label')
  element(:emptyRow, :tr, css: '#data-grid-documents tr.empty')
  elements(:rows, :tr, css: '#data-grid-documents tbody tr')
  button(:addNote, css: 'button.applet-add-button')

  # headers
  elements(:headers, :th, css: '#data-grid-documents thead th')
  element(:dateHeader, :th, id: 'documents-dateDisplay')

  def navigate_to_documents
    @driver.goto(BASE_URL + '#documents-list')
    screenNm_element.when_visible(@default_timeout)
    Watir::Wait.until { screenNm == 'Documents' }
  end

  def finished_loading
    # p 'finished_loading?'
    return true if emptyRow_element.visible?
    return true if rows_elements.length > 0
    false
  end
end
