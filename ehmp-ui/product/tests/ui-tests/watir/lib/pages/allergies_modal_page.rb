require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# AllergiesGistPage: Page-Object for allergies gist on overview page and expanded allergies page
class AllergiesModalPage < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end

  div(:mainModal, id: 'mainModalDialog')
  button(:previous, id: 'allergy-grid-previous')
  button(:next, id: 'allergy-grid-next')
  button(:close, id: 'modal-close-button')
  button(:xclose, css: 'div.allergy-modal-nav-buttons button.close')
  element(:title, :h4, id: 'mainModalLabel')
  element(:symptoms, :h5, css: '#modal-body div.row h5')
  button(:severity, css: '#modal-body .col-md-3 button')
  drug_classes_id = 'modal-drugClasses'
  div(:drugClasses, id: drug_classes_id)
  div(:drugClassesLabel, xpath: "//div[@id='#{drug_classes_id}']/preceding-sibling::div")

  natureofreaction_id = 'natureofreaction'
  div(:natureOfReaction, id: natureofreaction_id)
  div(:natureOfReactionLabel, xpath: "//div[@id='#{natureofreaction_id}']/preceding-sibling::div")

  originator_name_id = 'originatorName'
  div(:originatorName, id: originator_name_id)
  div(:originatorNameLabel, xpath: "//div[@id='#{originator_name_id}']/preceding-sibling::div")

  modal_originated_formatted_id = 'modal-originatedFormatted'
  div(:originated, id: modal_originated_formatted_id)
  div(:originatedLabel, xpath: "//div[@id='#{modal_originated_formatted_id}']/preceding-sibling::div")

  modal_verifiername_id = 'modal-verifierName'
  div(:verifierName, id: modal_verifiername_id)
  div(:verifierNameLabel, xpath: "//div[@id='#{modal_verifiername_id}']/preceding-sibling::div")

  modal_observedorhistorical_id = 'modal-observedorhistorical'
  div(:observedorhistorical, id: modal_observedorhistorical_id)
  div(:observedorhistoricalLabel, xpath: "//div[@id='#{modal_observedorhistorical_id}']/preceding-sibling::div")

  modal_observeddate_id = 'modal-observedDate'
  div(:observedDate, id: modal_observeddate_id)
  div(:observedDateLabel, xpath: "//div[@id='#{modal_observeddate_id}']/preceding-sibling::div")

  facilityname_id = 'facilityName'
  div(:facilityName, id: facilityname_id)
  div(:facilityNameLabel, xpath: "//div[@id='#{facilityname_id}']/preceding-sibling::div")

  element(:commentsLabel, :h4, css: 'div.col-md-12 h4')
  div(:comments, id: 'modal-allergycomment')
end
