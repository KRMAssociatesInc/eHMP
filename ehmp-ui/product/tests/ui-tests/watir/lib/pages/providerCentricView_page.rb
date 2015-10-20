require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# require_relative 'common_test_page'
# require_relative 'common_elements_page'

# Coversheet page for $BASE/#cover-sheet
class ProviderCentricViewPage
  include PageObject

  div(:tasklist_applet, css: '[data-appletid=task_list]')
end
