class RecordTime
  @@durations = []
  @@start = nil
  @@complete = nil
  def self.record_start_time
    @@durations = [] if @@durations.nil?
    @@start = Time.new
  end

  def self.record_end_time
    @@complete = Time.new
  end

  def self.save_test_duration(source_tag_names, location = "unknown")
    duration = sprintf "%.2f sec", (@@complete - @@start)
    location = "#{location}".ljust(50)
    tags = ""
    source_tag_names.each do | tag |
      tags.concat(" #{tag}")
    end
    tags = tags.ljust(60)
    output = "#{location} #{tags}"
    @@durations.push("#{output}: #{duration}")
  end

  def self.durations
    return @@durations
  end
end

Before do |scenario|
  RecordTime.record_start_time
end

After do |scenario|
  RecordTime.record_end_time

  temp_location = nil
  begin
    temp_location = scenario.location
  rescue NoMethodError
    temp_location = scenario.scenario_outline.location
  end
  RecordTime.save_test_duration(scenario.source_tag_names, temp_location)
end

at_exit do
  durations = RecordTime.durations
  durations.each do | temp |
    p temp
  end
end
