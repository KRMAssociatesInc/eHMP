class AllergyJson

  def create_file
    #patientIEN =  ARGV.shift.to_i
    #maxcount = ARGV.shift.to_i

    patientIEN =  999999
    maxcount = 1


    time = Time.new
    year = time.year.to_s
    yy = (time.year - 1700).to_s   
    mm = time.strftime ("%m").to_s
    dd = time.strftime ("%d").to_s    
    ntime = yy+mm+dd

    if patientIEN == 0 or maxcount == 0 then

     puts "[Missing Arguments] enter PatientIEN, Total records to be created"
     puts "[e.g.] name.rb 100022 10"

    else  

    createcounter = 0
    while createcounter < maxcount 

    date = Forgery(:Date).month(options = {:numerical => true}).to_s + Forgery(:Date).day.to_s

      #Parse JSON template file and replace allergies value with Forgery generated record
        json = File.read ('100022_Allergy_20140108_1611.json')
        pr = JSON.parse(json)
      #Create new  json objects and replace with forgery patient data
        pr['allergies'] != nil && pr['allergies']['list'] != nil
        thirdParameter = []

        pr['allergies']['list'].each { |list| 
         if list['key'] == 'GMRAGNT' && list['value'] == 'ALCOHOL^52;GMRD(120.82,'
            list['value'] = Forgery(:PatientRecord).allergies 
            thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
         elsif list['key'] == 'GMRASYMP' && list['value'] == '258^PAIN IN LEG^^^'
            list['value'] = Forgery(:PatientRecord).symptoms
            thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
         elsif list['key'] == 'GMRAORDT' && list['value'] == '3140108.1611'
            list['value'] = ntime.to_s + '.' + date.to_s
            thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
         #elsif list['key'] == 'GMRACHT' && list['value'] == '3140108.161159'
            #list['value'] = ntime.to_s + '.' + Forgery(:time).HH.to_s + Forgery(:time).MI.to_s + Forgery(:time).SS.to_s
            #thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
         elsif  
            list['ordinal'] == nil || list['ordinal'] == ""
            thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
         else
            thirdParameter << ["\"#{list['key']}\",#{list['ordinal']}","#{list['value']}"]
         end
        }

        pr['allergies']['patientIEN'] = patientIEN.to_s 
        
        id = patientIEN.to_s+ '_Allergy_' + year.to_s + mm + dd + '_' + date.to_s
        context = {
          'id'=>id, 'allergies'=>pr['allergies']
        }

        #Create new JSON file with forgery generated values
        #path = "#{Dir.home}/Projects/vistacore/ehmp/infrastructure/chef/data_bags/kodak/"
        path = "#{Dir.home}/Documents/"
        FileUtils.mkdir_p(path) unless File.exists?(path)
        File.open( path + id + ".json", "w") {|file| file.write(JSON.pretty_generate(context))}
     
      createcounter += 1
    end

      #Print total records created
      p maxcount.to_s + " JSON files created" + ", path=" + path.to_s
    end
  end
end
