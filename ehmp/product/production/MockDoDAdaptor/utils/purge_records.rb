require 'fileutils'

edipis = [
    "0000000001",
    "0000000002",
    "0000000003",
    "0000000004",
    "0000000011",
    "0000000012",
    "0000000013",
    "0000000017"
]

loincs = [
    "21869-3",
    "46209-3",
    "11487-6",
    "34109-9",
    "28563-5",
    "26436-6",
    "29305-0",
    "60733-3",
    "18726-0"
]

dir = Dir.new("../grails-app/conf/mock_data")
files = Dir.entries(dir)
cur_edipi = nil
cur_edipiIdx = -1
files.each do |filename|

  if filename.include? "json"
    filepath = "#{dir.path}/#{filename}"

    begin
      file = File.open(filepath)

      edipi = filename[0..filename.index("_")-1]
      loinc = filename[filename.index("_")+1..filename.rindex("_")-1]
      #puts "edipi: #{edipi} loinc: #{loinc} :: edipi idx: #{edipis.find_index(edipi)} loinc idx: #{loincs.find_index(loinc)}"
      if edipis.find_index(edipi) != nil && loincs.find_index(loinc) != nil
        puts "copying #{filepath}"
        FileUtils.cp(filepath, '../grails-app/conf/to_share')

      end

    rescue
      puts "no file like: #{filepath}"
    end

  end
end