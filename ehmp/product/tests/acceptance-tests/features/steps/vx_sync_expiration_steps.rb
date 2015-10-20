Given(/^save the stamp time for site\(s\) "(.*?)"$/) do |site_list|
  vx_sync = VxSync.new
  @response = vx_sync.response
  json_object = JSON.parse(@response.body)
  
  @save_site_stamp_time = find_stamp_time(site_list, json_object)
end

Then(/^the stamp time should get updated for site\(s\) "(.*?)" but Not for "(.*?)"$/) do |site_list, site_list_not_update|
  vx_sync = VxSync.new
  @response = vx_sync.response
  json_object = JSON.parse(@response.body)
  
  site_stamp_time = find_stamp_time(site_list, json_object)
  
  site_names = site_list.upcase.split";"
  site_names.each do |site_name|
    exp_stamp_time = site_stamp_time[site_name]
    got_stamp_time = @save_site_stamp_time[site_name]
    fail "For site #{site_name}: \nThe expected stamp time #{exp_stamp_time} should be greater then \n save stamp time #{got_stamp_time}" unless exp_stamp_time > got_stamp_time
  end
  
  site_stamp_time = find_stamp_time(site_list_not_update, json_object)
  
  site_names = site_list_not_update.upcase.split";"
  site_names.each do |site_name|
    exp_stamp_time = site_stamp_time[site_name]
    got_stamp_time = @save_site_stamp_time[site_name]
    fail "For site #{site_name}: \nThe expected stamp time #{exp_stamp_time} should be equal to \n save stamp time #{got_stamp_time}" unless exp_stamp_time == got_stamp_time
  end
end

def find_stamp_time(site_list, json_object)
  site_stamp_time = {}
  site_names = site_list.upcase.split";"
  site_names.each do |site_name|
    stamp_time = json_object["syncStatus"]["completedStamp"]["sourceMetaStamp"][site_name]["stampTime"]
    site_stamp_time[site_name] = stamp_time
  end
  return site_stamp_time
end
