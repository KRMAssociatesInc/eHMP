require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# CareTeamPage: Page-Object for root page of site, $BASE/
class CareTeamDetailsPage
  include PageObject

  div(:careTeamDropDown, css: '#patientDemographic-providerInfoSummary')
  elements(:careTeamTableHeaders, :th, css: '#patientDemographic-providerInfo .table th')
  elements(:careTeamTable, :tr, css: '#patientDemographic-providerInfo .table tbody tr')
  elements(:careTeamQuickLookTableHeaders, :th, css: '#patientDemographic-providerInfo .popover-content .table th')
  elements(:careTeamQuickLookTable, :tr, css: '#patientDemographic-providerInfo .popover-content .table tbody tr')
  element(:careTeamQuickLook, :tr, css: '.inpatient-attending-provider')
end
