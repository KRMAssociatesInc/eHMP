require "httparty"

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "DefaultLogin.rb"
require "TestSupport.rb"
require "DomAccess.rb"
#require "PatientPickerDomElements.rb"

class HTTPartyWithBasicAuth
  include HTTParty
  @@auth = { :username => "B362;pu1234", :password => "pu1234!!" }

  @@time_start = Time.new
  @@time_done = Time.new
   
  def self.time_elapsed_last_call
    return @@time_done - @@time_start
  end
  
  def self.post_with_authorization(path)
    # "Authorization", "Basic QjM2Mjs1MDA6cHUxMjM0O3B1MTIzNCEh"
    # directory = post(path, { :verify => false, :headers => @@header,  :basic_auth => @@auth })
    @@time_start = Time.new
    directory = post(path, { :verify => false, :basic_auth => @@auth, :timeout => 60 })
    @@time_done = Time.new
    return directory
  end

  def self.get_with_authorization(path)
    #  @response = HTTParty.get(@dataHref, { :verify => false, :headers => { 'Accept' => 'application/json' }, :basic_auth => auth })

    # directory = get(path, { :verify => false, :headers => @@header,  :basic_auth => @@auth})
    @@time_start = Time.new
    directory = get(path, { :verify => false, :basic_auth => @@auth, :timeout => 60 })
    @@time_done = Time.new
    return directory
  end

  def self.get_with_authorization_for_user(path, user, pass)
    @@time_start = Time.new
    auth = { :username => user, :password => pass }
    directory = get(path, { :verify => false, :basic_auth => auth, :timeout => 60 })
    @@time_done = Time.new
    return directory
  end

  def self.put_with_authorization(path)
    @@time_start = Time.new
    directory = put(path, { :verify => false, :basic_auth => @@auth, :timeout => 60 })
    @@time_done = Time.new
    return directory
  end

  def self.delete_with_authorization(path)
    @@time_start = Time.new
    directory = delete(path, { :verify => false, :basic_auth => @@auth,  :timeout => 60 })
    @@time_done = Time.new
    return directory
  end
end
