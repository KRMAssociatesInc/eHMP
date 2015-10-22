require 'DefaultTiming.rb'
# Valid Login information to be used for most tests
class DefaultLogin
  @@adk_url = ENV.keys.include?('ADK_IP') ? 'http://' + ENV['ADK_IP'] : "http://10.1.1.200/"
  @@ehmpui_url = ENV.keys.include?('EHMPUI_IP') ? ENV['EHMPUI_IP'] : "https://10.1.1.150"
  #@@ehmpui_url = 'https://ehmp.vistacore.us'
  @@default_wait_time = DefaultTiming.default_wait_time

  @@facility_index = 1
  @@facility_name = "PANORAMA"
  @@accesscode = "pu1234"
  @@verifycode = "pu1234!!"

  @@screenshot_folder = ENV.keys.include?('SCREENSHOT_FOLDER') ? ENV['SCREENSHOT_FOLDER'] : "screenshots"

  def self.screenshot_folder
    return @@screenshot_folder
  end

  def self.default_facility
    return @@facility_index
  end

  def self.default_facility_name
    return @@facility_name
  end

  def self.accesscode
    return @@accesscode
  end

  def self.verifycode
    return @@verifycode
  end
  
  def self.wait_time
    return @@default_wait_time
  end

  def self.adk_url
    return @@adk_url
  end
  
  def self.ehmpui_url
    return @@ehmpui_url
  end
end # DefaultLogin
