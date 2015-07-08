path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'
require 'date'

class OrdersContainer < AccessBrowserV2
  include Singleton

  def initialize
    super
    add_verify(CucumberLabel.new("Table - Orders Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-orders tbody tr"))

    add_verify(CucumberLabel.new("Complete Table"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=orders] table"))

    add_verify(CucumberLabel.new("Modal Section Headers"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #order-modal-content .col-md-10"))
    add_verify(CucumberLabel.new("Modal Fields"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body #order-modal-content div"))
    # add_action(CucumberLabel.new("Control - modal - Next Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-body #orders-next"))
    add_action(CucumberLabel.new("Control - modal - Next Button"), ClickAction.new, AccessHtmlElement.new(:id, "orders-next"))
    add_action(CucumberLabel.new("Control - modal - Previous Button"), ClickAction.new, AccessHtmlElement.new(:id, "orders-previous"))

    add_action(CucumberLabel.new("applet - Disabled Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .backgrid-paginator .disabled a[title=\"Next\"]"))
    add_action(CucumberLabel.new("applet - Order Type dropdowns"), ClickAction.new, AccessHtmlElement.new(:css,  "[data-appletid=orders] .dropdown-menu li"))
    add_action(CucumberLabel.new("Control - applet - Next Page Arrow"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .backgrid-paginator li a[title=\"Next\"]"))
    add_action(CucumberLabel.new("Control - Minimize"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .applet-minimize-button"))
    add_action(CucumberLabel.new("Control - applet - Previous Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-body #orders-previous"))
    # add_action(CucumberLabel.new("Control - applet - Order Type dropdown"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] #orders-filter-bar button[data-toggle]"))
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .applet-filter-button"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .form-search input"))

    add_action(CucumberLabel.new("Control - applet - Apply"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] #custom-range-apply-orders"))
    add_action(CucumberLabel.new("Control - applet - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] #filter-from-date-orders"))
    add_action(CucumberLabel.new("Control - applet - To Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] #filter-to-date-orders"))
    add_verify(CucumberLabel.new("applet - Date Filter"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .grid-filter-daterange"))

    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=orders] .applet-maximize-button"))
    add_verify(CucumberLabel.new("Selected Order Type"), VerifyContainsText.new, AccessHtmlElement.new(:id, 'order-type-options'))
    add_verify(CucumberLabel.new("Tooltip"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, '//*[@id="urn-va-order-9E7A-3-12978"]/td[3]/a'))
    order_table_rows = AccessHtmlElement.new(:xpath, "//*[@data-appletid='orders']/descendant::tbody/descendant::tr")
    add_verify(CucumberLabel.new("applet - Table - xpath"), VerifyXpathCount.new(order_table_rows), order_table_rows)
    add_action(CucumberLabel.new("Change AMPICILLIN INJ IV 2 GM in 50 over 20 min"), ClickAction.new, AccessHtmlElement.new(:id, 'urn-va-order-9E7A-8-11976'))
    add_action(CucumberLabel.new("01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"), ClickAction.new, AccessHtmlElement.new(:id, 'urn-va-order-9E7A-3-15479'))
    add_action(CucumberLabel.new("METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0"), ClickAction.new, AccessHtmlElement.new(:id, 'urn-va-order-9E7A-3-27837'))
    
    add_action(CucumberLabel.new("Discontinue UPPER GI WITH KUB <Requesting Physician Cancelled>"), ClickAction.new, AccessHtmlElement.new(:id, 'urn-va-order-9E7A-3-12977'))
    
  end # initialize
end # OrdersContainer

Before do
  @oc = OrdersContainer.instance
end

def check_field_format(field_name, correct_format_regex)
  modal_fields_key = "Modal Fields"

  @oc.wait_until_element_present(modal_fields_key, 15)
  actual_modal_rows = @oc.get_elements(modal_fields_key)

  was_evaluated = false

  actual_modal_rows.each do |actual_modal_row|
    if (actual_modal_row.attribute("class") == "row") && (actual_modal_row.text.include?(field_name))
      was_evaluated = true

      row_text = actual_modal_row.text.strip

      actual_match = /#{field_name}\n(?<data>.*)/.match(row_text)
      actual_data = actual_match["data"]
      p "#{field_name} Value: #{actual_data}"

      correct_format_match = correct_format_regex.match(actual_data)

      if correct_format_match == nil
        fail "The #{field_name} was not in the correct format."
      end # if match isn't found
    end # if row is class and field name matches
  end # actual_modal_rows.each

  if was_evaluated == false
    fail "The #{field_name} was not evaluated because the field was not found."
  end
end

# ######################## When ########################

When(/^the user clicks the "(.*?)" button in the Orders applet$/) do |control_name|
  @oc.wait_until_element_present("Table - Orders Applet", 15)
  wait_and_perform(@oc, control_name)
end

When(/^the user selects "(.*?)" in the Orders applet "(.*?)" dropdown$/) do |selection, control_name|
  @oc.wait_until_element_present("Table - Orders Applet", 15)

  wait = Selenium::WebDriver::Wait.new(:timeout => 15)

  wait.until {
    wait_and_perform(@oc, "applet - Order Type dropdown")
    @oc.get_elements("applet - Order Type dropdowns")[0].displayed?
  }

  wait.until {
    (@oc.get_elements("applet - Order Type dropdowns").size > 1) &&
    (@oc.get_elements("applet - Order Type dropdowns")[0].text.empty? == false)
  }

  dropdown_elements = @oc.get_elements("applet - Order Type dropdowns")

  desired_element = nil

  dropdown_elements.each do |element|
    if element.text.include?(selection)
      desired_element = element
      break
    end
  end

  if desired_element == nil
    fail "The desired element was not found in the dropdown."
  else
    desired_element.click
  end
end

# ######################## Then ########################

Then(/^the modal has the following section headers$/) do |expected_section_headers|
  TestSupport.driver.save_screenshot('features/heders.png')
  actual_section_headers = @oc.get_elements("Modal Section Headers")
  expected_section_headers = expected_section_headers.rows

  expect(actual_section_headers.size).to eq(expected_section_headers.size)

  for i in 0...expected_section_headers.size do
    verify_elements_equal(expected_section_headers[i][0], actual_section_headers[i].text.strip)
  end
end

Then(/^under the "(.*?)" headers there are the following fields$/) do |section_name, expected_fields|
  modal_fields_key = "Modal Fields"

  @oc.wait_until_element_present(modal_fields_key, 15)
  actual_modal_rows = @oc.get_elements(modal_fields_key)

  expected_fields_enumerator = expected_fields.rows.enum_for

  in_correct_section = false

  actual_modal_rows.each do |actual_modal_row|
    if actual_modal_row.attribute("class") == "col-md-10"
      if actual_modal_row.text.strip == section_name
        p "Section Found: #{section_name}"
        in_correct_section = true
      else
        in_correct_section = false
      end # if section_name

    # don't evaluate empty rows
    elsif !actual_modal_row.text.strip.empty?
      if in_correct_section
        expected_field = expected_fields_enumerator.peek[0]

        # get rid of the field data; just want the field title
        actual_field = actual_modal_row.text.sub(/\n.*/, "")

        verify_elements_equal(expected_field, actual_field)

        # ruby throws an exception if you hit the end
        expected_fields_enumerator.next unless expected_field == expected_fields.rows.last[0]
      end
    end # if "rowHeader"
  end # actual_modal_rows.each
end

Then(/^the "(.*?)" column contains "(.*?)"$/) do |column_name, expected_text|
  driver = TestSupport.driver

  wait = Selenium::WebDriver::Wait.new(:timeout => 15)

  # the only way I was able to avoid stale element references
  sleep 0.5
  wait.until {
    first_row_element = driver.find_element(:css, "[data-appletid=orders] table tbody tr")
    first_row_element.text.include? expected_text
  }

  p "First Row: #{driver.find_element(:css, "[data-appletid=orders] table tbody tr").text}"

  table_key = "Complete Table"
  @oc.wait_until_element_present(table_key, 15)
  actual_table = @oc.get_element(table_key)

  headers = actual_table.find_elements(:css, "thead tr th")
  desired_column_index = headers.index { |h| h.text == column_name }

  actual_data_rows = actual_table.find_elements(:css, "tbody tr")

  actual_data_rows.each do |actual_row|
    desired_actual_column = actual_row.find_elements(:css, "td")[desired_column_index].text
    is_text_included = desired_actual_column.include? expected_text
    expect(is_text_included).to be_true, "The column (#{desired_actual_column}) did not include the expected text (#{expected_text})."
  end # actual_data_rows.each
end

Then(/^the Orders should be sorted by "(.*?)" and then "(.*?)"$/) do |first_sort_argument, second_sort_argument|
  table_key = "Complete Table"
  @oc.wait_until_element_present(table_key, 15)
  actual_table = @oc.get_element(table_key)

  headers = actual_table.find_elements(:css, "thead tr th")
  first_column_index = headers.index { |h| h.text == first_sort_argument }
  second_column_index = headers.index { |h| h.text == second_sort_argument }

  last_first_element = ""
  last_second_element = ""

  @oc.wait_until_element_present(table_key, 15)
  actual_table = @oc.get_element(table_key)

  row_elements = actual_table.find_elements(:css, "tbody tr")

  row_elements.each do |row|
    row.location_once_scrolled_into_view
    # debugger
    cell_elements = row.find_elements(:css, "td")
    current_first_element = cell_elements[first_column_index].text
    current_second_element = cell_elements[second_column_index].text

    if current_first_element == last_first_element # only evaluate the 2nd argument if the 1st stays the same
      is_second_element_greater = convert_to_date(current_second_element) <= convert_to_date(last_second_element)
      expect(is_second_element_greater).to be_true
    else # only evaluate the 1st argument if it changes
      is_first_element_greater = current_first_element >= last_first_element
      expect(is_first_element_greater).to be_true
    end # if current == last

    last_first_element = current_first_element
    last_second_element = current_second_element
  end # row_elements.each
end

Then(/^the "(.*?)" input should have the value "(.*?)" in the Orders applet$/) do |control_name, expected_value|
  begin
    wait = Selenium::WebDriver::Wait.new(:timeout => 15)
    wait.until { @oc.get_element("Control - applet - #{control_name}").attribute("value") == expected_value }
  rescue Exception => e
    p "Actual value found: #{@oc.get_element("Control - applet - #{control_name}").attribute("value")}"
    raise e
  end
end

Then(/^the selected Order type is "(.*?)"$/) do |expected_text|
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)

  wait.until { @oc.get_element("Selected Order Type") }

  # some of the button's text has some whitespace at the end - remove it with 'strip'
  expect(@oc.perform_verification("Selected Order Type", expected_text)).to be_true
end

Then(/^the "(.*?)" is in the correct format: all digits$/) do |field_name|
  correct_format_regex = /\d+/

  check_field_format(field_name, correct_format_regex)
end

Then(/^the "(.*?)" is in the correct format: mm\/dd\/yyyy hh:mm$/) do |field_name|
  correct_format_regex = /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/

  check_field_format(field_name, correct_format_regex)
end

Then(/^the Orders Applet table contains specific rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => 20)
  wait.until { VerifyTableValue.compare_specific_row(table, '#data-grid-orders') }
end

Then(/^user scrolls the order applet down$/) do
  driver = TestSupport.driver
  driver.execute_script("$('#grid-panel-orders').scrollTop(1000000)")
  # sleep 10
end

When(/^user hovers over on the first record's "(.*?)"$/) do |arg1|
  @oc = OrdersContainer.instance
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  hover = wait.until { driver.find_element(:xpath, "//*[@id='urn-va-order-9E7A-3-12978']/td[contains(string(),'...')]") }
  driver.action.move_to(hover).perform
end

Then(/^the tooltip contains text "(.*?)"$/) do |arg1|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) 
  wait.until { @oc.get_element("Tooltip") }
  expect(driver.find_element(:xpath, "//*[@id='urn-va-order-9E7A-3-12978']/td[3]/span").attribute("title")).to include(arg1)
end

When(/^the user scrolls to the bottom of the Orders Applet$/) do
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { infiniate_scroll('#data-grid-orders tbody') }
end

def there_is_at_least_one_nonempty_order_row
  return false unless @oc.wait_until_xpath_count_greater_than("applet - Table - xpath", 0)
  return false if TestSupport.driver.find_elements(:css, "[data-appletid=orders] tbody .empty").length > 0 
  return true
end

When(/^the applet displays orders$/) do
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { there_is_at_least_one_nonempty_order_row }
end

When(/^the user selects order "(.*?)"$/) do |arg1|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)

  # make sure there is at least 1, non-empty row in the orders applet
  wait.until { there_is_at_least_one_nonempty_order_row }
  # scroll the applet until all the rows are loaded
  wait.until { infiniate_scroll('#data-grid-orders tbody') }

  expect(@oc.perform_action(arg1)).to be_true
end

