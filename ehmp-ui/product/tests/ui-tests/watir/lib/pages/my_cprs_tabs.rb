# encoding: utf-8

require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# MyCPRSTabs contains page objects and methods that grabs text for each tab on the patient search screen
class MyCPRSTabs
  include PageObject

  # Header region
  text_field(:patient_search_input, id: 'patientSearchInput')
  element(:patient_selection_focus, :div, css: '#patient-search-input .input-group')
  a(:my_cprs_list_link, css: '#myCprsList a')
  a(:clinics_link, css: '#clinics a')
  a(:wards_link, css: '#wards a')
  li(:my_cprs_list_tab, id: 'myCprsList')
  li(:clinics_tab, id: 'clinics')
  li(:wards_tab, id: 'wards')
  a(:nationwide_link, css: '#global a')
  a(:my_site_link, css: '#mySite a')
  li(:nationwide, css: '#global')
  li(:my_site, css: '#mySite')

  def get_mysite_tabs_group_text(num)
    self.class.element(:patient_search_tab_label, :li, css: '#patientSearchTabs li:nth-of-type('" #{ num } "')')
    patient_search_tab_label_element.text.strip
  end

  def get_all_tabs_group_text(num)
    self.class.element(:patient_search_tab_link, :a, css: '#patient-search-pills li:nth-of-type('" #{ num } "') a')
    patient_search_tab_link_element.text.strip
  end

  def textfield_hasfocus?(textFieldElement)
    has_focus = false
    has_focus = true if textFieldElement.attribute('class').include?('hasFocus')
    has_focus
  end

  def tab_active?(subTab)
    active = false
    active = true if subTab.attribute('class').include?('active')
    active
  end
end
