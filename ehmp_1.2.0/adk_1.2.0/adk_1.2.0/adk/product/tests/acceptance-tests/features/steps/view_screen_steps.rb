def user_views_screen(url, screen_name)
  screen_url = "#{url}##{screen_name}"
  p screen_url
  TestSupport.navigate_to_url(screen_url)
end

Given(/^user views screen "(.*?)"$/) do |screen_name|
  user_views_screen(DefaultLogin.ehmpui_url, screen_name)
end

Given(/^user views screen "(.*?)" in the eHMP\-UI$/) do |screen_name|
  user_views_screen(DefaultLogin.ehmpui_url, screen_name)
end

Given(/^user views screen "(.*?)" in the ADK$/) do |screen_name|
  user_views_screen(DefaultLogin.adk_url, screen_name)
end
