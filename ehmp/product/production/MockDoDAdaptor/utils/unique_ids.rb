#!/usr/bin/env ruby

require 'json'

$queryComplete = false
$eventId = 1000000000

def process_data_record(data_record, data_record_key)

  puts "processing data record"

  data_record.each do |key, val|
    if val.is_a? Array
      puts "val is an array"
      val.each do |item|
        process_data_record(item, key)
      end
    end
  end

  eventIdLabel = "EventId"

  if data_record_key == "VitalsResults"
    eventIdLabel = "UniqueId"
  end
  data_record[eventIdLabel] = ($eventId += 1).to_s
  puts "#{data_record}"

end


def process_data_list(data_list)
  puts "processing data list"
  data_list.each do |item|

    item.each do |key, val|

      if key == "dataRecord"
        process_data_record(val, key)
      end
    end
  end
end

def process_json(file, filepath)
  json_hash = JSON.parse(file.read)

  json_hash.each do |key, val|
    if key == 'dataList'
      process_data_list(val)
    elsif key == "queryComplete" && val == "true"
      $queryComplete = true
    end
  end

  File.open(filepath, "w+").write(JSON.pretty_generate(json_hash))

end

$queryComplete = false
num = 0
while !$queryComplete
  dir = Dir.new("../grails-app/conf/data")
  files = Dir.entries(dir)
  files.each do |filename|

    if filename.include? "json"
      filepath = "#{dir.path}/#{filename}"

      puts "filepath: #{filepath}"

      begin
        file = File.open(filepath)

        process_json(file, filepath)
      rescue
        puts "no file like: #{filepath}"
        $queryComplete = true
      end

      num += 1
    end


  end
end
