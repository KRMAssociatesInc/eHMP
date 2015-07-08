

class OrdersApplet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new('Orders Expand button'), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid=orders] .applet-maximize-button"))
    add_action(CucumberLabel.new('All Range button'), ClickAction.new, AccessHtmlElement.new(:id, 'all-range-orders'))
  
    xpath_row_count = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-orders']/descendant::tr[contains(@class, 'selectable')]")
    add_verify(CucumberLabel.new('Orders grid row count'), VerifyXpathCount.new(xpath_row_count), xpath_row_count)
  
    # add_action(CucumberLabel.new('Order Type Open dropdown'), ClickAction.new, AccessHtmlElement.new(:id, 'dropdownMenu1'))
    add_action(CucumberLabel.new('Order Type Open dropdown'), ClickAction.new, AccessHtmlElement.new(:id, 'order-type-options'))
  end
end

Then(/^the Orders applet displays "(.*?)"$/) do |arg1|
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { driver.find_element(:xpath, "//table[@id='data-grid-orders']/descendant::td[contains(string(),'#{arg1}')]").displayed? }
end

When(/^the user clicks the control Expand View in the Orders applet$/) do
  expect(OrdersApplet.instance.perform_action('Orders Expand button')).to be_true
end

When(/^the user clicks the date control All on the Orders applet$/) do
  expect(OrdersApplet.instance.perform_action('All Range button')).to be_true
end

Then(/^the Orders Applet table contains (\d+) rows$/) do |rows|
  expect(OrdersApplet.instance.perform_verification('Orders grid row count', rows)).to be_true
end

When(/^the user selects "(.*?)" in the Orders applet Order Type dropdown$/) do |arg1|
  # OrdersApplet.instance.add_action(CucumberLabel.new("dropdown option"), ClickAction.new, AccessHtmlElement.new(:xpath, "//a[contains(string(), '#{arg1}')]"))
  OrdersApplet.instance.add_action(CucumberLabel.new("dropdown option"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='order-type-options']/option[contains(string(), '#{arg1}')]"))
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until {
    OrdersApplet.instance.perform_action('Order Type Open dropdown') && OrdersApplet.instance.perform_action('dropdown option')
    sleep 10
  }
end

Then(/^the Type column contains "(.*?)"$/) do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^the Orders Applet table contains (\d+) rows with the Type "(.*?)"$/) do |rows, type|
  #"//table[@id='data-grid-orders']/descendant::td[contains(string(), 'Consult')]"
  infiniate_scroll('#data-grid-orders tbody')
  expect(OrdersApplet.instance.perform_verification('Orders grid row count', rows)).to be_true

  headers = TestSupport.driver.find_elements(:css, "#data-grid-orders tr th")
  desired_column_index = headers.index { |h| h.text == 'Type' }

  type_row_count = AccessHtmlElement.new(:xpath, "//td[position() = 4 and contains(string(), '#{type}')]")
  OrdersApplet.instance.add_verify(CucumberLabel.new("Orders Type grid row count"), VerifyXpathCount.new(type_row_count), type_row_count)
  expect(OrdersApplet.instance.perform_verification("Orders Type grid row count", rows)).to be_true
end


