require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# WorkspaceManager page object
class WorkspaceManagerPage
  include PageObject
  button(:add_workspace, class: 'btn addScreen')
  button(:confirm_delete, id: 'workspace-delete')
  elements(:udw_rows, :div, css: '#list-group div.row.user-defined')
  elements(:workspace_rows, :div, css: '#list-group div.row')
  elements(:applet_previews, :li, css: '#gridsterPreview > ul > li')
  button(:exit_preview, css: '#mainOverlayRegion > div > div > div.previewRegion > div > div > div > div.closePreview')
  button(:show_filter, id: 'grid-filter-button-workspace-manager')
  text_field(:filter, id: 'searchScreens')
  button(:hypertension_cbw_preview, css: '#hypertension-cbw div.col-xs-4.border-right.previewWorkspace.preview')
  span(:hypertension_preview_title, class: 'wsTitle')
  button(:hypertension_cbw_launch, css: '#hypertension-cbw div.col-xs-4.launch-screen')
  elements(:hypertension_cbw_applets, :div, class: 'gs-w')
  button(:close_workspace_manager, id: 'doneEditing')
  button(:myWorkspaceHelp, id: 'help-button-task_list')

  def customize_workspace(row_num)
    self.class.button(:customize, css: "#user-defined-workspace-#{row_num} > div > div.col-xs-3 > div.col-xs-4.customize-screen")
    customize_element.when_visible
    customize
  end

  def delete_workspace(row_num)
    self.class.button(:delete_icon, css: "#user-defined-workspace-#{row_num} > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div")
    delete_icon_element.when_visible
    delete_icon
    confirm_delete_element.when_visible
    confirm_delete
  end

  def preview_workspace(row_num)
    self.class.button(:preview, css: "#user-defined-workspace-#{row_num} > div > div.col-xs-3 > div.col-xs-4.border-right.previewWorkspace.preview")
    preview_element.when_visible
    preview
  end

  def launch_workspace(row_num)
    self.class.button(:launch, css: "#user-defined-workspace-#{row_num} > div > div.col-xs-3 > div.col-xs-4.launch-screen")
    launch_element.when_visible
    launch
  end

  def duplicate_workspace(row_num)
    self.class.button(:duplicate, css: "#user-defined-workspace-#{row_num} > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(1) > div")
    duplicate_element.when_visible
    duplicate
  end
end
