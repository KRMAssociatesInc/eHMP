class VitalsJson

  def create_file
#patientIEN =  ARGV.shift.to_i
#maxcount = ARGV.shift.to_i

date = Forgery(:Date).month(options = {:numerical => true}).to_s + Forgery(:Date).day.to_s

patientIEN =  777777
maxcount = 2

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

#vtime = Forgery(:Time).HH + Forgery(:Time).MI
#date = Forgery(:Date).month(options = {:numerical => true}).to_s + vtime.to_s

  #Parse JSON template file and replace allergies value with Forgery generated record
         json = File.read ('100022_Vitals_20131105_0801.json')
         pr = JSON.parse(json)
         pr['vitals']['date'] = ntime
         if pr['vitals'] != nil && pr['vitals']['observations'] != nil 
           pr['vitals']['patientIEN'] = patientIEN.to_s
           #pr['vitals']['time'] = vtime
           #id = patientIEN.to_s+ '_Vitals_' + year.to_s + mm + dd + '_' + vtime
           id = patientIEN.to_s+ '_Vitals_' + year.to_s + mm + dd + '_' + date.to_s
         end

         context = {
            'id'=>id, 'vitals'=>pr['vitals']
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