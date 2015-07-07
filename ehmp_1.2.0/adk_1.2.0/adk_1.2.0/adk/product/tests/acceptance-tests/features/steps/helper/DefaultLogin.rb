# Valid Login information to be used for most tests
class DefaultLogin
  @@adk_url = ENV.keys.include?('ADK_IP') ? 'http://' + ENV['ADK_IP'] : "http://10.1.1.200/#logon-screen"
  @@ehmpui_url = ENV.keys.include?('EHMPUI_IP') ? 'http://' + ENV['EHMPUI_IP'] : "http://10.1.1.150/"
  @@default_wait_time = 50

  def self.wait_time
    return @@default_wait_time
  end

  def self.adk_url
    return @@adk_url
  end
  
  def self.ehmpui_url
    return @@ehmpui_url
  end
end

