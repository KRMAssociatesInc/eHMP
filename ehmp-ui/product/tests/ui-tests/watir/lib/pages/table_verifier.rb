require 'watir-webdriver'
require 'page-object'

# TableVerifier: perform table data checks
class TableVerifier
  include PageObject

  def table_contains_rows(elements, rows)
    found_all = true
    rows.each do |row|
      found_row = table_contains_row(elements, row)
      p "could not find row #{row}" unless found_row
      found_all &&= found_row
    end
    found_all
  end

  def table_contains_row(elements, row)
    # p 'attempt row compare'
    elements.each do |table_row|
      #   commented out the below section as some tables have headers like Month and Year
      #   without any of the other columns populated
      #      if table_row.cell_elements.length != row.length
      #        p "expected columns length (#{row.length}) does not match browser length (#{table_row.cell_elements.length})"
      #        return false
      #      end
      return true if browser_row_matches(table_row, row)
    end
    return false
  rescue # Exception => e
    # p "exception: #{e}"
    return false
  end

  def browser_row_matches(table_row, expected_row_data)
    # for i in 0..table_row.cell_elements.length - 1
    table_row.cell_elements.each_with_index do |element, i|
      # p "#{table_row.cell_elements[i].text} == #{expected_row_data[i]}"
      return false if element.text != expected_row_data[i]
    end
    # return true
  end

  def table_contains_headers(elements, expected_headers)
    if elements.length != expected_headers.length
      p "expected headers length (#{elements.length}) does not match browser headers (#{expected_headers.length})"
      return false
    end

    elements.each_with_index do |element, i|
      # p "#{elements[i].text} == #{expected_headers[i]}"
      return false if element.text != expected_headers[i]
    end
    # return true
  end

  def column_contains_text(elements, column_text)
    elements.each do |element|
      element_text_include = element.text.include? column_text
      p "#{element.text} did not contains substring #{column_text}" unless element_text_include
      return false unless element_text_include
    end
    true
  end
end
