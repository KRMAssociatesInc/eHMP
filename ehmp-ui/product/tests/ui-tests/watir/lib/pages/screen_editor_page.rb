require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# Screen editor page object
class ScreenEditorPage
  include PageObject
  button(:done_editing, id: 'exitEditing')
  button(:trend_view_selection, css: 'div.options-box.gist')
  button(:allergies_carousel_applet, css: '#applets-carousel > div:nth-child(2) > div.carousel-inner > div.item.active > div:nth-child(1)')
  elements(:screen_editor_applets, :li, css: '#gridster2 > ul > li')
end
