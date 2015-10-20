require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# OrdersPage: Page-Object for orders gist on coversheet page and expanded orders page
class OrdersPage < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end
  # orders
  span(:screenNm, id: 'screenName')
  ORDERS_TABLE_ID = 'data-grid-orders'
  APPLET_ID = 'orders'
  element(:ordersHeaders, :thead, css: "##{ORDERS_TABLE_ID} thead")
  element(:ordersHeaderDate, :th, id: 'orders-entered')
  element(:ordersHeaderStatus, :th, id: 'orders-statusName')
  element(:ordersHeaderOrder, :th, id: 'orders-summary')
  element(:ordersHeaderFacility, :th, id: 'orders-facilityMoniker')
  table(:ordersTable, id: "#{ORDERS_TABLE_ID}")
  elements(:ordersRows, :tr, css: "##{ORDERS_TABLE_ID} tbody tr")
  button(:ordersHB, id: 'help-button-orders')
  button(:orders_coversheet_plus_button, css: '#\35 4cdb996d9c8 .applet-add-button.btn.btn-xs.btn-link')
  elements(:orderColumn, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(3)")

  # filters
  button(:all_range, id: 'all-range-orders')
  text_field(:textfilter, css: "[data-appletid=#{APPLET_ID}] #input-filter-search")
  select_list(:orderType, id: 'order-type-options')

  # coversheet columns
  elements(:orderDate_cs_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(1)")
  elements(:status_cs_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(2)")
  elements(:order_cs_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(3)")
  elements(:facility_cs_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(4)")

  # expanded columns
  elements(:orderDate_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(1)")
  elements(:status_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(2)")
  elements(:order_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(3)")
  elements(:type_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(4)")
  elements(:provider_name_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(5)")
  elements(:start_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(6)")
  elements(:stop_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(7)")
  elements(:facility_ex_Column, :td, css: "##{ORDERS_TABLE_ID} td:nth-child(8)")

  # modal
  button(:nextButton, id: 'orders-next')
  button(:previousButton, id: 'orders-previous')

  def orders_applet_finish_loading?
    return true if contains_empty_row? ORDERS_TABLE_ID
    return true if ordersRows_elements.length > 0
    false
  end

  def navigate_to_orders_expanded
    @driver.goto(BASE_URL + '#orders-full')
    screenNm_element.when_visible(@dfault_timeout)
    Watir::Wait.until { screenNm == 'Orders' }
    Watir::Wait.until { orders_applet_finish_loading? }
  end

  def column_contains_substring(columns, substring)
    # p "columns: #{columns.length}"
    (0..columns.length - 1).each do |i|
      text_includes_substring = columns[i].element.text.downcase.include? substring.downcase
      p "#{columns[i].element.text} did not contain substring #{substring}" unless text_includes_substring
      return false unless text_includes_substring
    end
    true
  end

  def scroll_table
    found_bottom = false
    number_of_attempts = 0
    until found_bottom && number_of_attempts > 2
      count1 =  ordersRows_elements.length
      # p "scroll row #{count1} into view"
      ordersRows_elements.last.scroll_into_view
      count2 = ordersRows_elements.length
      found_bottom = (count1 == count2)
      number_of_attempts = found_bottom ? number_of_attempts + 1 : 0
      sleep 1 if found_bottom
    end
    found_bottom
  end
end
