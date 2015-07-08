

dir = Dir.new("../grails-app/conf/data")
files = Dir.entries(dir)
num = 0
files.each do |filename|

  if filename.include? "28563-5"
    num += 1

    filepath = "#{dir.path}/#{filename}"

    begin
      file = File.open(filepath)

      inpatient_note = File.open("grails-app/conf/inpatient_notes#{(num % 2)+1}.json")
      str = inpatient_note.read()
      puts str
      File.open(filepath, "w+").write(str)

    rescue Exception => ex
      puts ex.message
      puts ex.backtrace.join("\n")
      puts "no file like: #{filepath}"
    end

  end
end