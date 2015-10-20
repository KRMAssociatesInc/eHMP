# $LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'lib'))

require 'watir-webdriver'
require 'rspec'
require 'json'
require 'page-object'
require 'page-object/page_factory'

require_relative '../lib/module/DriverUtility'

RSpec.configure do |c|
  # declare an exclusion filter
  c.filter_run_excluding broken: true
  c.filter_run_excluding regression: true
  c.filter_run_excluding acceptance: true
  c.filter_run_excluding smoketest: true
end

RSpec.configure do |config|
  fetch_current_example = RSpec.respond_to?(:current_example) ? proc { RSpec.current_example } : proc { |context| context.example }

  config.include PageObject::PageFactory

  config.after(:each) do
    example = fetch_current_example.call(self)

    if example.exception
      meta = example.metadata
      filename = File.basename(meta[:file_path])
      line_number = meta[:line_number]
      build_job_url = ENV['JOB_URL']
      # build_job_number = ENV['BUILD_NUMBER']
      unique = Time.new.strftime('%H:%M:%S.%L')
      screenshot_name = "screenshot-#{filename}-#{line_number}-#{unique}.png"
      screenshot_dir = 'screenshots'
      screenshot_path = screenshot_dir + "/#{screenshot_name}"

      Dir.mkdir screenshot_dir unless Dir.exist? screenshot_dir

      @driver.screenshot.save screenshot_path

      puts '----Screenshot ------------------------------------------------------------------------'
      puts meta[:full_description] + "\n  Screenshot: #{screenshot_path}\n  " + (!build_job_url.nil? ? build_job_url.to_s : '') + '/ws/acceptance_test/watir/' + screenshot_path
      puts '---------------------------------------------------------------------------------------'
    end
  end
end

# BASE_URL = 'http://10.1.1.150/'
BROWSER_NAME = ENV['BROWSER'] || 'firefox' # 'firefox'
BASE_URL = ENV['BASE'] || 'https://10.1.1.150/' # 'https://ehmp.vistacore.us/'
