require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# LoginPage: Page-Object for root page of site, $BASE/
class LoginPage
  include PageObject

  select_list(:facility, id: 'facility')
  text_field(:accessCode, id: 'accessCode')
  text_field(:verifyCode, id: 'verifyCode')
  button(:login, id: 'login')
  a(:logout, id: 'logoutButton')
  element(:displayedUser, :dt, class: 'text-muted')
  link(:currentUser, css: '#eHMP-CurrentUser')
  p(:navTitle, css: '.navTitle p.navbar-text')
end
