require "httparty"

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "DefaultLogin.rb"
require "TestSupport.rb"
require "DomAccess.rb"
#require "PatientPickerDomElements.rb"

# Call HTTParty with hardcoded Authorization
class HTTPartyWithAuthorization
  include HTTParty

  @@header = { 'Authorization' => 'Basic QjM2Mjs1MDA6cHUxMjM0O3B1MTIzNCEh' }
  @@time_start = Time.new
  @@time_done = Time.new
   
  def self.time_elapsed_last_call
    return @@time_done - @@time_start
  end

  def self.post_with_authorization(path)
    @@time_start = Time.new
    directory = post(path, { :verify => false, :headers => @@header })
    @@time_done = Time.new
    return directory
  end

  def self.get_with_authorization(path)
    @@time_start = Time.new
    directory = get(path, { :verify => false, :headers => @@header })
    @@time_done = Time.new
    return directory
  end
end

if __FILE__ == $PROGRAM_NAME
  p '-------- WAS HERE -----------'

  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/loadOperationalData?domain=Allergy"

  p "Posting-------------------"
  p HTTPartyWithAuthorization.post_with_authorization(path)

  p "Getting-------------------"
  path = "#{base_url}/sync/operationalSyncStatus"
  p HTTPartyWithAuthorization.get_with_authorization(path)

end
