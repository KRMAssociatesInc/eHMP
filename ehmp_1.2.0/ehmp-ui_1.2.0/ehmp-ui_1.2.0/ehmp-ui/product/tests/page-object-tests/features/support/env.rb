require 'rspec'
require 'capybara'
require 'capybara/rspec/matchers'
require 'selenium-webdriver'
require 'site_prism'
require 'capybara/poltergeist'
require 'capybara-screenshot/cucumber'

Capybara.default_wait_time = 5
Capybara.app_host = ENV['BASE'] || 'http://10.1.1.150'
Capybara.save_and_open_page_path = './screenshots'
Capybara::Screenshot.prune_strategy = :keep_last_run
Capybara::Screenshot.register_filename_prefix_formatter(:cucumber) do |scenario|
  "Tags:#{scenario.feature_tags.tags.to_ary.map(&:name)} Title:#{scenario.title}".gsub(' ', '-')
end

World(Capybara::DSL)
World(Capybara::RSpecMatchers)

btype = ENV['BTYPE'] || 'firefox'
case btype.downcase
when 'chrome'
  Capybara.default_driver = :selenium
  Capybara.register_driver :selenium do |app|
    Capybara::Selenium::Driver.new(app, :browser => :chrome)
  end
  # puts '-----------------Chrome is Running--------------------'
when 'firefox'
  Capybara.default_driver = :selenium
  Capybara.register_driver :selenium do |app|
    custom_profile = Selenium::WebDriver::Firefox::Profile.new
    # Turn off the super annoying popup!
    custom_profile["network.http.prompt-temp-redirect"] = false
    Capybara::Selenium::Driver.new(app, browser: :firefox, profile: custom_profile)
  end
  # puts '-----------------Firefox is Running--------------------'
when 'phantomjs'
  Capybara.default_driver = :poltergeist
  Capybara.register_driver :poltergeist do |app|
    options = {
      #:js_errors => true,
      #:timeout => 120,
      #:debug => false,
      #:phantomjs_options => ['--load-images=no', '--disk-cache=false'],
      #:inspector => true,
    }
  Capybara::Poltergeist::Driver.new(app, options)
  end
  puts '-----------------Phantomjs is Running--------------------'
else
  puts '------There is no Browser initialized/available to run the tests------'
  puts "------#{@btype} is not valid from ENV BTYPE------"
end

logged_in ||= false
Before do |scenario|
  login_regex = /^I am logged into EHMP\-UI "(.*?)" as "(.*?)" with password "(.*?)"/
  if scenario.steps.map(&:name).index { |s| s =~ login_regex } and logged_in
    #puts 'logging out for unique user...'
    step 'log me out'
    logged_in = false
  elsif not scenario.steps.map(&:name).index { |s| s =~ login_regex } and not logged_in
    #puts 'Logging in with standard user...'
    step 'I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!" successfully'
    logged_in = true
  end
end

After do |scenario|
  login_regex = /^I am logged into EHMP\-UI "(.*?)" as "(.*?)" with password "(.*?)" successfully$/
  if scenario.steps.map(&:name).index { |s| s =~ login_regex }
    #puts 'now logging out after unique user...'
    step 'log me out'
  end
  Capybara.reset_sessions! if Capybara.current_driver == :selenium
end

Before do |scenario|
  Capybara.use_default_driver
  scenario.source_tag_names.each do |tag|
    driver_name = tag.sub(/^@/, '').to_sym
    Capybara.current_driver = driver_name if Capybara.drivers.has_key?(driver_name)
  end
end
