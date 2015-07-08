#!/usr/bin/env ruby

require 'json'

$queryComplete = false
$eventId = 1000000000

$event_ids = {}

$cur_file_path

def process_data_record(data_record, data_record_key)

  #puts "processing data record"

  data_record.each do |key, val|
    if val.is_a? Array
      #puts "val is an array"
      val.each do |item|
        process_data_record(item, key)
      end
    end
  end

  eventIdLabel = "EventId"

  if data_record_key == "VitalsResults"
    eventIdLabel = "UniqueId"
  end

  evt_id = data_record[eventIdLabel]

  if evt_id && $event_ids[evt_id] != true
    $event_ids[evt_id] = true
  elsif evt_id
    puts "duplicate eventId found: #{evt_id} at #{$cur_file_path}"
    data_record.delete(eventIdLabel)
    data_record[eventIdLabel] = (evt_id.to_i + 10000).to_s
  end

end


def process_data_list(data_list)
  #puts "processing data list"
  data_list.each do |item|

    item.each do |key, val|

      if key == "dataRecord"
        process_data_record(val, key)
      end
    end
  end
end

def process_json(file)
  json_hash = JSON.parse(file.read)

  json_hash.each do |key, val|
    if key == 'dataList'
      process_data_list(val)
    elsif key == "queryComplete" && val == "true"
      $queryComplete = true
    end
  end
 # puts "writing filepath: #{filepath}"
  File.open($cur_file_path, "w+").write(JSON.pretty_generate(json_hash))
end

$queryComplete = false
num = 0
while !$queryComplete
  dir = Dir.new("../grails-app/conf/data")
  files = Dir.entries(dir)
  files.each do |filename|

    if filename.include? "json"
      filepath = "#{dir.path}/#{filename}"

      #puts "filepath: #{filepath}"

      begin
        file = File.open(filepath)

        $cur_file_path = filepath

        process_json(file)
      rescue
        puts "no file like: #{filepath}"
        $queryComplete = true
      end

      num += 1
    end


  end
end
