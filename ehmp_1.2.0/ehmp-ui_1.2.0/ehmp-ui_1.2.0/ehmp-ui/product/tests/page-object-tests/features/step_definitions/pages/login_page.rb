class LoginPage < SitePrism::Page

  set_url "/"

  # *****************  All_Form_Elements  ******************* #
  element :frm_ehmp, "form[class='col-md-4.col-sm-5.col-sm-push-6.col-md-push-6']"


  # *****************  All_Logo_Elements  ******************* #
  element :lgo_ehmp, "img[class='center-block']"


  # *****************  All_Field_Elements  ******************* #
  element :fld_accesscode, "#accessCode"
  element :fld_verifycode, "#verifyCode"



  # *****************  All_Button_Elements  ******************* #
  element :btn_login, "button[type='submit']"


  # *****************  All_Drop_down_Elements  ******************* #
  element :ddl_facility, "#facility"


  # *****************  Local_Methods  *************#
  def login_with(facilityname, accesscode, verifycode)
    self.wait_for_ddl_facility
    self.ddl_facility.select facilityname
    self.fld_accesscode.set accesscode
    self.fld_verifycode.set verifycode
    self.btn_login.click
  end

end