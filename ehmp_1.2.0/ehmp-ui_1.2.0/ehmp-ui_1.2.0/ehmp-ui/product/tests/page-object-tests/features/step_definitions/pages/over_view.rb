# This is the over view  page object
class OverView < SitePrism::Page
  set_url '/#overview'
  set_url_matcher '/\/#patient-search-screen$/'
  # *****************  All_Form_Elements  ******************* #
  # *****************  All_Logo_Elements  ******************* #
  # *****************  All_Field_Elements  ******************* #
  element :fld_patient_search_button, "#patientSearchButton"
  element :fld_patient_demographic_patient_info, "#patientDemographic-patientInfo"
  element :fld_demo_patientInfo,"#patientDemographic-patientInfo-detail"
  element :fld_patient_dob, "#patientDemographic-patientInfo-dob"
  element :fld_patient_gender,"#patientDemographic-patientInfo-gender"
  element :fld_patient_ssn,"#patientDemographic-patientInfo-ssn"
  element :fld_bottom_region, "#bottom-region"
  element :fld_app_version, "#appVersion"
  elements :fld_all_applets, "span[class='center-block text-center panel-title']"
  elements :fld_allergies, "div[id^='pill-gist-popover-urn:va:allergy']"
  element :fld_immunizations_applet, "div[data-appletid='immunizations']"
  elements :fld_immunization_gist_items, "div[id^='pill-gist-popover-urn:va:immunization']"
  element :fld_screen_name, '#screenName'
  element :fld_cover_sheet, "a[href='#cover-sheet']"
  element :fld_news_feed, "a[href='#news-feed']"
  element :fld_overview, "a[href='#overview']"
  element :fld_medication_review, "a[href='#medication-review]"
  element :fld_documents_list, "a[href='#documents-list]"

  # *****************  All_Button_Elements  ******************* #
  element :btn_allergy_maximize, "[data-appletid=allergy_grid] .applet-maximize-button"

  # *****************  All_Drop_down_Elements  ******************* #
  element :ddl_filter_toggle, ".btn.btn-default.dropdown-toggle"

# div tag with 'Patient search'
  def patient_search_button(text)
    # return unless
    fld_patient_search_button.text.upcase.include? text.upcase
    fld_patient_search_button.click
  end


  def patient_search_text
    fld_patient_search_button.text
  end

end
