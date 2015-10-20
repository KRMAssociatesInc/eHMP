#class FocusInAction
#  include HTMLAction
#  def initialize(html_id)
#    @id = html_id
#  end
#  
#  def perform_action(html_element, value)
#    driver = TestSupport.driver
#    driver.execute_script("$('##{@id}').focusin();")
#  end
#end

class MedReviewApplet < ADKContainer
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Coversheet Dropdown"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
    add_verify(CucumberLabel.new("Drop Down Menu"), VerifyText.new, AccessHtmlElement.new(:class, "dropdown-menu"))
    add_action(CucumberLabel.new("Meds Review"), ClickAction.new, AccessHtmlElement.new(:link_text, "Meds Review"))
    add_verify(CucumberLabel.new("No Records Found"), VerifyText.new, AccessHtmlElement.new(:class, "emptyMedsList")) 
    add_action(CucumberLabel.new("Inpatient Meds Group"), ClickAction.new, AccessHtmlElement.new(:css, "#medsReviewApplet_mainContentArea_INPATIENTMedications_accordion_medication_review_v2"))    
    add_action(CucumberLabel.new("Outpatient Meds Group"), ClickAction.new, AccessHtmlElement.new(:css, "#medsReviewApplet_mainContentArea_OUTPATIENTMedications_accordion_medication_review_v2"))
    add_verify(CucumberLabel.new("Inpatient Meds Group"), VerifyText.new, AccessHtmlElement.new(:css, "#medsReviewApplet_mainContentArea_INPATIENTMedications_accordion_medication_review_v2"))    
    add_verify(CucumberLabel.new("Outpatient Meds Group"), VerifyText.new, AccessHtmlElement.new(:css, "#medsReviewApplet_mainContentArea_OUTPATIENTMedications_accordion_medication_review_v2"))
    add_verify(CucumberLabel.new("Applet Title"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] .panel-title-label"))

    warfarin_tab_id = 'medication_name_urn_va_med_9E7A_271_17220'
    #add_action(CucumberLabel.new("WARFARIN TAB"), FocusInAction.new(warfarin_tab_id), AccessHtmlElement.new(:id, warfarin_tab_id))
    add_action(CucumberLabel.new("WARFARIN TAB"), ClickAction.new, AccessHtmlElement.new(:id, warfarin_tab_id))  
    add_action(CucumberLabel.new("WARFARIN TAB detail icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='medication_Item_urn_va_med_9E7A_271_17220']/descendant::a[@id='detailView-button-toolbar']"))
    add_action(CucumberLabel.new("DIGOXIN TAB detail icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='medication_Item_urn_va_med_9E7A_164_9583']/descendant::a[@id='detailView-button-toolbar']"))
     
    digoxin_tab_id = 'medication_name_urn_va_med_9E7A_164_9583'
    #add_action(CucumberLabel.new("DIGOXIN TAB"), FocusInAction.new(digoxin_tab_id), AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] ##{digoxin_tab_id}"))
    add_action(CucumberLabel.new("DIGOXIN TAB"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] ##{digoxin_tab_id}")) 
    metformin_tab_id = 'medication_name_urn_va_med_9E7A_271_27860'     
    #add_action(CucumberLabel.new("METFORMIN TAB,SA"), FocusInAction.new(metformin_tab_id), AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] ##{metformin_tab_id}"))
    add_action(CucumberLabel.new("METFORMIN TAB,SA"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] ##{metformin_tab_id}"))
    
    add_action(CucumberLabel.new("METFORMIN TAB,SA detail icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='medication_Item_urn_va_med_9E7A_271_27860']/descendant::a[@button-type='detailView-button-toolbar']"))
    add_verify(CucumberLabel.new("Order Hx Date Range 1"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #order-urn_va_med_9E7A_271_27860"))
    add_verify(CucumberLabel.new("Order Hx Date Range 2"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #order-urn_va_med_C877_271_27860"))
    add_action(CucumberLabel.new("Meds Review Filter input"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "input[name='q-8afd050c9965']"))
    add_action(CucumberLabel.new("Meds Review Search Filter"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-8afd050c9965"))
  end
end

class MedReviewAppletSummaryDetailsHeader < ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Outpatient Name Header"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-name-header"))
    add_verify(CucumberLabel.new("Outpatient Sig Header"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-sig-header"))
    add_verify(CucumberLabel.new("Outpatient Last Header"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-time-header"))
    add_verify(CucumberLabel.new("Outpatient Status/Fillable Header"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-fillable-header"))
      
    add_verify(CucumberLabel.new("Inpatient Name Header"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #INPATIENT-name-header"))
    add_verify(CucumberLabel.new("Inpatient Sig Header"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #INPATIENT-sig-header"))
    add_verify(CucumberLabel.new("Inpatient Last Header"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #INPATIENT-time-header"))
    add_verify(CucumberLabel.new("Inpatient Status/Next Header"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #INPATIENT-next-header"))
    
    add_action(CucumberLabel.new("Outpatient Name Header Sort"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-name-header"))
    add_action(CucumberLabel.new("Outpatient Sig Header Sort"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-sig-header"))
    add_action(CucumberLabel.new("Outpatient Last Header Sort"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #OUTPATIENT-time-header"))
  end
end

class MedReviewAppletSummaryDetails < ADKContainer
  include Singleton
  def initialize
    super
    #outpatient medications
    add_verify(CucumberLabel.new("METFORMIN TAB,SA Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_271_27860"))
    add_verify(CucumberLabel.new("METOPROLOL TAB Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_271_16944"))
    add_verify(CucumberLabel.new("METOPROLOL TARTRATE TAB Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_271_27960"))
    add_verify(CucumberLabel.new("SIMVASTATIN TAB Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_271_28060"))
    add_verify(CucumberLabel.new("WARFARIN TAB Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("ASPIRIN TAB,EC Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_271_18044"))
      
    add_verify(CucumberLabel.new("METFORMIN TAB,SA Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_271_27860"))
    add_verify(CucumberLabel.new("METOPROLOL TAB Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_271_16944"))
    add_verify(CucumberLabel.new("METOPROLOL TARTRATE TAB Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_271_27960"))
    add_verify(CucumberLabel.new("SIMVASTATIN TAB Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_271_28060"))
    add_verify(CucumberLabel.new("WARFARIN TAB Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("ASPIRIN TAB,EC Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_271_18044"))
      
    add_verify(CucumberLabel.new("METFORMIN TAB,SA Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_271_27860"))
    add_verify(CucumberLabel.new("METOPROLOL TAB Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_271_16944"))
    add_verify(CucumberLabel.new("METOPROLOL TARTRATE TAB Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_271_27960"))
    add_verify(CucumberLabel.new("SIMVASTATIN TAB Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_271_28060"))
    add_verify(CucumberLabel.new("WARFARIN TAB Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("ASPIRIN TAB,EC Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_271_18044"))
    
    add_verify(CucumberLabel.new("METFORMIN TAB,SA Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_271_27860"))
    add_verify(CucumberLabel.new("METOPROLOL TAB Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_271_16944"))
    add_verify(CucumberLabel.new("METOPROLOL TARTRATE TAB Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_271_27960"))
    add_verify(CucumberLabel.new("SIMVASTATIN TAB Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_271_28060"))
    add_verify(CucumberLabel.new("WARFARIN TAB Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("ASPIRIN TAB,EC Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_271_18044"))
      
    #inpatient medications
    add_verify(CucumberLabel.new("AMPICILLIN INJ in SODIUM CHLORIDE 0.9% INJ Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_164_10714"))
    add_verify(CucumberLabel.new("CEFAZOLIN INJ in SODIUM CHLORIDE 0.9% INJ Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_164_10717"))
    add_verify(CucumberLabel.new("DIGOXIN TAB Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("FUROSEMIDE TAB Name"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #medication_name_urn_va_med_9E7A_164_9584"))
      
    add_verify(CucumberLabel.new("AMPICILLIN INJ in SODIUM CHLORIDE 0.9% INJ Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_164_10714"))
    add_verify(CucumberLabel.new("CEFAZOLIN INJ in SODIUM CHLORIDE 0.9% INJ Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_164_10717"))
    add_verify(CucumberLabel.new("DIGOXIN TAB Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("FUROSEMIDE TAB Sig"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #sig_urn_va_med_9E7A_164_9584"))
      
    add_verify(CucumberLabel.new("AMPICILLIN INJ in SODIUM CHLORIDE 0.9% INJ Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_164_10714"))
    add_verify(CucumberLabel.new("CEFAZOLIN INJ in SODIUM CHLORIDE 0.9% INJ Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_164_10717"))
    add_verify(CucumberLabel.new("DIGOXIN TAB Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("FUROSEMIDE TAB Last"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #time_urn_va_med_9E7A_164_9584"))      
      
    add_verify(CucumberLabel.new("AMPICILLIN INJ in SODIUM CHLORIDE 0.9% INJ Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_164_10714"))
    add_verify(CucumberLabel.new("CEFAZOLIN INJ in SODIUM CHLORIDE 0.9% INJ Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_164_10717"))
    add_verify(CucumberLabel.new("DIGOXIN TAB Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("FUROSEMIDE TAB Fillable"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #fillable_urn_va_med_9E7A_164_9584"))      
  end
end

class MedReviewAppletDetailsView < ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Med Name_Warfarin"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #qualifiedName-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Sig_Warfarin"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #med-summary-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Status_Warfarin"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #status_urn_va_med_9E7A_271_17220"))
      
    add_verify(CucumberLabel.new("Med Name_Digoxin"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #qualifiedName-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Sig_Digoxin"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #med-summary-urn_va_med_9E7A_164_9583"))
    add_verify(CucumberLabel.new("Status_Digoxin"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #status_urn_va_med_9E7A_164_9583"))
      
    add_verify(CucumberLabel.new("Prescription No. Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #prescription-label-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Supply Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #supply-label-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Dose/Schedule Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #dose-label-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Provider Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #provider-label-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Pharmacist Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #pharmacist-label-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Location Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #location-label-urn_va_med_9E7A_271_17220"))
    add_verify(CucumberLabel.new("Facility Label"), VerifyText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #facility-label-urn_va_med_9E7A_271_17220"))
      
    add_verify(CucumberLabel.new("Med Review Details Values"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid='medication_review_v2'] #order-detail-urn_va_med_9E7A_271_17220"))
  end
end

class MedReviewDateFilter < ADKContainer
  include Singleton
  def initialize
    super     
    add_action(CucumberLabel.new("Control - Applet - Date Filter"), ClickAction.new, AccessHtmlElement.new(:css, "#navigation-date #date-region-minimized"))
    add_action(CucumberLabel.new("Control - Applet - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "#globalDate-region #filter-from-date-global"))
    add_action(CucumberLabel.new("Control - Applet - To Date"), SendKeysAction.new, AccessHtmlElement.new(:id, "filter-to-date-global"))
    add_action(CucumberLabel.new("Control - Applet - Apply"), ClickAction.new, AccessHtmlElement.new(:id, "custom-range-apply-global"))
  end
end

When(/^user selects Meds Review from drop down menu$/) do
  aa = MedReviewApplet.instance  
  expect(aa.wait_until_action_element_visible("Coversheet Dropdown", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Coversheet Dropdown", "")).to be_true, "Could not click on Drop down menu"
  expect(aa.wait_until_element_present("Drop Down Menu", 60)).to be_true, "Could not see the drop down menu"
  expect(aa.perform_action("Meds Review", "")).to be_true, "Could not click on Med Review link"
end

When(/^user navigates to Meds Review Applet$/) do
  navigate_in_ehmp '#medication-review'
end

Then(/^the title of the page says "(.*?)" in Meds Review Applet$/) do |title|
  aa = MedReviewApplet.instance  
  expect(aa.wait_until_action_element_visible("Applet Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Applet Title", title)).to be_true, "Title does not say MEDICATION REVIEW"
end

Then(/^user sees "(.*?)" and "(.*?)" in Meds Review Applet$/) do |outpatient_group, inpatient_group|
  aa = MedReviewApplet.instance  
  expect(aa.wait_until_action_element_visible(outpatient_group, DefaultLogin.wait_time)).to be_true
  expect(aa.wait_until_action_element_visible(inpatient_group, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(outpatient_group, "OUTPATIENT MEDS")).to be_true, "Outpatient group does not exist"
  expect(aa.perform_verification(inpatient_group, "INPATIENT MEDS")).to be_true, "Inpatient group does not exist"
end

When(/^user expands "(.*?)" in Meds Review Applet$/) do |med_group_name|
  aa = MedReviewApplet.instance  
  expect(aa.wait_until_action_element_visible(med_group_name, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(med_group_name, "")).to be_true, "Could not expand #{med_group_name}"
end

Then(/^"(.*?)" summary view contains headers in Meds Review Applet$/) do |med_group_name, table|
  ma = MedReviewApplet.instance  
  aa = MedReviewAppletSummaryDetailsHeader.instance
  expect(ma.wait_until_action_element_visible(med_group_name, 30)).to be_true
  patient_type = med_group_name.split(" ")
  p patient_type[0]
  expected_headers = table.headers
  for i in 0...expected_headers.length
    expect(aa.perform_verification(patient_type[0] + " " + expected_headers[i] + " Header", expected_headers[i])).to be_true, "#{expected_headers[i]} header does not exist"
  end
end

Then(/^"(.*?)" summary view contains medications in Meds Review Applet$/) do |med_group_name, table|
  ma = MedReviewApplet.instance 
  aa = MedReviewAppletSummaryDetails.instance
  expect(ma.wait_until_action_element_visible(med_group_name, DefaultLogin.wait_time)).to be_true    
  table.rows.each do |row|
    expect(aa.perform_verification(row[0] +" Name", row[0])).to be_true, "The value #{row[0]} is not present in the Medication Name column"
    expect(aa.perform_verification(row[0] + " Sig", row[1])).to be_true, "The value #{row[1]} is not present in the Sig column"
    expect(aa.perform_verification(row[0] + " Last", row[2])).to be_true, "The value #{row[2]} is not present in the Last column"
    expect(aa.perform_verification(row[0] + " Fillable", row[3])).to be_true, "The value #{row[3]} is not present in the Fillable column"
  end
end

Then(/^user selects medication "(.*?)" in Meds Review Applet$/) do |med_name|
  aa = MedReviewApplet.instance
  expect(aa.wait_until_action_element_visible(med_name, DefaultLogin.wait_time)).to be_true 
  expect(aa.perform_action(med_name, "")).to be_true, "Could not expand #{med_name}"
end

Then(/^user selects from the menu medication review detail icon for "(.*?)" in Meds Review Applet$/) do |med_name|
  aa = MedReviewApplet.instance
  expect(aa.wait_until_action_element_visible(med_name + " detail icon", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(med_name + " detail icon", "")).to be_true, "for #{med_name}, medication review detail icon can't be clicked"
end

Then(/^the medication detail header section in Meds Review Applet contains$/) do |table|
  aa = MedReviewAppletDetailsView.instance
  table.rows.each do |row|
    expect(aa.perform_verification(row[0], row[1])).to be_true, "The value #{row[1]} is not present in the Medication Detail View"
  end
end

Then(/^medication detail description section in Meds Review Applet contains$/) do |table|
  aa = MedReviewAppletDetailsView.instance
  table.rows.each do |row|
    expect(aa.perform_verification(row[0] + " Label", row[0])).to be_true, "The Label #{row[0]} is not present in the Medication Detail View"
    expect(aa.perform_verification("Med Review Details Values", row[1])).to be_true, "The Value #{row[1]} is not present in the Medication Detail View"
  end
end

Then(/^the medication detail fill history section in Meds Review Applet contains$/) do |table|
  aa = MedReviewAppletDetailsView.instance
  verify_table_rows_med_review(table) 
end

def verify_table_rows_med_review(table)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '#history-table-urn_va_med_9E7A_271_17220') }
end

When(/^user clicks on the column header "(.*?)" in Med Review Applet$/) do |name_column_header|
  aa = MedReviewAppletSummaryDetailsHeader.instance
  expect(aa.wait_until_action_element_visible(name_column_header + " Header", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(name_column_header + " Header Sort", "")).to be_true
end

Then(/^"(.*?)" column is sorted in ascending order in Med Review Applet$/) do |column_name|
  driver = TestSupport.driver
  column_values_array = []
    
  aa = MedReviewAppletSummaryDetailsHeader.instance
  expect(aa.wait_until_action_element_visible("Outpatient " + column_name + " Header", DefaultLogin.wait_time)).to be_true
  
  case column_name
  when 'Name'
    element_column_values = driver.find_elements(css: '#medication_review_v2-medication-list-items .col-sm-3.outpatientMedItemName')
  when 'Sig'
    element_column_values = driver.find_elements(css: '#medication_review_v2-medication-list-items .col-sm-2.outpatientMedItemSig')
  else
    fail "**** No function found! Check your script ****"
  end

  element_column_values.each do |row|
    #    print "selenium data ----"
    #    p row.text
    column_values_array << row.text.downcase
    # sorted_array_empty_string_removed
    column_values_array -= [""]
  end

  (column_values_array == column_values_array.sort { |x, y| x <=> y }).should == true  
 
end

Then(/^"(.*?)" column is sorted in descending order in Med Review Applet$/) do |column_name|
  driver = TestSupport.driver
  column_values_array = []
    
  aa = MedReviewAppletSummaryDetailsHeader.instance
  expect(aa.wait_until_action_element_visible("Outpatient " + column_name + " Header", DefaultLogin.wait_time)).to be_true
  
  case column_name
  when 'Name'
    element_column_values = driver.find_elements(css: '#medication_review_v2-medication-list-items .col-sm-5.outpatientMedItemName')
  when 'Sig'
    element_column_values = driver.find_elements(css: '#medication_review_v2-medication-list-items .col-sm-2.outpatientMedItemSig')
  else
    fail "**** No function found! Check your script ****"
  end

  element_column_values.each do |row|
    #    print "selenium data ----"
    #    p row.text
    column_values_array << row.text.downcase
    column_values_array -= [""]
  end
  
  (column_values_array == column_values_array.sort { |x, y| y <=> x }).should == true
end

Then(/^"(.*?)" column is sorted in "(.*?)" order in Med Review Applet$/) do |column_name, _sort_type, table|
  driver = TestSupport.driver
  aa = MedReviewAppletSummaryDetailsHeader.instance
  expect(aa.wait_until_action_element_visible("Outpatient " + column_name + " Header", DefaultLogin.wait_time)).to be_true
    
  element_column_values = driver.find_elements(css: '#medication_review_v2-medication-list-items .col-sm-1.outpatientMedItemTime')
  column_values_array = []
  
  element_column_values.each do |row|
    #    print "selenium data ----"
    #    p row.text
    column_values_array << row.text.downcase
  end
  
  cucumber_array = table.headers  
  (column_values_array == cucumber_array).should == true
end

Then(/^OrderHx date range shows$/) do |table|
  aa = MedReviewApplet.instance
  i = 1
  table.rows.each do |row|
    expect(aa.perform_verification("Order Hx Date Range #{i}", row[0])).to be_true, "The orderHx #{row[0]} is not present in the Medication Detail View"
    i += 1
  end
end

Then(/^the user clicks on search filter in Meds Review Applet$/) do
  aa = MedReviewApplet.instance
  expect(aa.wait_until_action_element_visible("Meds Review Search Filter", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Meds Review Search Filter", "")).to be_true
end

Then(/^the user types "(.*?)" in search box of the Meds Review Applet$/) do |search_field|
  aa = MedReviewApplet.instance
  expect(aa.wait_until_action_element_visible("Meds Review Filter input", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Meds Review Filter input", search_field)).to be_true
end

Then(/^user selects the "(.*?)" detail icon in Meds Review Applet$/) do |arg1|
  aa = MedReviewApplet.instance
  label = "#{arg1} detail icon"
  expect(aa.perform_action(label)).to be_true
end

Then(/^"(.*?)" column is sorted in default sorting order in Med Review Applet$/) do |column_name, table|
  driver = TestSupport.driver
  aa = MedReviewAppletSummaryDetailsHeader.instance
  expect(aa.wait_until_action_element_visible("Outpatient " + column_name + " Header", DefaultLogin.wait_time)).to be_true
    
  element_column_values = driver.find_elements(css: '#medication_review_v2-medication-list-items .col-sm-5.outpatientMedItemName')
  column_values_array = []
  
  element_column_values.each do |row|
    print "selenium data ----"
    p row.text
    column_values_array << row.text.downcase
    column_values_array -= [""]
  end
  
  cucumber_array = []
  table.rows.each do |row|
    cucumber_array << row[0]
  end
 
  (column_values_array == cucumber_array).should == true
end

