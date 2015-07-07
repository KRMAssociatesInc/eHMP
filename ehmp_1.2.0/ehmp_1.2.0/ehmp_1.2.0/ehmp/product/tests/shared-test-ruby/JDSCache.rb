require 'rubygems'
require 'json'
require 'httparty'
require File.dirname(__FILE__) + '/../../../infrastructure/vagrant/Servers.rb'
require File.dirname(__FILE__) + '/../../../infrastructure/vagrant/aws/VagrantfileUtil.rb'

class JDSCache
  @username = "tomcat"
  @password = "tomcat"
  @timeout = 240

  def self.clear_cache(env)
    case env
    when "aws"
      set_endpoints(env)
    else
      set_endpoints("virtualbox")
    end

    stop_tomcat = "https://#{@ehmp_ip}:8443/manager/text/stop?path=/"
    start_tomcat = "https://#{@ehmp_ip}:8443/manager/text/start?path=/"
    auth = { :username => @username, :password => @password }

    # Stop Tomcat
    p "Stopping Tomcat..."
    p "Waiting up to #{@timeout} seconds for shutdown to complete..."
    response = HTTParty.get(stop_tomcat, { :verify => false, :basic_auth => auth, :timeout => @timeout })

    # Check that the stop command was successful
    unless response.code == 200 then
      fail "Incorrect response received: #{response.code} #{response.body}"
    end

    # Clear JDS
    p "Clearing the JDS cache"
    response = HTTParty.delete("http://#{@jds_ip}:9080/vpr?confirm=true", {:timeout => 20})
    unless response.code == 200 then
      fail "Incorrect response received: #{response.code} #{response.body}"
    end
    response = HTTParty.delete("http://#{@jds_ip}:9080/data?confirm=true", {:timeout => 20})
    unless response.code == 200 then 
      fail "Incorrect response received: #{response.code} #{response.body}"
    end

    # Start Tomcat
    p "Starting Tomcat..."
    response = HTTParty.get(start_tomcat, { :verify => false, :basic_auth => auth, :timeout => @timeout})

    # Check that the start command was successful
    unless response.code == 200 then 
      fail "Incorrect response received: #{response.code} #{response.body}"
    end

    p "Complete. ODC sync will begin shortly.\n"
  end
end

def set_endpoints(env)
    case env
    when "virtualbox"
      p "Running with virtualbox environments"
      @ehmp_ip = Servers::EHMP.localIP
      @jds_ip = Servers::JDS.localIP
    when "aws"
      p "Running with aws environments"
      @ehmp_ip = VagrantfileUtil::AWS.get_private_ip("vista-exchange", "ehmp")
      @jds_ip = VagrantfileUtil::AWS.get_private_ip("vista-exchange", "jds")
    else
      fail "Unrecognized environment type: #{env}. Allowable types are: 'virtualbox' and 'aws'"
    end
  end
