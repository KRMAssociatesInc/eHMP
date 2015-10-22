# Valid Login information to be used for most tests
class DefaultLogin
#    @@hmp_url = ENV.keys.include?('LEIPR_IP') ? 'https://' + ENV['LEIPR_IP'] :"https://hmpdemo.vainnovations.us"
#    @@facility = "HMP SANDBOX"
#    @@accesscode = "10VEHU"
#    @@verifycode = "VEHU10"

  # @@hmp_url = 'https://' + ENV['EHMP_IP'] + ":8443"
  if !ENV['VE2_ATEST'].nil? && ENV['VE2_ATEST'] == "1"
    p "Using VE2 for Acceptance Tests"
    @@hmp_url = ENV.keys.include?('VE2_EHMP_IP') ? 'https://' + ENV['VE2_EHMP_IP'] +":8443": "https://10.9.9.4:8443"
    @@fhir_url = ENV.keys.include?('VE2_VE_API_IP') ? 'https://' + ENV['VE2_VE_API_IP'] : "https://10.9.9.5"
    @@jds_url = ENV.keys.include?('VE2_JDS_IP') ? 'http://' + ENV['VE2_JDS_IP'] + ":9080" : "http://10.9.9.110:9080"
    @@solr_url = ENV.keys.include?('VE2_SOLR_IP') ? 'http://' + ENV['VE2_SOLR_IP'] + ":8983" : "http://10.9.9.10:8983"
    @@vx_sync_url = ENV.keys.include?('VX_SYNC_IP') ? 'http://' + ENV['VX_SYNC_IP'] + ":8080" : "https://10.3.3.6:8080"
  else
    p "Using default VistA-Exchange for Acceptance Tests"
    @@hmp_url = ENV.keys.include?('EHMP_IP') ? 'https://' + ENV['EHMP_IP'] +":8443": "https://10.3.3.4:8443"
    @@jds_url = ENV.keys.include?('JDS_IP') ? 'http://' + ENV['JDS_IP'] + ":9080" : "http://10.2.2.110:9080"
    @@fhir_url = ENV.keys.include?('VE_API_IP') ? 'https://' + ENV['VE_API_IP'] : "https://10.3.3.5"
    @@solr_url = ENV.keys.include?('SOLR_IP') ? 'http://' + ENV['SOLR_IP'] + ":8983" : "http://10.3.3.10:8983"
    @@vx_sync_url = ENV.keys.include?('VX_SYNC_IP') ? 'http://' + ENV['VX_SYNC_IP'] +":8080" : "http://10.3.3.6:8080"
    @@wb_vx_sync_url = ENV.keys.include?('WB_VX_SYNC_PORT') && ENV.keys.include?('VX_SYNC_IP') ? 'http://' + ENV['VX_SYNC_IP'] +":"+ENV['WB_VX_SYNC_PORT'] : "http://10.3.3.6:9090"
    @@panorama_url = ENV.keys.include?('PANORAMA_IP') ? ENV['PANORAMA_IP'] +":9210" : "10.2.2.101:9210"
    @@kodak_url = ENV.keys.include?('KODAK_IP') ? ENV['KODAK_IP'] +":9210" : "10.2.2.102:9210"
  end

  @@facility = "PANORAMA"
  @@accesscode = "pu1234"
  @@verifycode = "pu1234!!"
  # @@jds_url = 'https://' + ENV['JDS_IP'] + ":9080"

  @@default_wait_time = 50

  @@rdk_url = ENV.keys.include?('RDK_IP') ? 'http://' + ENV['RDK_IP'] + ":8888" : "http://127.0.0.1:8888"
  @@rdk_api_url = ENV.keys.include?('RDK_API_IP') ? 'http://' + ENV['RDK_API_IP'] + ":8888" : "http://10.4.4.105:8888"
  
  def self.rdk_url
    return @@rdk_url
  end

  def self.rdk_api_url
    return @@rdk_api_url
  end
  
  @@ve2_hmp_url = ENV.keys.include?('VE2_EHMP_IP') ? 'https://' + ENV['VE2_EHMP_IP'] +":8443": "https://10.9.9.4:8443"
  @@ve2_fhir_url = ENV.keys.include?('VE2_VE_API_IP') ? 'https://' + ENV['VE2_VE_API_IP'] : "https://10.9.9.5"
  @@ve2_jds_url = ENV.keys.include?('VE2_JDS_IP') ? 'http://' + ENV['VE2_JDS_IP'] + ":9080" : "http://10.9.9.110:9080"
  @@ve2_solr_url = ENV.keys.include?('VE2_SOLR_IP') ? 'http://' + ENV['VE2_SOLR_IP'] + ":8983" : "http://10.9.9.10:8983"

  def self.wait_time
    return @@default_wait_time
  end

  def self.jds_url
    return @@jds_url
  end
  def self.fhir_url
    return @@fhir_url
  end
  def self.solr_url
    return @@solr_url
  end

  def self.facility
    return @@facility
  end

  def self.access_code
    return @@accesscode
  end

  def self.verify_code
    return @@verifycode
  end

  def self.hmp_url
    return @@hmp_url
  end

  def self.ve2_jds_url
    return @@ve2_jds_url
  end
  
  def self.ve2_fhir_url
    return @@ve2_fhir_url
  end
 
  def self.ve2_hmp_url
    return @@ve2_hmp_url
  end
  
  def self.ve2_solr_url
    return @@ve2_solr_url
  end
  
  def self.vx_sync_url
    return @@vx_sync_url
  end
  
  def self.wb_vx_sync_url
    return @@wb_vx_sync_url
  end
  
  def self.panorama_url
    return @@panorama_url
  end
  
  def self.kodak_url
    return @@kodak_url
  end
  
end

