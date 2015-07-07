#
class DefaultOrderPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_orders
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_orders = 196
  end
end

Given(/^a patient with orders in multiple VistAs$/) do
  @test_patient = DefaultOrderPatient.new
end

When(/^the client requests orders for that patient$/) do
  pid = @test_patient.pid
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.OrdersViewDef", pid
end

Then(/^eHMP returns all orders in the results$/) do
  num_expected_results = @test_patient.num_orders
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to be(num_expected_results)
end

Then(/^set is displayed on screen$/) do | table |
  driver = TestSupport.driver
  elements = driver.find_elements(:class, "cpe-search-result-summary")
  dates = driver.find_elements(:xpath, "//span[@class='text-info']")
  (0..elements.length-1).each do | index |
    temp = elements[index]
    dtemp = dates[index]
    p "|#{temp.text}|#{dtemp.text}|"
  end
end
