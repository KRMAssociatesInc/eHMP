# Encoding: utf-8
require_relative '../../../../infrastructure/vagrant/aws/VagrantfileUtil.rb'
require_relative '../../../../infrastructure/vagrant/Servers.rb'
require 'active_support/core_ext'

# This class uses a passed environment setting parameter and services.json file to determine environment endpoints
class Environment
  # Returns a hash of the environment specified in the env variable
  def self.get_services(env)
    services = JSON.parse(File.open('services.json', 'rb').read)
    services.deep_merge!(get_hosts(env))
  end

  # Returns a hash of the VMs in the specified environment.
  # Format of hash is:
  # hash = {
  #   <vm_name> : {
  #     <ip> : 1.2.3.4,
  #     <directory> : '/path/to/Vagrantfile'
  #   }
  # }
  #
  def self.get_hosts(env)
    hosts = {}

    Servers.getIntegrationTestServers.each do |server|
      host_name = server.serverName
      ip = nil

      if env == 'aws'
        ip = VagrantfileUtil::AWS.get_private_ip('vista-exchange', host_name)
      else
        ip = server.localIP
      end

      puts %Q[#{host_name} = '#{ip}']

      hosts.merge!(
        host_name => {
          ip: ip
        }
      )
    end

    hosts
  end

  # Loads VM IP addresses into environment variables
  def self.setup_environment_endpoints(env)
    get_hosts(env).each do |host, host_info|
      host_name  = host.gsub('-', '_').upcase
      ENV[host_name + '_IP'] = host_info[:ip]
    end
  end
end
