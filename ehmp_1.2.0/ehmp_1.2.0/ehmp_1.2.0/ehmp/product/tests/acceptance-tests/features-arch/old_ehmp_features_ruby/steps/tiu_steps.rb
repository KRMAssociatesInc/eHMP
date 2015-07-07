When(/^the client requests documents for the patient "(.*?)" in JDS$/) do |pid|
  # path = "http://10.2.2.110:9080/vpr/9E7A;3/index/document"
  # path = http://10.2.2.110:9080/data/find/asu-rule
  base_jds_url = DefaultLogin.jds_url
  p jds_path = "#{base_jds_url}/vpr/#{pid}/index/document"
  p rule_path = "#{base_jds_url}/data/find/asu-rule"
  p doc_def_path = "#{base_jds_url}/data/find/doc-def"
  @response_jds = nil
  @response_jds = HTTPartyWithBasicAuth.get_with_authorization(jds_path)
  fail "Syne time out error" if @response_jds == nil
  
  @response_rule = nil
  @response_asu_rule = HTTPartyWithBasicAuth.get_with_authorization(rule_path)
  fail "Syne time out error" if @response_asu_rule == nil
  
  @response_doc_def = nil
  @response_doc_def = HTTPartyWithBasicAuth.get_with_authorization(doc_def_path)
  fail "Syne time out error" if @response_doc_def == nil
end

Then(/^application should enforce ASU Rules to docDef UID and use the same TIU rule as the parent$/) do
  json_objects = JSON.parse(@response_jds.body)
  json_objects = json_objects['data']['items']
  
  rule_objects = JSON.parse(@response_asu_rule.body)
  asu_rule_objects = rule_objects['data']['items']
  
  doc_def_objects = JSON.parse(@response_doc_def.body)
  doc_def_objects = doc_def_objects['data']['items']
 
  json_objects.each do |json_object|
    @document_def_uid = nil
    @status_name = nil   
    site_is_9e7a_or_c877 = check_documentdefuid_is_not_nil_and_part_of_9e7a_or_c877(json_object)

    check_rule(asu_rule_objects, doc_def_objects) if site_is_9e7a_or_c877 == true       
  end
end

def check_documentdefuid_is_not_nil_and_part_of_9e7a_or_c877(json_object)
  result = false
  if json_object['documentDefUid'] == nil
    check_site_is_not_9e7a_or_c877_when_nil(json_object)
  else
    document_def_uid = json_object['documentDefUid']
    result = check_documentdefuid_is_part_of_9e7a_or_c877(json_object)
  end
  return result
end

def check_site_is_not_9e7a_or_c877_when_nil(json_object)
  uid_parts = json_object['uid'].split(':')
  fail "There is no documentDefUid value for #{uid_parts[3]}" if %w[9E7A C877].include? uid_parts[3] 
end
  
def check_documentdefuid_is_part_of_9e7a_or_c877(json_object)
  result = false
  # p '---------------'
  @document_def_uid = json_object['documentDefUid']
  # p @document_def_uid
  # p @document_def_uid = "urn:va:doc-def:C877:17"
  documentdefuid_parts = @document_def_uid.split(':')
  site_name_part_of_documentdefuid = documentdefuid_parts[3]
  if %w[9E7A C877].include? site_name_part_of_documentdefuid
    result = true
    @status_name = json_object["status"]
    # p @status_name
    # p @status_name = "UNSIGNED"
  end
  return result
end

def check_rule(asu_rule_objects, doc_def_objects)
  check_last_part_of_documentdefuid_must_be_numeric(@document_def_uid) 
      
  check_rule_and_action_name_and_status(asu_rule_objects, doc_def_objects)
end

def check_last_part_of_documentdefuid_must_be_numeric(document_def_uid)
  documentdefuid_parts = document_def_uid.split(':')
  last_part_of_documentdefuid = documentdefuid_parts[4].to_i
  fail "Last part of documentdefuid is not numeric" unless last_part_of_documentdefuid.class == Fixnum
end

def check_rule_and_action_name_and_status(asu_rule_objects, doc_def_objects)
  has_parent = true
  match_found = false
  old_document_def_uid = @document_def_uid
  while has_parent == true
    documentdefuid_match_rule = check_documentdefuid_must_exist_in_the_rules_then_action_name_and_status_match(asu_rule_objects)
    if documentdefuid_match_rule
      has_parent = false
      match_found = true
    else
      has_parent = get_parent_of_documentdefuid(doc_def_objects)
    end
    
  end
  fail "There is no match. This recorde should not display for #{old_document_def_uid} with status #{@status_name} " if match_found == false
end

def check_documentdefuid_must_exist_in_the_rules_then_action_name_and_status_match(asu_rule_objects)
  match = false
  action_name = nil
  status_name = nil
  error1 =''
  asu_rule_objects.each do |rule_object|
    action_name = rule_object['actionName']
    if rule_object['docDefUid'] == @document_def_uid && rule_object['actionName'].upcase == "VIEW" && rule_object['statusName'] == @status_name
      # p 'it is true'
      match = true
      break
    end
  end
  # error1 = "or actionName: (#{action_name}) is not VIEW" unless action_name.upcase == "VIEW"
  # error = "documentdefuid: (#{document_def_uid}) does not exist in the rules" + error1 + "."
  # fail error if match == false 
  return match
end

def get_parent_of_documentdefuid(doc_def_objects)
  has_parent = false
  doc_def_objects.each do |doc_def_object|
    if doc_def_object["item"] == nil
      result = false
    else
      result = find_parent_of_documentdefuid(doc_def_object["item"]) unless doc_def_object["item"] == nil
    end
    if result == true
      @document_def_uid = doc_def_object["uid"]
      # p @document_def_uid
      has_parent = true 
      break
    end
  end
  return has_parent
end

def find_parent_of_documentdefuid(doc_def_item)
  result = false
  doc_def_item.each do |item|
    if item["uid"] != nil && item["uid"] == @document_def_uid
      result = true
      break
    end
  end
  return result
end
