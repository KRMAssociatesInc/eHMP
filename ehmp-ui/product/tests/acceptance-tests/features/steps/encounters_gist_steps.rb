
class EncountersGist <  ADKContainer
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("Encounter Gist Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=encounters] .panel-title"))
    add_verify(CucumberLabel.new("EncountersGridVisible"), VerifyText.new, AccessHtmlElement.new(:id, "panel-encGist"))    
    #Encounter Header Verification 
    add_verify(CucumberLabel.new("Description-header"), VerifyText.new, AccessHtmlElement.new(:css, '#encGistGrid #Description-header'))
    add_verify(CucumberLabel.new("Event-header"), VerifyText.new, AccessHtmlElement.new(:css, '#encGistGrid #Event-header'))
    add_verify(CucumberLabel.new("Age-header"), VerifyText.new, AccessHtmlElement.new(:css, '#encGistGrid #Age-header'))      
    #Encounter details at top level verification
    add_verify(CucumberLabel.new("Visits"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".encGistItem #panel--Visits #Visits"))  
    add_verify(CucumberLabel.new("Appointments"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".encGistItem #panel--Appointments #Appointments"))  
    add_verify(CucumberLabel.new("Admissions"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".encGistItem #panel--Admissions #Admissions"))  
    add_verify(CucumberLabel.new("Procedures"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".encGistItem #panel--Procedures #Procedures"))      
    #Expand encounter objects
    add_action(CucumberLabel.new("Expand_Visits"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='Visits']/descendant::*[@id='caret']")) 
    add_action(CucumberLabel.new("Expand_Procedures"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='Procedures']/descendant::*[@id='caret']"))
    add_action(CucumberLabel.new("Expand_Appointments"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='Appointments']/descendant::*[@id='caret']"))   
    add_action(CucumberLabel.new("Expand_Admissions"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='Admissions']/descendant::*[@id='caret']"))
    #expand collapse timeline  
    add_action(CucumberLabel.new("Control - applet - Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=encounters] .applet-maximize-button"))
    add_action(CucumberLabel.new("Close-Timeline"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=newsfeed] .applet-minimize-button.btn.btn-xs.btn-link"))
    #text filter  
    add_action(CucumberLabel.new("Control - applet - Filter Toggle"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=encounters] #grid-filter-button-encounters"))
    add_action(CucumberLabel.new("Control - applet - Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, "[data-appletid=encounters] .form-search input"))
    #Quick View
    add_verify(CucumberLabel.new("Quick View Table Title"), VerifyText.new, AccessHtmlElement.new(:css, ".overview .popover-title"))
    #menu
    add_action(CucumberLabel.new("Quick View Icon"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=encounters] div.toolbarActive #quick-look-button-toolbar"))
    add_action(CucumberLabel.new("Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=encounters] div.toolbarActive #detailView-button-toolbar"))
    #modal title
    add_verify(CucumberLabel.new("Main Modal Label"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))       
    add_verify(CucumberLabel.new("Modal Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, "modal-body"))
  end
end 

class VisitObject <  ADKContainer
  include Singleton
  def initialize
    super   
    #Visit expand Header Verification 
    add_verify(CucumberLabel.new("Visit Type Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersVisits-event-gist']/descendant::*[@id='name-header']"))
    add_verify(CucumberLabel.new("Hx Occurrence Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersVisits-event-gist']/descendant::*[@id='count-header1']"))
    add_verify(CucumberLabel.new("Last Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersVisits-event-gist']/descendant::*[@id='count-header2']"))
    
    #Visit expand view details  
    add_verify(CucumberLabel.new("GENERAL INTERNAL MEDICINE"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersVisits-event-gist #event_name_encounters-Visit-GENERALINTERNALMEDICINE'))
    add_verify(CucumberLabel.new("GENERAL INTERNAL MEDICINE Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersVisits-event-gist #encounter_count_encounters-Visit-GENERALINTERNALMEDICINE'))
    add_verify(CucumberLabel.new("GENERAL INTERNAL MEDICINE Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersVisits-event-gist #time_since_encounters-Visit-GENERALINTERNALMEDICINE'))
      
    add_verify(CucumberLabel.new("CARDIOLOGY"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersVisits-event-gist #event_name_encounters-Visit-CARDIOLOGY'))
    add_verify(CucumberLabel.new("CARDIOLOGY Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersVisits-event-gist #encounter_count_encounters-Visit-CARDIOLOGY'))
    add_verify(CucumberLabel.new("CARDIOLOGY Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersVisits-event-gist #time_since_encounters-Visit-CARDIOLOGY'))
      
    #Visit right and left click
    add_action(CucumberLabel.new("Visits Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#panel--Visits #button_Visits"))
    add_action(CucumberLabel.new("Visit Type-GENERAL INTERNAL MEDICINE Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#encountersVisits-event-gist #quickLook_encounters-Visit-GENERALINTERNALMEDICINE"))
    #add_action(CucumberLabel.new("Visit Type-GENERAL INTERNAL MEDICINE Left Click"), ClickAction.new, AccessHtmlElement.new(:css, "#encountersVisits-event-gist #event_name_encounters-Visit-GENERALINTERNALMEDICINE"))      
    visit_tab_id_left = 'event_name_encounters-Visit-GENERALINTERNALMEDICINE'
  #  add_action(CucumberLabel.new("Visit Type-GENERAL INTERNAL MEDICINE Left Click"), FocusInAction.new(visit_tab_id_left), AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{visit_tab_id_left}"))
    add_action(CucumberLabel.new("Visit Type-GENERAL INTERNAL MEDICINE Left Click"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{visit_tab_id_left}"))
    
    #sorting header definitions  
    add_action(CucumberLabel.new("Visit Type Header"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersVisits-event-gist']/descendant::*[@id='name-header']"))
    add_action(CucumberLabel.new("Hx Occurrence Header"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersVisits-event-gist']/descendant::*[@id='count-header1']"))
    add_action(CucumberLabel.new("Last Header"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersVisits-event-gist']/descendant::*[@id='count-header2']"))
    
    #Quick View closing
    add_verify(CucumberLabel.new("Quick View Visits"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters_tooltip_Visits"))
    add_verify(CucumberLabel.new("Quick View Visit Type"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters-Visit-GENERALINTERNALMEDICINE"))    
  end
end         

class ProcedureObject <  ADKContainer
  include Singleton
  def initialize
    super 
    #Procedures expand Header Verification 
    # add_verify(CucumberLabel.new("Procedure name Header"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #name-header'))
    # add_verify(CucumberLabel.new("Hx Occurrence Header"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #count-header1'))
    # add_verify(CucumberLabel.new("Last Header"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #count-header2'))
    add_verify(CucumberLabel.new("Procedure name Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersProcedures-event-gist']/descendant::*[@id='name-header']"))
    add_verify(CucumberLabel.new("Hx Occurrence Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersProcedures-event-gist']/descendant::*[@id='count-header1']"))
    add_verify(CucumberLabel.new("Last Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersProcedures-event-gist']/descendant::*[@id='count-header2']"))
    
    #Procedures expand view details  
    add_verify(CucumberLabel.new("PULMONARY FUNCTION INTERPRET"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #event_name_encounters-Procedure-PULMONARYFUNCTIONINTERPRET'))
    add_verify(CucumberLabel.new("PULMONARY FUNCTION INTERPRET Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #encounter_count_encounters-Procedure-PULMONARYFUNCTIONINTERPRET'))
    add_verify(CucumberLabel.new("PULMONARY FUNCTION INTERPRET Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #time_since_encounters-Procedure-PULMONARYFUNCTIONINTERPRET'))
      
    add_verify(CucumberLabel.new("PULMONARY FUNCTION TEST"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #event_name_encounters-Procedure-PULMONARYFUNCTIONTEST'))
    add_verify(CucumberLabel.new("PULMONARY FUNCTION TEST Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #encounter_count_encounters-Procedure-PULMONARYFUNCTIONTEST'))
    add_verify(CucumberLabel.new("PULMONARY FUNCTION TEST Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersProcedures-event-gist #time_since_encounters-Procedure-PULMONARYFUNCTIONTEST'))
      
    #Procedures right and left click
    add_action(CucumberLabel.new("Procedures Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#panel--Procedures #button_Procedures"))
    add_action(CucumberLabel.new("Procedure Name-PULMONARY FUNCTION INTERPRET Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#encountersProcedures-event-gist #quickLook_encounters-Procedure-PULMONARYFUNCTIONINTERPRET"))      
    procedure_tab_id_left = 'event_name_encounters-Procedure-PULMONARYFUNCTIONINTERPRET'
#    add_action(CucumberLabel.new("Procedure Name-PULMONARY FUNCTION INTERPRET Left Click"), FocusInAction.new(procedure_tab_id_left), AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{procedure_tab_id_left}"))
   
    add_action(CucumberLabel.new("Procedure Name-PULMONARY FUNCTION INTERPRET Left Click"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{procedure_tab_id_left}"))
      
    #Quick View closing
    add_verify(CucumberLabel.new("Quick View Procedures"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters_tooltip_Procedures"))
    add_verify(CucumberLabel.new("Quick View Procedure Name"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters-Procedure-PULMONARYFUNCTIONINTERPRET"))        
  end
end    

class AppointmentObject <  ADKContainer
  include Singleton
  def initialize
    super 
    #Appointments expand Header Verification 
    add_verify(CucumberLabel.new("Appointment Type Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersAppointments-event-gist']/descendant::*[@id='name-header']"))
    add_verify(CucumberLabel.new("Hx Occurrence Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersAppointments-event-gist']/descendant::*[@id='count-header1']"))
    add_verify(CucumberLabel.new("Last Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersAppointments-event-gist']/descendant::*[@id='count-header2']"))
      
    #Appointments expand view details  
    add_verify(CucumberLabel.new("GENERAL INTERNAL MEDICINE"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAppointments-event-gist #event_name_encounters-Appointment-GENERALINTERNALMEDICINE'))
    add_verify(CucumberLabel.new("GENERAL INTERNAL MEDICINE Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAppointments-event-gist #encounter_count_encounters-Appointment-GENERALINTERNALMEDICINE'))
    add_verify(CucumberLabel.new("GENERAL INTERNAL MEDICINE Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAppointments-event-gist #time_since_encounters-Appointment-GENERALINTERNALMEDICINE'))
      
    #Appointment right and left click
    add_action(CucumberLabel.new("Appointments Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#panel--Appointments #button_Appointments"))
    add_action(CucumberLabel.new("Appointment Type-GENERAL INTERNAL MEDICINE Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#encountersAppointments-event-gist #quickLook_encounters-Appointment-GENERALINTERNALMEDICINE"))      
    appointment_tab_id_left = 'event_name_encounters-Appointment-GENERALINTERNALMEDICINE'
   # add_action(CucumberLabel.new("Appointment Type-GENERAL INTERNAL MEDICINE Left Click"), FocusInAction.new(appointment_tab_id_left), AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{appointment_tab_id_left}"))
      
    add_action(CucumberLabel.new("Appointment Type-GENERAL INTERNAL MEDICINE Left Click"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{appointment_tab_id_left}"))
      
    #Quick View closing
    add_verify(CucumberLabel.new("Quick View Appointments"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters_tooltip_Appointments"))
    add_verify(CucumberLabel.new("Quick View Appointment Type"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters-Appointment-GENERALINTERNALMEDICINE"))        
  end
end    

class AdmissionObject <  ADKContainer
  include Singleton
  def initialize
    super 
    #Admissions expand Header Verification 
    add_verify(CucumberLabel.new("Diagnosis Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersAdmissions-event-gist']/descendant::*[@id='name-header']"))
    add_verify(CucumberLabel.new("Hx Occurrence Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersAdmissions-event-gist']/descendant::*[@id='count-header1']"))
    add_verify(CucumberLabel.new("Last Header"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='encountersAdmissions-event-gist']/descendant::*[@id='count-header2']"))
      
    #Admissions expand view details  
    add_verify(CucumberLabel.new("SLKJFLKSDJF"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAdmissions-event-gist #event_name_encounters-Admission-SLKJFLKSDJF'))
    add_verify(CucumberLabel.new("SLKJFLKSDJF Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAdmissions-event-gist #encounter_count_encounters-Admission-SLKJFLKSDJF'))
    add_verify(CucumberLabel.new("SLKJFLKSDJF Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAdmissions-event-gist #time_since_encounters-Admission-SLKJFLKSDJF'))
      
    add_verify(CucumberLabel.new("OBSERVATION"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAdmissions-event-gist #event_name_encounters-Admission-OBSERVATION'))
    add_verify(CucumberLabel.new("OBSERVATION Hx Occurrence"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAdmissions-event-gist #encounter_count_encounters-Admission-OBSERVATION'))
    add_verify(CucumberLabel.new("OBSERVATION Last"), VerifyText.new, AccessHtmlElement.new(:css, '#encountersAdmissions-event-gist #time_since_encounters-Admission-OBSERVATION'))
      
    #Admissions right and left click
    add_action(CucumberLabel.new("Admissions Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#panel--Admissions #button_Admissions"))
    add_action(CucumberLabel.new("Diagnosis-OBSERVATION Right Click"), ClickAction.new, AccessHtmlElement.new(:css, "#encountersAdmissions-event-gist #quickLook_encounters-Admission-OBSERVATION"))      
    admission_tab_id_left = 'event_name_encounters-Admission-OBSERVATION'
#    add_action(CucumberLabel.new("Diagnosis-OBSERVATION Left Click"), FocusInAction.new(admission_tab_id_left), AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{admission_tab_id_left}"))
    
    add_action(CucumberLabel.new("Diagnosis-OBSERVATION Left Click"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='encounters'] ##{admission_tab_id_left}"))
      
    #Quick View closing
    add_verify(CucumberLabel.new("Quick View Admissions"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters_tooltip_Admissions"))
    add_verify(CucumberLabel.new("Quick View Diagnosis"), VerifyText.new, AccessHtmlElement.new(:css, "#encounters-Admission-OBSERVATION"))        
  end
end    

Then(/^the Encounters Gist Applet details view has headers$/) do |table|
  aa = EncountersGist.instance
  
  expect(aa.wait_until_action_element_visible("EncountersGridVisible", DefaultLogin.wait_time)).to be_true
    
  table.rows.each do | row |
    expect(aa.perform_verification(row[0]+"-header", row[1])).to be_true, "The value #{row[0]} is not present in the encounter detail headers"
  end
end

Then(/^the Encounters Gist Applet detail view contains$/) do |table|
  aa = EncountersGist.instance  
  expect(aa.wait_until_action_element_visible("EncountersGridVisible", DefaultLogin.wait_time)).to be_true    
  table.rows.each do | row |
    expect(aa.perform_verification(row[0], row[0])).to be_true, "The value #{row[0]} is not present in the encounter Description"
    expect(aa.perform_verification(row[0], row[1])).to be_true, "The value #{row[1]} is not present in the encounter Hx Occurrence"
    expect(aa.perform_verification(row[0], row[2])).to be_true, "The value #{row[2]} is not present in the encounter Last"
  end
end

Then(/^user sees Encounters Gist$/) do 
  aa = EncountersGist.instance 
  expect(aa.wait_until_action_element_visible("Encounter Gist Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Encounter Gist Title", "ENCOUNTERS")).to be_true
end

def arrow_position(xpath, expected_arrow_position)
  driver = TestSupport.driver
  arrow_position = driver.find_element(:xpath, xpath).attribute("arrowposition")
  return arrow_position.eql? expected_arrow_position
rescue Exception => e
  p "#{e}"
  return false
end

Then(/^there is a dynamic arrow next to visits in Encounters Gist Applet$/) do
  aa = EncountersGist.instance 
  
  expect(aa.wait_until_action_element_visible("Encounter Gist Title", DefaultLogin.wait_time)).to be_true
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { arrow_position "//*[@id='Visits']/descendant::*[@id='caret']", 'right' }
  #arrow_position = driver.find_element(:css, "#panel--Visits--head #Visits #caret").attribute("arrowposition")
  #expect(arrow_position).to eq("right")
end

When(/^the user expands "(.*?)" in Encounters Gist Applet$/) do | element |
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible("Expand_"+element, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Expand_"+element, "")).to be_true, "#{element} could not be expanded"
end

When(/^the user expands "(.*?)" in Encounters Gist Applet with css$/) do | element |
  aa = EncountersGist.instance
  procedure_access = AccessHtmlElement.new(:css, '[data-appletid=encounters] #Procedures #caret')
  aa.add_action(CucumberLabel.new('Procedure with css'), ClickAction.new, procedure_access)
  expect(aa.perform_action('Procedure with css')).to be_true, "#{element} could not be expanded"
end

When(/^the user expands "(.*?)" in Encounters Gist Applet with xpath$/) do | element |
  aa = EncountersGist.instance
  procedure_access = AccessHtmlElement.new(:xpath, "//div[@id='Procedures']/descendant::*[@id='caret']")
  aa.add_action(CucumberLabel.new('Procedure with xpath'), ClickAction.new, procedure_access)
  expect(aa.perform_action('Procedure with xpath')).to be_true, "#{element} could not be expanded"
end

Then(/^Encounters Gist Applet "(.*?)" grouping expanded view contains headers$/) do |object_type, table|
  case object_type
  when 'Visits'
    aa = VisitObject.instance
  when 'Procedures'
    aa = ProcedureObject.instance
  when 'Appointments'
    aa = AppointmentObject.instance
  when 'Admissions'
    aa = AdmissionObject.instance
  else
    fail "**** No function found! Check your script ****"
  end
 
  expected_headers = table.headers
  for i in 0...expected_headers.size do
    p expected_headers[i]
    expect(aa.perform_verification(expected_headers[i] + " Header", expected_headers[i])).to be_true, "Header #{expected_headers[0]} is not present in the #{object_type}"
  end
end

Then(/^the Encounters Gist Applet "(.*?)" grouping expanded view contains$/) do |object_type, table|
  case object_type
  when 'Visits'
    aa = VisitObject.instance
  when 'Procedures'
    aa = ProcedureObject.instance
  when 'Appointments'
    aa = AppointmentObject.instance
  when 'Admissions'
    aa = AdmissionObject.instance
  else
    fail "**** No function found! Check your script ****"
  end
  expected_headers = table.headers
  table.rows.each do | row |
    expect(aa.perform_verification(row[0], row[0])).to be_true, "The value #{row[0]} is not present in the encounter #{object_type}"
    expect(aa.perform_verification(row[0] + " #{expected_headers[1]}", row[1])).to be_true, "The value #{row[1]} is not present in the encounter #{object_type}"
    expect(aa.perform_verification(row[0] + " #{expected_headers[2]}", row[2])).to be_true, "The value #{row[2]} is not present in the encounter #{object_type}"
  end  
end

When(/^user exits the Timeline Applet$/) do
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible("Close-Timeline", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Close-Timeline", "")).to be_true, "Could not exit Timeline applet"
end

When(/^the user closes the search filter in Encounters Gist Applet$/) do
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible("Control - applet - Filter Toggle", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Control - applet - Filter Toggle", "")).to be_true, "Could not clear search filter"
end

When(/^user hovers over and selects the right side of the "(.*?)" tile$/) do |object_type|
  case object_type
  when 'Visits'
    aa = VisitObject.instance
  when 'Procedures'
    aa = ProcedureObject.instance
  when 'Appointments'
    aa = AppointmentObject.instance
  when 'Admissions'
    aa = AdmissionObject.instance
  else
    fail "**** No function found! Check your script ****"
  end
  expect(aa.wait_until_action_element_visible(object_type + " Right Click", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(object_type + " Right Click", "")).to be_true, "Could not select the right side of the object #{object_type}"
end

Then(/^quick view table with title "(.*?)" appears$/) do |object_type|
  aa = EncountersGist.instance
  expect(aa.perform_verification("Quick View Table Title", object_type)).to be_true, "The title #{object_type} is not present in the encounter quick view table"
end

When(/^user clicks on the "(.*?)" hand side of the "(.*?)" "(.*?)"$/) do |direction, object_type, object_type_value|
  case object_type
  when 'Visit Type'
    aa = VisitObject.instance
  when 'Procedure Name'
    aa = ProcedureObject.instance
  when 'Appointment Type'
    aa = AppointmentObject.instance
  when 'Diagnosis'
    aa = AdmissionObject.instance
  else
    fail "**** No function found! Check your script ****"
  end
  string_value = object_type + "-" + object_type_value + " " + direction + " Click"
  p "string_value = #{string_value}"
  expect(aa.wait_until_action_element_visible(string_value, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(string_value, "")).to be_true, "Could not select the left side of the object #{object_type} and #{object_type_value}"
end

Then(/^a Menu appears on the Encounters Gist$/) do
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible("Quick View Icon", DefaultLogin.wait_time)).to be_true, "Menu with Quick View icon is not displayed"
  expect(aa.wait_until_action_element_visible("Detail View Icon", DefaultLogin.wait_time)).to be_true, "Menu Detail View icon is not displayed"    
end

When(/^user select the menu "(.*?)" in Encounters Gist$/) do | icon_type |
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible(icon_type, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(icon_type, "")).to be_true, "#{icon_type} can't be clicked"
end

Then(/^it should show the detail modal of the most recent encounter$/) do
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible("Main Modal Label", DefaultLogin.wait_time)).to be_true
end

Then(/^the "(.*?)" modal contains data$/) do |object_type, table|
  aa = EncountersGist.instance
  table.rows.each do | row |
    expect(aa.perform_verification("Modal Details", row[0])).to be_true, "The #{row[0]} not found in the #{object_type} modal details"
    expect(aa.perform_verification("Modal Details", row[1])).to be_true, "The #{row[1]} not found in the #{object_type} modal details"
  end
end

Then(/^Quick View draw box for "(.*?)" closes$/) do |object_type|
  case object_type
  when 'Visits'
    aa = VisitObject.instance
  when 'Visit Type'
    aa = VisitObject.instance
  when 'Procedures'
    aa = ProcedureObject.instance
  when 'Procedure Name'
    aa = ProcedureObject.instance
  when 'Appointments'
    aa = AppointmentObject.instance
  when 'Appointment Type'
    aa = AppointmentObject.instance
  when 'Admissions'
    aa = AdmissionObject.instance
  when 'Diagnosis'
    aa = AdmissionObject.instance
  else
    fail "**** No function found! Check your script ****"
  end

  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { !aa.am_i_visible?("Quick View " + object_type) }
end

When(/^user clicks on the column header "(.*?)" in Encounters Gist$/) do | name_column_header |
  aa = VisitObject.instance
  expect(aa.wait_until_action_element_visible(name_column_header + " Header", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(name_column_header + " Header", "")).to be_true
end

Then(/^"(.*?)" column is sorted in ascending order in Encounters Gist$/) do |column_name|
  aa = EncountersGist.instance
  driver = TestSupport.driver
  column_values_array = []
    
  expect(aa.wait_until_action_element_visible("EncountersGridVisible", DefaultLogin.wait_time)).to be_true
  
  case column_name
  when 'Visit Type'
    element_column_values = driver.find_elements(css: '#encountersVisits-event-gist-items div.col-sm-8.problem-name')
  when 'Hx Occurrence'
    element_column_values = driver.find_elements(css: '#encountersVisits-event-gist-items div.eventsCount.col-sm-2.counter2.text-center')
  else
    fail "**** No function found! Check your script ****"
  end

  element_column_values.each do | row |
#    print "selenium data ----"
#    p row.text
    if column_name == "Hx Occurrence"
      column_values_array << row.text.downcase.to_i
    else
      column_values_array << row.text.downcase
    end
  end

  (column_values_array == column_values_array.sort { |x, y| x <=> y }).should == true

end

Then(/^"(.*?)" column is sorted in descending order in Encounters Gist$/) do |column_name|
  aa = EncountersGist.instance
  driver = TestSupport.driver
  column_values_array = []
  expect(aa.wait_until_action_element_visible("EncountersGridVisible", DefaultLogin.wait_time)).to be_true   
 
  case column_name
  when 'Visit Type'
    element_column_values = driver.find_elements(css: '#encountersVisits-event-gist-items div.col-sm-8.problem-name')
  when 'Hx Occurrence'
    element_column_values = driver.find_elements(css: '#encountersVisits-event-gist-items div.eventsCount.col-sm-2.counter2.text-center')
  else
    fail "**** No function found! Check your script ****"
  end
     
  element_column_values.each do | row |
#    print "selenium data ----"
#    p row.text
    if column_name == "Hx Occurrence"
      column_values_array << row.text.downcase.to_i
    else
      column_values_array << row.text.downcase
    end
  end
  
  (column_values_array == column_values_array.sort { |x, y| y <=> x }).should == true
end

Then(/^Last column is sorted in "(.*?)" order in Encounters Gist$/) do |arg1, table|
  aa = EncountersGist.instance
  driver = TestSupport.driver
  expect(aa.wait_until_action_element_visible("EncountersGridVisible", DefaultLogin.wait_time)).to be_true
  element_column_values = driver.find_elements(css: '#encountersVisits-event-gist-items div.eventsTimeSince.counter2.text-center')
  column_values_array = []
 
  element_column_values.each do | row |
#    print "selenium data ----"
#    p row.text
    column_values_array << row.text.downcase
  end
  
  cucumber_array = table.headers  
  (column_values_array == cucumber_array).should == true
end

class SpecificEncounterRows < AccessBrowserV2
  include Singleton
  def initialize
    super
    applet_toolbar_xpath = "preceding-sibling::div[@class='appletToolbar']"

    pulmonary_function_interpret_xpath = "//*[@id='event_encounters-Procedure-PULMONARYFUNCTIONINTERPRET']"
    add_action(CucumberLabel.new("PULMONARY FUNCTION INTERPRET Info View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{pulmonary_function_interpret_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='info-button-toolbar']"))
    add_action(CucumberLabel.new("PULMONARY FUNCTION INTERPRET Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{pulmonary_function_interpret_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='detailView-button-toolbar']"))
    add_action(CucumberLabel.new("PULMONARY FUNCTION INTERPRET Quick View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{pulmonary_function_interpret_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='quick-look-button-toolbar']"))
 

    #GENERAL INTERNAL MEDICINE
    pulmonary_function_interpret_xpath = "//*[@id='event_encounters-Appointment-GENERALINTERNALMEDICINE']"
    add_action(CucumberLabel.new("GENERAL INTERNAL MEDICINE Info View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{pulmonary_function_interpret_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='info-button-toolbar']"))
    add_action(CucumberLabel.new("GENERAL INTERNAL MEDICINE Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{pulmonary_function_interpret_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='detailView-button-toolbar']"))
    add_action(CucumberLabel.new("GENERAL INTERNAL MEDICINE Quick View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{pulmonary_function_interpret_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='quick-look-button-toolbar']"))
 
    #event_name_encounters-Admission-OBSERVATION
    observation_xpath = "//*[@id='event_encounters-Admission-OBSERVATION']"
    add_action(CucumberLabel.new("OBSERVATION Info View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{observation_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='info-button-toolbar']"))
    add_action(CucumberLabel.new("OBSERVATION Detail View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{observation_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='detailView-button-toolbar']"))
    add_action(CucumberLabel.new("OBSERVATION Quick View Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{observation_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='quick-look-button-toolbar']"))
 
  end
end

Then(/^a Menu appears on the Encounters Gist for the item "(.*?)"$/) do |arg1|
  aa = EncountersGist.instance
  expect(aa.wait_until_action_element_visible("EncountersGridVisible", DefaultLogin.wait_time)).to be_true
  ser = SpecificEncounterRows.instance
#  expect(ser.wait_until_action_element_visible("#{arg1} Info View Icon", DefaultLogin.wait_time)).to be_true, "Info view icon is not displayed"
  expect(ser.wait_until_action_element_visible("#{arg1} Detail View Icon", DefaultLogin.wait_time)).to be_true, "Detail view icon is not displayed"
  expect(ser.wait_until_action_element_visible("#{arg1} Quick View Icon", DefaultLogin.wait_time)).to be_true, "Quick view icon is not displayed"    
end

Then(/^user selects the "(.*?)" detail icon in Encounters Gist$/) do |arg1|
  ser = SpecificEncounterRows.instance
  label = "#{arg1} Detail View Icon"
  expect(ser.perform_action(label)).to be_true
end

Then(/^user selects the "(.*?)" quick view icon in Encounters Gist$/) do |arg1|
  ser = SpecificEncounterRows.instance
  label = "#{arg1} Quick View Icon"
  p label
  expect(ser.perform_action(label)).to be_true
end
