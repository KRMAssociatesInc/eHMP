class AppletCarousel < AccessBrowserV2
  include Singleton
  def initialize
    super 
    add_action(CucumberLabel.new("Allergies"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div/div[1]")) 
    add_action(CucumberLabel.new("Health"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div/div[1]"))
    add_action(CucumberLabel.new("First Allergies Preview"), ClickAction.new, AccessHtmlElement.new(:id, "475c174e6b26"))
    add_action(CucumberLabel.new("Health Summaries"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='gridster2']/ul/li/div/div[2]/p"))
    add_action(CucumberLabel.new("VistA Health Summaries"), ClickAction.new, AccessHtmlElement.new(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(15)"))
    add_action(CucumberLabel.new("VistA Health Summaries Summary"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div[2]/p"))
    add_verify(CucumberLabel.new("Applet Carousel"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#applets-carousel"))
  end
end #AppletCarousel

#Carousel drag commands for the applet carousel 
Then(/^drag and drop the Allergies right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(1)")
  perform_drag(applet_preview, right_by, down_by)
  sleep(5)
end

Then(/^drag and drop the Appointments & Visits right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(2)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Clinical Reminders right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(3)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Community Health Summaries right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(4)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Conditions right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Applet Carousel")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(5)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Documents right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(6)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Encounters right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(7)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Immunizations right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(8)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Lab Results right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Applet Carousel")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(9)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Medications right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(10)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Medications Review right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(11)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Orders right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Applet Carousel")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(12)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Timeline right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(13)")
  perform_drag(applet_preview, right_by, down_by)
end

Then(/^drag and drop the Vitals right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  wait_until_loaded("Allergies")
  applet_preview = driver.find_element(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(14)")
  perform_drag(applet_preview, right_by, down_by)
end

# Then(/^drag and drop the Stacked Graph right by (\d+) and down by (\d+)$/) do |right_by, down_by|
#   driver = TestSupport.driver
#   sleep 5
#   wait_until_loaded("Applet Carousel")
#   applet_preview = driver.find_element(:css, "#data-appletid='stackedGraph'")
#   perform_drag(applet_preview, right_by, down_by)
# end

def wait_until_loaded(element)
  navigation = AppletCarousel.instance
  navigation.wait_until_action_element_visible(element, 60)
end

def perform_drag(applet_preview, right_by, down_by)
  driver = TestSupport.driver
  driver.action.drag_and_drop_by(applet_preview, right_by, down_by).perform
end

#Drags VistA Health Summaries" applet from carousel to user defined screen
When(/^the user drags and drops the VistA Health Summaries right by "(.*?)" and down by "(.*?)"$/) do |arg1, arg2|
  driver = TestSupport.driver
  #wait_until_loaded("VistA Health Summaries")
  #Peng Han -- adding the following code 
  thumbnails = driver.find_elements(:xpath,  "//div[@class='item active']/div").size
  workspaces = driver.find_elements(:xpath, "//ol[@class='carousel-indicators pagination']/li").size
  puts thumbnails
  puts workspaces
  j = 1
  h = 0
  outer = 0
  HS = "VistA Health Summaries"
  while j <= workspaces 
    i = 1
    while i <= thumbnails 
      sleep(3)
      if HS == driver.find_element(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div[#{j}]/div[#{i}]/p").text
        flag = true
        h = i
        break
      else
        i = i+1
      end
    end  
    if flag
      outer = j
      break
    end  
    sleep(3)
    driver.find_element(:xpath, "//*[@id='applets-carousel']/div[1]/div[3]/a/span").click
    j = j + 1
  end
  
  sleep(3)
  applet_preview = driver.find_element(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div[#{outer}]/div[#{h}]/p")
  perform_drag(applet_preview, arg1, arg2)
  #sleep(5)
end

When(/^drag and drop the Stacked Graph right by (\d+) and down by (\d+)$/) do |arg1, arg2|
  driver = TestSupport.driver
  #wait_until_loaded("VistA Health Summaries")
  #Peng Han -- adding the following code 
  thumbnails = driver.find_elements(:xpath,  "//div[@class='item active']/div").size
  workspaces = driver.find_elements(:xpath, "//ol[@class='carousel-indicators pagination']/li").size
  #puts thumbnails
  #puts workspaces
  j = 1
  SG = "Stacked Graphs"
  while j <= workspaces 
    i = 1
    while i <= thumbnails 
      sleep(3)
      if SG == driver.find_element(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div[#{j}]/div[#{i}]/p").text
        flag = true
        break
      else
        i = i+1
      end
    end  
    break if flag
    sleep(3)
    driver.find_element(:xpath, "//*[@id='applets-carousel']/div[1]/div[3]/a/span").click
    j = j + 1
  end
  
  sleep(3)
  applet_preview = driver.find_element(:xpath, "//*[@id='applets-carousel']/div[1]/div[2]/div[2]/div[2]/p")
  perform_drag(applet_preview, arg1, arg2)
  #sleep(5)
end

