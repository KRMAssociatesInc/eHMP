# Encoding: utf-8
require 'httparty'
require 'rspec'
require 'json'

# This module include helper methods and global setup options for RSpec tests
module SpecHelper
  SERVICES = JSON.parse(ENV['INTTEST_SERVICES'])
  # Set global defaults for HTTPary requests
  class HTTParty::Basement
    default_timeout 10
    default_options[:verify] = false
  end
end
