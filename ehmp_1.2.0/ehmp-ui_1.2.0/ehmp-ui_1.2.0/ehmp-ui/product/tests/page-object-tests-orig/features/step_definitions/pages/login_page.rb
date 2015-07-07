require_relative './base'
# This is the login page object
class LoginPage < Base
  # Login page objects
  Base.set_page_url ''

  select_list(:facility, id: 'facility')
  text_field(:access_code, id: 'accessCode')
  text_field(:verify_code, id: 'verifyCode')
  button(:login, id: 'login')
end
