define([
    "main/ui_components/forms/component",
    "main/ui_components/workflow/component",
    "main/ui_components/modal/component",
    "main/ui_components/fullscreen_overlay/component",
    "main/ui_components/tabs/component",
    "main/ui_components/alert/component",
    "main/ui_components/notification/component",
    "main/ui_components/tray/component",
    "main/ui_components/collapsible_container/component",
], function(PuppetForm, Workflow, Modal, FullScreenOverlay, Tabs, Alert, Notification, Tray, CollapsibleContainer) {
    'use strict';

    var UI_Componenets = {
        Form: PuppetForm.Form,
        FormViews: PuppetForm,
        Workflow: Workflow,
        Modal: Modal,
        FullScreenOverlay: FullScreenOverlay,
        Tabs: Tabs,
        Alert: Alert,
        Notification: Notification,
        Tray: Tray,
        CollapsibleContainer: CollapsibleContainer
    };

    return UI_Componenets;
});

