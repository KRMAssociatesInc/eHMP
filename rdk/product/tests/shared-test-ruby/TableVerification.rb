class TableVerification
  def perform_table_verification(table_method, table_rows_locator, table)
    rows_not_matched = []
    runtime_table_elements = SeleniumCommand.find_elements(table_method, table_rows_locator)
    table.rows.each do |rows_value|
      unless check_for_match_row_table?(rows_value, runtime_table_elements)
        rows_not_matched << "'#{rows_value}' did not find a match!"
      # fail "'#{rows_value}' does not found!"
      end
    end
    unless rows_not_matched.empty?
      flag_error_message(rows_not_matched)
    end
  end

  def check_for_match_row_table?(rows_value, runtime_table_elements)
    expacted_match_value = false
    runtime_table_elements.each do |element|
      if match_row_table?(rows_value, element.text)
        expacted_match_value = true
        break
      end
    end
    return expacted_match_value
  end

  def match_row_table?(rows_value, element)
    row_match = false
    element_found_index = 0
    rows_value.each do |value|
      if element.include? value
        element_found_index +=1
      end
    end
    if element_found_index == rows_value.size
      row_match = true
    end
    return row_match
  end

  def flag_error_message(rows_not_matched)
    text_error_message = "\n"
    for i in 0..rows_not_matched.size-1
      text_error_message = text_error_message +(i+1).to_s+" - "+ rows_not_matched[i]+"\n\n"
    end

    fail ArgumentError.new(text_error_message), text_error_message
  end
end
