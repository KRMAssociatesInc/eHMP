require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# CIWPage: Page-Object for CIW
class CIWPage
  include PageObject

  button(:workspaceManager, id: 'workspace-manager-button')
  button(:addNewWorkspace, css: '.addScreen')
  div(:workSpaceBanner, class: 'tableBanner')
  text_field(:workspace1, id: 'tile-user-defined-workspace-1')
  text_field(:workspace2, id: 'tile-user-defined-workspace-2')
  div(:associationWorkspace1, id: 'association-trigger-user-defined-workspace-1')
  div(:associationWorkspace2, id: 'association-trigger-user-defined-workspace-2')
  text_field(:searchProblem, id: 'screen-problem-search')
  span(:problemResult, class: 'tt-suggestions')
  div(:manicBipolarProblem, id: 'problem-result-68569003')
  div(:associatedProblem_bipolar, css: "div[aria-label='Associated problem Manic bipolar I disorder']")
  div(:associatedProblem_hypertension, css: "div[aria-label='Associated problem Essential hypertension']")
  div(:deleteWorkspace1, css: '#user-defined-workspace-1 .delete-worksheet')
  div(:deleteWorkspace2, css: '#user-defined-workspace-2 .delete-worksheet')
  button(:deleteConfirm, id: 'workspace-delete')
  div(:hypertensionProblem, id: 'problem-result-59621000')
  div(:noResults, id: 'no-results-text')
  button(:removeManic, id: 'remove-problem-68569003')
  element(:closeWorkspaceManager, :i, id: 'doneEditing')

  def input_into_search_problem(input_data)
    searchProblem_element.when_visible(@default_timeout)
    self.searchProblem = ''
    self.searchProblem = input_data
    # searchProblem_element.send_keys :enter
  end

  def extract_attribute_value_from_problem(_problem)
    problemResult_element.when_visible(@default_timeout)
    self.class.element(:problemText, :div, id: 'problem-result-68569003')
    problemText_element.when_visible(@default_timeout)
    # p problemText_element.class_name
    problemText_element.class_name
  end

  def delete_workspace(workspace_name)
    case workspace_name
    when 'workspace1'
      deleteWorkspace1_element.when_visible(@default_timeout)
      deleteWorkspace1_element.click
    when 'workspace2'
      deleteWorkspace2_element.when_visible(@default_timeout)
      deleteWorkspace2_element.click
    else
      fail '**** No function found! Check your script ****'
    end
    deleteConfirm_element.when_visible(@default_timeout)
    deleteConfirm
  end
end
