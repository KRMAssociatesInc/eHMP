require "selenium-webdriver"
#  /**
#   * @author farid.zadeh
#   *
#   */
class WebDriverFactory
  def getback_web_driver
    browser_type_path = getback_environment_variables_values()
    browser_type = browser_type_path[0]
    browser_path = browser_type_path[1]
    driver = web_driver_factory(browser_type, browser_path)
    return driver
  end

  def getback_environment_variables_values
    # p ARGV
    browser_type = ''
    browser_path = ''
    ARGV.each do|argument|
    # puts "Argument: #{argument}"
      if argument.upcase.include? "BROWSERTYPE"
        browser_type = argument.split('=')
        browser_type = browser_type[1]
      elsif argument.upcase.include? "BROWSERPATH"
        browser_path = argument.split('=')
        browser_path = browser_path[1]
      end
    end
    return browser_type, browser_path
  end

  def web_driver_factory(browser_type, browser_path)
    browser_type = browser_type.upcase
    drive = nil

    if browser_type == 'SAFARI'
      # ignor for now
      p 'run SAFARI'
    # driver = Selenium::WebDriver.for :safari
    # driver.navigate.to "http://apple.com"
    elsif browser_type == 'IE'
      # ignor for now
      p 'run IE'
      driver = Selenium::WebDriver.for :ie

    elsif browser_type == 'CHROME'
      # install chromedriver with brew
      # $> brew install chromedriver
      # browser_path = './Applications/Google Chrome.app/Contents/MacOS'

      p 'run Chrome'
      driver = Selenium::WebDriver.for :chrome
    # profile = Selenium::WebDriver::Chrome::Profile.new
    # profile['download.prompt_for_download'] = false
    # profile['download.default_directory'] = browser_path
    # driver = Selenium::WebDriver.for :chrome, :profile => profile

    elsif browser_type == 'PHANTOMJS'
      # ignor for now
      p 'run PhantomJS'
      driver = Selenium::WebDriver.for :phantomjs
    # driver = Watir::Browser.new :safari
    # Phantomjs.run('./path/to/script.js') # => returns stdout
    # driver = Selenium::WebDriver.for(:remote, :url => "http://localhost:9134")

    elsif browser_type == 'HTMLUNIT'
      p 'run HtmlUnit'
      driver = Selenium::WebDriver.for :remote, :url => "http://localhost:4444/wd/hub", :desired_capabilities => :htmlunit
    else
      p 'run firefox'
      # require "selenium-webdriver"
      driver = Selenium::WebDriver.for :firefox
    end
    return driver
  end

# driver =  web_driver_factory()
# driver.navigate.to "https://jlv.vistacore.us/jlv/"
end
