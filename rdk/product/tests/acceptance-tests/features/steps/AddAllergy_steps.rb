When(/^the client marks the saved allergy as Entered in Error for patient "(.*?)" with comment "(.*?)"$/) do |pid, comment|
  path = String.new(DefaultLogin.rdk_writeback_url)
  content = {
    param: {
      comments: comment,
      uid: @uid
    }
  }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path + "/resource/writeback/allergy/error/save?pid=#{pid}", content.to_json, { "Content-Type" => "application/json" })
end

When(/^the client saves an allergy for patient "(.*?)" with content "(.*?)"$/) do |pid, content|
  path = String.new(DefaultLogin.rdk_writeback_url)
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path+"/resource/writeback/allergy/save?pid=#{pid}", content, { "Content-Type"=>"application/json" })
end

Then(/^the VPR result has a uid$/) do |table|
  json = JSON.parse(@response.body)
  items = json['data']['items']
  @uid = get_uid_from_json(items, table)
  expect(@uid.length).to_not eq(0)
  p "allergy uid = " + @uid
end

Then(/^the VPR results do not contain$/) do |table|
  json = JSON.parse(@response.body)
  items = json['data']['items']
  verify = JsonVerifier.new
  table.rows.each do |field_path, field_value_string|
    verify.reset_output
    found = verify.build_subarray(field_path, field_value_string, items)
    items = verify.subarry

    expect(found).to be_false
  end
end

Then(/^the response includes a document id for the Entered in Error note$/) do
  @document_id = JSON.parse(@response.body)['data']['result'].split('^')[1]
  expect(@document_id.length).to_not eq(0)
  p "document id = " + @document_id
end

Then(/^the VPR results contain a document with the returned id$/) do
  json = JSON.parse(@response.body)
  items = json['data']['items']
  found = false
  items.each do |item|
    # document id will be in format urn:va:document:<sitehash>:<dfn>:<@document_id>
    if item['uid'] =~ /urn:va:document:\w{4}:\d*:@document_id/
      found = true
    end
  end
  expect(found).to be_true
end

def get_uid_from_json(result_array, table)
  verify = JsonVerifier.new
  found = false
  table.rows.each do |field_path, field_value_string|
    verify.reset_output
    if field_value_string.start_with? "IS_NOT_SET"
      new_array = []
      result_array.each do |item|
        if item[field_path].class == NilClass
          new_array.push(item)
          found = true
        end
      end
      result_array = new_array
    else
      found = verify.build_subarray(field_path, field_value_string, result_array)
      result_array = verify.subarry
    end
  end

  if found == true
    return result_array[0]['uid']
  end
  return false
end
