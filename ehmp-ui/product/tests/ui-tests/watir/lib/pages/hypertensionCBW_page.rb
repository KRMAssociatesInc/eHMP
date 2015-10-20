require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# require_relative 'common_test_page'
# require_relative 'common_elements_page'

# Coversheet page for $BASE/#cover-sheet
class HypertensionPage
  include PageObject

  button(:workspace_dropdown, css: '.btn.btn-default.dropdown-toggle')
  div(:condition_applet, css: '[data-appletid=problems]')
  div(:vitals_applet, css: '[data-appletid=vitals]')
  div(:lab_result_applet, css: '[data-appletid=lab_results_grid]')
  div(:clinical_reminders_applet, css: '[data-appletid=cds_advice]')
  div(:timeline_applet, css: '[data-appletid=newsfeed]')
  div(:med_review_applet, css: '[data-appletid=medication_review_v2]')
  div(:appointment_applet, css: '[data-appletid=appointments]')
  div(:documents_applet, css: '[data-appletid=documents]')
  button(:lab_result_filter_button, id: 'grid-filter-button-htcbw-lab_results_grid-1')

  # get right filter from applet <NOTE>
  # |depression|==  grid-filter-button-dpcbw-documents-1    #grid-filter-dpcbw-documents-1 span.udaf-tag span
  # |diabetis|  ==  grid-filter-button-dmcbw-appointments-1 #grid-filter-dmcbw-appointments-1 span.udaf-tag span
  # |Pre-procedure| == grid-filter-ppcbw-lab_results_grid-1 #grid-filter-ppcbw-lab_results_grid-1 span.udaf-tag span
end
