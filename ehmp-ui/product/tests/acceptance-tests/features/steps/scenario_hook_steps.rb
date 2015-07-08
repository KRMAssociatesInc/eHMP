class RecordTime
  @@durations = []
  @@start = nil
  @@complete = nil
  def self.record_start_time
    @@durations = [] if @@durations.nil?
    @@start = Time.new
    p "Scenario Start Time: #{@@start}"
  end

  def self.record_end_time
    @@complete = Time.new
  end

  def self.save_test_duration(source_tag_names, failed, location = "unknown")
    duration = sprintf "%.2f sec", (@@complete - @@start)
    location = "#{location}".ljust(50)
    tags = ""
    source_tag_names.each do | tag |
      tags.concat(" #{tag}")
    end
    tags = tags.ljust(60)
    pass_or_fail = failed ? "fail": "pass"
    output = "#{location}, #{tags}"
    @@durations.push("#{output}, #{duration}, #{pass_or_fail}")
  end

  def self.durations
    return @@durations
  end
end

Before do |scenario|
  RecordTime.record_start_time
  TestSupport.increment_counter
end

def take_screenshot(screenshot_name)
  screenshot_name = "#{screenshot_name}".gsub! "features/", "#{ENV["SCREENSHOTS_FOLDER"]}/" if ENV.keys.include?('SCREENSHOTS_FOLDER') 
  screenshot_name_png = "#{screenshot_name}.png"
  p "saving screenshot with name #{screenshot_name_png}"
  TestSupport.driver.save_screenshot(screenshot_name_png)  
rescue Timeout::Error
  p "Timeout Rescue"
end

After do |scenario|

  RecordTime.record_end_time

  temp_location = nil
  begin
    temp_location = scenario.location
  rescue NoMethodError
    temp_location = scenario.scenario_outline.location
  end

  if scenario.failed?
    screenshot_name = "#{temp_location}".gsub! ':', '_'
    take_screenshot screenshot_name
    p "logs through selenium: #{TestSupport.print_logs}"
  end #if
  p "scenario tags: #{scenario.source_tag_names}"

  close_any_open_modals #if scenario.source_tag_names.include? '@modal_test'
  RecordTime.save_test_duration(scenario.source_tag_names, scenario.failed?, temp_location)

  navigate_to_logon_screen
end

def close_any_open_modals
  driver = TestSupport.driver
  #$('#mainModal').modal('hide');

  # if the autolog off dialog is displayed, attempt to close it
  begin
    modal_exists = driver.find_element(:css, '#base-modal .close')
    modal_exists.click
    p "test had to dismiss the auto log off modal"
  rescue
    modal_exists = nil
  end

  # if any other dialog is displayed, attempt to close it
  begin
    modal_exists = driver.find_element(:id, 'mainModal')
    driver.execute_script("$('#mainModal').modal('hide');") if modal_exists
  rescue
    modal_exists = nil
  end
  # driver.execute_script("$('#mainModal').modal('hide');") if modalExists
  wait_until_modal_is_not_displayed
end

at_exit do
  TestSupport.close_browser
  durations = RecordTime.durations
  durations.each do | temp |
    p temp
  end
end


