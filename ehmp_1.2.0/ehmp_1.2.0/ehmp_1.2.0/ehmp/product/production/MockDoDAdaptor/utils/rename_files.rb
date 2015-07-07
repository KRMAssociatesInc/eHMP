
edipi_list = [

    "0000000001",
    "0000000002",
    "0000000003",
    "0000000004",
    "0000000005",
    "0000000006",
    "0000000007",
    "0000000008",
    "0000000009",
    "0000000010",
    "0000000011",
    "0000000012",
    "0000000013",
    "0000000014",
    "0000000015",
    "0000000016",
    "0000000017",
    "0000000018",
    "0000000019",
    "0000000020",
    "0000000021",
    "0000000022",
    "0000000023",

]

dir = Dir.new("../grails-app/conf/data")
files = Dir.entries(dir)
cur_edipi = nil
cur_edipiIdx = -1
files.each do |filename|

  if filename.include? "json"
    filepath = "#{dir.path}/#{filename}"

    begin
      file = File.open(filepath)

      edipi = filename[0..filename.index("_")-1]
      if (edipi != cur_edipi)
        cur_edipi = edipi
        cur_edipiIdx += 1
        puts "#{cur_edipi} idx: #{cur_edipiIdx} mapped: #{edipi_list[cur_edipiIdx]}"
      end

      new_filepath = filepath.sub(/\/\d+_/, "/#{edipi_list[cur_edipiIdx]}_")
      puts "new file path #{new_filepath}"
      File.rename(filepath, new_filepath)

    rescue
      puts "no file like: #{filepath}"
    end

  end
end