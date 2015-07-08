path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultLogin.rb'
require 'HTTPartyWithAuthorization.rb'
require 'JsonVerifier.rb'

class PatientCache
  attr_reader :response
  def query_vpr_patients
    base_url = DefaultLogin.hmp_url
    path = "#{base_url}/vpr/view/gov.va.cpe.vpr.queryeng.VprPatientsViewDef"
    path.concat("?_dc=1396988436165")
    path.concat("&mode=json")
    path.concat("&page=1")
    path.concat("&row.start=0")
    path.concat("&row.count=1000")
    #p path
    @response = HTTPartyWithAuthorization.get_with_authorization(path)
    return @response
  end

  def sync_complete_pid?(pid, system_id = "B362")
    return false unless contains_patient_pid? pid
    return generic_sync_complete?("pid", pid, system_id)
  end

  def contains_patient_pid?(pid)
    return contains_patient?("pid", pid)
  end

  def sync_complete_icn?(icn, system_id = "B362")
    return false unless contains_patient_icn? icn
    return generic_sync_complete?("icn", icn, system_id)
  end

  def contains_patient_icn?(icn)
    return contains_patient?("icn", icn)
  end

  def contains_patient_dfn?(system_id, dfn)
    dfn_path = "syncStatusByVistaSystemId.#{system_id}.dfn"
    return contains_patient?(dfn_path, dfn)
  end

  def patient_count
    json = JSON.parse(@response.body)
    return json['total']
  end

  private

  def print_json_verify(json_verify)
    output = json_verify.output
    output.each do | msg|
      p msg
    end #output.each
  end

  def contains_patient?(tag, value)
    json_object = JSON.parse(@response.body)
    json_verify = JsonVerifier.new
    json_verify.reset_output
    path = "data.#{tag}"
    found = json_verify.object_contains_path_value_combo(path, [value], [json_object])
    if found == false
      #print_json_verify(json_verify)
      puts "PatientCache.contains_patient? #{json_verify.error_message}"
    end #if found == false
    return found
  end # contains_patient?

  def generic_sync_complete?(tag, value, system_id = "B362")
    json_verify = JsonVerifier.new

    json_object = JSON.parse(@response.body)
    result_array = json_object["data"]

    data = []
    data.push([tag, value])
    data.push(["syncStatusByVistaSystemId.#{system_id}.syncComplete", "true"])
    data.each do | set |
      fieldpath = set[0]
      fieldvaluestring = set[1]
      json_verify.reset_output

      found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)

      result_array = json_verify.subarry
      if found == false
        puts json_verify.error_message
      end #if found == false
    end #table.rows.each
    return (result_array.length != 0)
  end # generic_sync_complete?
end

if __FILE__ == $PROGRAM_NAME
  puts "---------------------PatientCache Unit Tests  Start----------------"
  #test_patients_dfn.push({ pid: "B362;100022", dfn: "100022" }) #Bcma,Eight
  #test_patients_icn.push({ pid: "5000000217", icn: "5000000217V519385" }) #Eight,Inpatient
  dfn = "100022"
  dfn_pid = "B362;100022"

  icn = "5000000217V519385"

  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/load?dfn=#{dfn}"
  @response = HTTPartyWithAuthorization.post_with_authorization(path)
  fail "sync dfn #{dfn} failed" unless @response.code == 200

  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/load?icn=#{icn}"
  @response = HTTPartyWithAuthorization.post_with_authorization(path)
  fail "sync icn #{dfn} failed" unless @response.code == 200

  sleep 5

  p_cache = PatientCache.new
  fail "querying failed" if p_cache.query_vpr_patients.nil?

  fail "contains patient pid1" unless p_cache.contains_patient_pid? dfn_pid
  fail "contains patient pid2" if p_cache.contains_patient_pid? "BAD DFN"

  fail "sync complete pid failed1" unless p_cache.sync_complete_pid? dfn_pid
  fail "sync complete pid failed2" if p_cache.sync_complete_pid? "BAD DFN"

  fail "contains patient icn1" unless p_cache.contains_patient_icn? icn
  fail "contains patient icn2" if p_cache.contains_patient_icn? "BAD DFN"

  fail "sync complete icn failed1" unless p_cache.sync_complete_icn? icn
  fail "sync complete icn failed2" if p_cache.sync_complete_icn? "BAD DFN"

  fail "contains patient dfn1" unless p_cache.contains_patient_dfn? "B362", dfn
  fail "contains patient dfn2" if p_cache.contains_patient_dfn? "BADSITE", dfn
  fail "contains patient dfn3" if p_cache.contains_patient_dfn? "B362", "BAD DFN"

end
