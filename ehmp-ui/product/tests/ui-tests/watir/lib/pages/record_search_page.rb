require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'common_elements_page'

# Documents page for $BASE/#documents
class RecordSearch < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end
  span(:screenNm, id: 'screenName')

  element(:numberOfResults, :b, id: 'numberOfResults')
  div(:searchResults, id: 'searchResults')
  div(:singleSearchResult, css: '#searchResults .searchGroup')
  elements(:searchGroupItems, :div, css: '.searchGroup')
end
