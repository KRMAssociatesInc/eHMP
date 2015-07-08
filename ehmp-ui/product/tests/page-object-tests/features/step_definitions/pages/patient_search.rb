class PatientSearch < SitePrism::Page

  set_url '/#patient-search-screen'
  set_url_matcher /\/#patient-search-screen$/

  # *****************  All_Form_Elements  ******************* #


  # *****************  All_Container_Elements  ******************* #
  element :ctn_fluid, "div[class='container-fluid']"

  # *****************  All_Logo_Elements  ******************* #


  # *****************  All_Field_Elements  ******************* #
  element :fld_patient_search, "#patientSearchInput"
  elements :fld_patient_record, "div[class='list-group-item-text row']"
  element :fld_search_lastname, "input[id='globalSearchLastName']"
  element :fld_search_ssn, "input[id='globalSearchSsn']"
  element :fld_search_firstname, "#globalSearchFirstName"
  element :fld_search_dob, "#globalSearchDob"
  element :fld_patient_name, ".patientName"


  # *****************  All_Button_Elements  ******************* #
  element :btn_search, "#globalSearchButton"
  element :btn_allpatient, "#global"
  element :btn_confirmation, "#confirmationButton"
  element :btn_ack, "#ackButton"
  element :btn_logout, "a[id='logoutButton']"
  element :btn_confirm, "#confirmFlaggedPatinetButton"
  
   # *****************  All_Error_Text_Elements  ******************* #
  element :err_message1, "p[class='error-message padding']"

  # *****************  All_Drop_down_Elements  ******************* #
  element :ddl_ehmp_current_user, "a[id='eHMP-CurrentUser']"

  # *****************  All_Table_Elements  ******************* #
  element :tbl_patient_info, "div[class='patientInfo row']"

  # *****************  All_Dialogue_Elements  ******************* #
  element :dlg_ack_panel, "div[id='ackMessagePanel']"
  element :dlg_wand_panel,"div[id='ackMessagePanel_WANDERER']"
end