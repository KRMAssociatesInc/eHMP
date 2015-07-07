require 'httparty'

class DefaultLogin
  @@default_wait_time = 50

  @@rdk_url = ENV.keys.include?('RDK_IP') ? 'http://' + ENV['RDK_IP'] + ":" + ENV["RDK_PORT"]  : "http://10.4.4.105:8888"
  @@jds_url = ENV.keys.include?('JDS_IP') ? 'http://' + ENV['JDS_IP'] + ":9080" : "http://10.2.2.110:9080"
  @@vista_url = ENV.keys.include?('VISTA_IP') ? 'http://' + ENV['VISTA_IP'] + ":" : "http://10.2.2.101"
  
  def self.rdk_url
    return @@rdk_url
  end

  def self.wait_time
    return @@default_wait_time
  end
  
  def self.jds_url
    return @@jds_url
  end
  
  def self.vista_url
    return @@vista_url
  end
end
