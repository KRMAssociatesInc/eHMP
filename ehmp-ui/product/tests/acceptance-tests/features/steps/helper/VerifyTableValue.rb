class VerifyTableValue
  
  def perform_table_verification(runtime_table_elements, tableIdentifier, table)
    rows_not_matched = []
    matched = false
    table.rows.each do |rows_value|
      unless check_for_match_row_table(rows_value, runtime_table_elements, tableIdentifier)
        rows_not_matched << "'#{rows_value}' did not find a match!"
        # fail "'#{rows_value}' does not found!"
      end
    end
    if !rows_not_matched.empty?
      flag_error_message(rows_not_matched)
      matched = false
    else
      matched = true
    end
    return matched
  end

  def check_for_match_row_table(rows_value, runtime_table_elements, tableIdentifier)
    driver = TestSupport.driver
    expected_match_value = false  
    #p "check for values within #{runtime_table_elements.length} rows"
    for i in 1..runtime_table_elements.length + 1
      #p "check row #{i}"
      col_elements = driver.find_elements(:xpath, tableIdentifier + "/descendant::tr[#{i}]/descendant::td")  
      if (rows_value.length)!=col_elements.length
        expected_match_value = false
      else
        expected_match_value = match_row_table(rows_value, col_elements)
        if expected_match_value
          p "matched row #{i}"
          break
        end
      end
    end
    return expected_match_value
  end

  def match_row_table(rows_value, col_elements)  
    
    matched = false
    row_string = nil
    col_string = nil
    for col_index in 0..rows_value.length - 1
      row_string = rows_value[col_index]     
      begin
        #col_string = col_elements[col_index].attribute("innerHTML").strip
        col_elements[col_index].location_once_scrolled_into_view
        col_string = col_elements[col_index].text.strip
      rescue Exception => e
        p "exception while getting text field of column element: #{e}"
        break
        # retry
      end
      #p "comparing #{row_string} to #{col_string}"
      if row_string.upcase.start_with? 'CONTAINS'
        matched = compare_contains(row_string, col_string)       
      else 
        matched = compare_equal(row_string, col_string)
      end     
      unless matched
        break
      end
    end #for col_index
    return matched
  end
    
  def compare_equal(cucumber_value, selenium_value)
    if cucumber_value == selenium_value
      matched = true
    else
      matched = false
    end #if   
 
    return matched
  end 
  
  def compare_contains(cucumber_value, selenium_value)
    cucumber_value = cucumber_value[9..-1]
 
    if selenium_value.include? cucumber_value
      matched = true
    else
      matched = false
    end #if  
 
    return matched
  end

  def flag_error_message(rows_not_matched)
    text_error_message = "\n"
    for i in 0..rows_not_matched.size-1
      text_error_message = text_error_message +(i+1).to_s+" - "+ rows_not_matched[i]+"\n\n"
    end   
    fail(ArgumentError, text_error_message)  
  end
  
  def verify_name_value(browser_labels_list, table)
        
    matched = false
     
    table.rows.each do |_key, value|
      browser_labels_list.each do |label_in_browser| 
        # p label_in_browser.text.strip     
        if label_in_browser.text.strip == value
          matched = true
          break
        else
          # p "Expected : #{value} but could not find in the row #{label_in_browser.text}"
          matched = false
        end # end if...else
      end # end browserLabelsList
      unless matched
        p "Expected : #{value} but could not find in the application"
        break
      end # end if      
    end # end table 
    #  p matched 
    return matched
  end

  def verify_partial_text(browser_labels_list, table)
      
    matched = false
    table.rows.each do |key, _value|
      browser_labels_list.each do |label_in_browser| 
        if label_in_browser.text.strip.include? key
          matched = true
          break
        else
          # p "Expected : #{value} but could not find in the row #{label_in_browser.text}"
          matched = false
        end # end if...else
      end # end browserLabelsList
      unless matched
        p "Expected : #{key} but could not find in the application"
        break
      end # end if      
    end # end table 
    
    return matched
  end  

  def self.compare_specific_row(table, table_id)
    driver = TestSupport.driver

    table.rows.each do |row_defined_in_cucumber|
      matched = false
      # the first column should contain the row index
      i = row_defined_in_cucumber[0]
      css_string = "#{table_id} tr:nth-child(#{i}) td"
      #p "css_string #{css_string}"
      cols_displayed_in_browser = driver.find_elements(:css, css_string)
      remove_index = row_defined_in_cucumber.slice(1, row_defined_in_cucumber.length)
      if remove_index.length != cols_displayed_in_browser.length
        matched = false
      else
        matched = avoid_block_nesting_text(remove_index, cols_displayed_in_browser)
      end # if - else
      p "could not match data: #{row_defined_in_cucumber}" unless matched
      return false unless matched
    end # table.rows.each
    return true
  rescue Exception => e
    p "VerifyTableValue.compare_specific_row exception: #{e}"
    return false
  end
  
  def self.verify_alphabetic_sort_caseinsensitive(table_id, column_index, a_z)
    for_error_message = a_z ? "is not greater then" : "is not less then"
    driver = TestSupport.driver
    css_string = "##{table_id} tbody td:nth-child(#{column_index})"
    columns = driver.find_elements(:css, css_string)
    higher = columns[0].text.downcase
    (1..columns.length-1).each do |i|
      lower = columns[i].text.downcase
      check_alpha = a_z ? ((higher <=> lower) <= 0) : ((higher <=> lower) >= 0)
      p "#{higher} #{for_error_message} #{lower}" unless check_alpha
      return false unless check_alpha
      higher = lower
    end
    return true
  rescue Exception => e
    p "verify_alphabetic_sort: #{e}"
    return false
  end
end

