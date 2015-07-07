/**
 * Created with IntelliJ IDEA.
 * User: vhaisllees
 * Date: 10/24/13
 * Time: 8:20 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.apply(Ext.form.VTypes, {
    phone: function(v) {
        return /^(\([1-9]\d\d\))\s?[1-9]\d\d-\d{4}$|^[1-9]\d\d-[1-9]\d\d-\d{4}$|^[1-9]\d{2}[1-9]\d{2}\d{4}$/.test(v);
    },
    phoneText: 'Format should be in (999)999-9999, (999) 999-9999, 999-999-9999, or 9999999999',
    phoneMask: /[\d\s\(\)\-]/i
});

Ext.define('gov.va.cpe.patient.PatientDemographicsPanel', {
    extend: 'Ext.form.Panel',

    uses: [
        'gov.va.hmp.ux.ClearButton'
    ],

    alias: 'widget.patientdemographicspanel',

    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },

    listeners:{
        beforepatientchange:function (pid) {
            this.up('menu').hide();
        },
        patientchange:function (pid) {
            this.pid = pid;
        }
    },

    preserveWidth: true,

    layout: {
        type: 'anchor'
//        align: 'stretch'
    },

    defaults: {
        anchor: '100%'
    },

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 180
    },

    defaults: {
        xtype: 'displayfield'
    },

    items: [
        {
            fieldLabel: 'Home Address',
            name: 'homeAddress'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Home Phone',
            editable: true,
            hidden:true,
            emptyText: '',
            name: 'homePhone',
            allowBlank: true,
            plugins: ['clearbutton'],
            vtype: 'phone',
            msgTarget: 'side',
            listeners: {
                change: function(tf) {
                    tf.up('form').onPhoneChange();
                }
            }
        },
        {
            fieldLabel: 'Home Phone',
            name: 'homePhoneReadOnly'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Cell Phone',
            editable: true,
            hidden:true,
            emptyText: '',
            name: 'cellPhone',
            allowBlank: true,
            plugins: ['clearbutton'],
            vtype: 'phone',
            msgTarget: 'side',
            listeners: {
                change: function(tf) {
                    tf.up('form').onPhoneChange();
                }
            }
        },
        {
            fieldLabel: 'Cell Phone',
            name: 'cellPhoneReadOnly'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Work Phone',
            editable: true,
            hidden:true,
            emptyText: '',
            name: 'workPhone',
            allowBlank: true,
            plugins: ['clearbutton'],
            vtype: 'phone',
            msgTarget: 'side',
            listeners: {
                change: function(tf) {
                    tf.up('form').onPhoneChange();
                }
            }
        },
        {
            fieldLabel: 'Work Phone',
            name: 'workPhoneReadOnly'
        },
        {
            fieldLabel: 'Marital Status',
            name: 'maritalStatus'
        },
        /*{
            fieldLabel: 'Preferred Language:',
            name: 'prefLanguage'
        },    */
        {
            fieldLabel: 'Veteran',
            name: 'veteran',
            valueToRaw:function(value) {
                if (Boolean(value)) return 'Yes';
                else return 'No';
            }
        },
        {
            fieldLabel: 'Service Connected',
            name: 'serviceConnected'
        },
        {
            fieldLabel: 'Service Connected Conditions',
            name: 'serviceConnectedConditions'
        },
        {
            fieldLabel: 'Emergency Contact',
            name: 'emergencyContact'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Emergency Contact Phone',
            editable: true,
            hidden:true,
            emptyText: '',
            name: 'emergencyPhone',
            allowBlank: true,
            vtype: 'phone',
            msgTarget: 'side',
            plugins: ['clearbutton'],
            listeners: {
                change: function(tf) {
                    tf.up('form').onPhoneChange();
                }
            }
        },
        {
            fieldLabel: 'Emergency Contact Phone',
            name: 'emergencyPhoneReadOnly'
        },
        {
            fieldLabel: 'Next of Kin',
            name: 'nokContact'
        } ,
        {
            xtype: 'textfield',
            fieldLabel: 'Next of Kin Phone',
            editable: true,
            hidden:true,
            emptyText: '',
            name: 'nokPhone',
            allowBlank: true,
            vtype: 'phone',
            msgTarget: 'side',
            plugins: ['clearbutton'],
            listeners: {
                change: function(tf) {
                    tf.up('form').onPhoneChange();
                }
            }
        },
        {
            fieldLabel: 'Next of Kin Phone',
            name: 'nokPhoneReadOnly'
        },
        {
            fieldLabel: 'Date of Death',
            name: 'dateOfDeath'
            //format: {[PointInTime.format(values.birthDate, Ext.Date.patterns.MSCUIDate)]}
        },
        {
            fieldLabel: 'Other Insurance',
            name: 'otherInsurance'
        },
        {
            fieldLabel: 'Co-Pay',
            name: 'copay'
        }
    ],

    pid: null,

    // maintain the most current editable phone numbers
    homePhone: '',
    cellPhone: '',
    workPhone: '',
    emergencyPhone: '',
    nokPhone: '',

    formLoading: false,

    formEditing: false,

    mode: 'readonly',   // keep track of the current mode  'readonly' or 'edit'

    dirty: false,       // check if phone number changed

    onBoxReady: function () {
        this.callParent(arguments);
        gov.va.hmp.EventBus.on('domainChange', this.onDomainChange, this);
    },

    onDomainChange: function(event) {
        var me = this,
            pid = event.pid,
            domain = event.domain;
        // do not re-load the form while loading, saving and in edit mode !!!
        if ( (domain == 'PatientDemographics') && this.pid === pid && !me.formLoading && !me.formEditing  && me.mode == 'readonly' ) {
            me.loadForm();
        }
     },

    loadOnPatientChange: function() {
        // if patient changed, load new patient dem
        // if patient not changed, and if it is 'readonly' mode, re-load
        if ( this.pid === null || (this.pid == gov.va.hmp.PatientContext.pid && this.mode == 'readonly') ) {
            this.pid =  gov.va.hmp.PatientContext.pid;
            this.loadForm();
        }
        // if patient not changed, and if it is 'edit' mode, just display the dem panel
    },

    loadForm: function() {
        var me = this;
        me.getForm().reset();
        this.formLoading = true;
        this.getForm().load({
                url: "/patient/demographics",
                params: {
                    pid: this.pid
                },
                method: 'GET',
                success: function() {
                    // load into phone + 'readOnly' fields
                    me.getForm().findField('homePhoneReadOnly').setValue(me.formatPhoneNbr(this.result.data['homePhone']));
                    me.getForm().findField('cellPhoneReadOnly').setValue(me.formatPhoneNbr(this.result.data['cellPhone']));
                    me.getForm().findField('workPhoneReadOnly').setValue(me.formatPhoneNbr(this.result.data['workPhone']));
                    me.getForm().findField('emergencyPhoneReadOnly').setValue(me.formatPhoneNbr(this.result.data['emergencyPhone']));
                    me.getForm().findField('nokPhoneReadOnly').setValue(me.formatPhoneNbr(this.result.data['nokPhone']));
                    me.getForm().findField('dateOfDeath').setValue(PointInTime.format(this.result.data['dateOfDeath']));

                    // save the phone numbers after form is loaded and they are reformatted  ...
                    me.homePhone = me.getForm().findField('homePhoneReadOnly').getValue ();
                    me.cellPhone = me.getForm().findField('cellPhoneReadOnly').getValue ();
                    me.workPhone = me.getForm().findField('workPhoneReadOnly').getValue ();
                    me.emergencyPhone = me.getForm().findField('emergencyPhoneReadOnly').getValue ();
                    me.nokPhone = me.getForm().findField('nokPhoneReadOnly').getValue ();

                    var emergencyContact = me.getForm().findField('emergencyContact').getValue();
                    if ( !emergencyContact || emergencyContact.length === 0 ) {
                        me.getForm().findField('emergencyPhone').disable();
                    }
                    else {
                        me.getForm().findField('emergencyPhone').enable();
                    }
                    var nokName = me.getForm().findField('nokContact').getValue();
                    if ( !nokName || nokName.length === 0 ) {
                        me.getForm().findField('nokPhone').disable();
                    }
                    else {
                        me.getForm().findField('nokPhone').enable();
                    }

                    me.putInReadOnlyMode();

                    me.formLoading = false;
                },
                failure: function (resp) {
                    //console.log(resp);
                    //Ext.MessageBox.alert('Load Failed', 'Check console log for details.');
                    me.formLoading = false;
            }
            }
        );
    },

    isPhoneChanged: function() {
        return (this.getForm().findField('homePhone').getValue() !== this.homePhone
                || this.getForm().findField('cellPhone').getValue() !== this.cellPhone
                || this.getForm().findField('workPhone').getValue() !== this.workPhone
                || this.getForm().findField('emergencyPhone').getValue() !== this.emergencyPhone
                || this.getForm().findField('nokPhone').getValue() !== this.nokPhone);
    },

    formatPhoneNbr: function(phone) {
        if (phone === undefined || phone === null || phone.length == 0)   {
            return '';
        }
        phone = phone.trim();

        var formatted = phone;
        if (/^(\([1-9]\d\d\))[1-9]\d\d-\d{4}$/.test(phone)) {
            formatted = phone.substring(0, 5) + ' ' +  phone.substring(5);
        }
        else if (/^[1-9]\d\d-[1-9]\d\d-\d{4}$/.test(phone)) {
            formatted = '(' + phone.substring(0, 3) + ') ' + phone.substring(4);
        }
        else if (/^[1-9]\d{2}[1-9]\d{2}\d{4}$/.test(phone))  {
            formatted = '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
        }
        return formatted;
    },

    handleEditCancelBtn: function(btn) {
        var me = this;
        if (btn.getText() == 'Edit') {
            me.putInEditMode();
        }
        else {  // pressed 'Cancel' ... put in readonly mode
            me.putInReadOnlyMode();
        }
    },

    handleCloseDoneBtn: function(btn) {
        var me = this;
        if (btn.getText() == 'Close') {
            btn.up('menu').hide();
        }
        else {  // pressed 'Done' .. Save!  ... and then go to readonly mode
            me.save();
        }
    },

    putInEditMode: function() {
        var me = this;
        me.switchMode(false);
        var menu = this.up('menu');
        menu.down('#editCancelBtn').setText('Cancel');
        menu.down('#closeDoneBtn').setText('Done');
        //if ( !me.getForm().isValid() )
        {
            menu.down('#closeDoneBtn').disable();
        }
        me.setPhoneFields(false);
    },

    putInReadOnlyMode: function() {
        var me = this;
        me.switchMode(true);
        var menu = this.up('menu');
        menu.down('#editCancelBtn').setText('Edit');
        menu.down('#editCancelBtn').enable();
        menu.down('#closeDoneBtn').setText('Close');
        menu.down('#closeDoneBtn').enable();
        me.setPhoneFields(true);

        this.dirty = false;     // clear the flag!
     },

    setPhoneFields: function(readonly) {
        var homePhone = readonly ? 'homePhoneReadOnly' : 'homePhone',
            cellPhone = readonly ? 'cellPhoneReadOnly' : 'cellPhone',
            workPhone = readonly ? 'workPhoneReadOnly' : 'workPhone',
            emergencyPhone = readonly ? 'emergencyPhoneReadOnly' : 'emergencyPhone',
            nokPhone = readonly ? 'nokPhoneReadOnly' : 'nokPhone';

        // set editable phone numbers
        this.getForm().findField(homePhone).setValue(this.homePhone);
        this.getForm().findField(cellPhone).setValue(this.cellPhone);
        this.getForm().findField(workPhone).setValue(this.workPhone);
        this.getForm().findField(emergencyPhone).setValue(this.emergencyPhone);
        this.getForm().findField(nokPhone).setValue(this.nokPhone);
    },

    switchMode: function(readonly) {

        var editables = Ext.ComponentQuery.query('textfield[editable=true]', this);
        Ext.Array.each(editables, function(tf) {
            readonly ? tf.hide() : tf.show();
        });

        var readonlys = Ext.ComponentQuery.query('field[name$=ReadOnly]', this);
        Ext.Array.each(readonlys, function(tf) {
           readonly ? tf.show() : tf.hide();
        });

        this.mode = readonly ? 'readonly' : 'edit';
    },

    save: function() {
        var me = this;

        if ( me.getForm().isValid() )  {
            me.formEditing = true;

            var homePhone = me.getForm().findField('homePhone').getValue();
            var cellPhone = me.getForm().findField('cellPhone').getValue();
            var workPhone = me.getForm().findField('workPhone').getValue();
            var emergencyPhone = me.getForm().findField('emergencyPhone').getValue();
            var nokPhone = me.getForm().findField('nokPhone').getValue();

            Ext.Ajax.request({
                url: '/patient/demographics',
                method: 'POST',
                params: {
                    pid: this.pid,
                    homePhone: homePhone,
                    cellPhone: cellPhone,
                    workPhone: workPhone,
                    emergencyContact: me.getForm().findField('emergencyContact').getValue(),
                    emergencyPhone: emergencyPhone,
                    nokContact: me.getForm().findField('nokContact').getValue(),
                    nokPhone: nokPhone
                },
                success: function (resp) {
                   // save the current numbers as formatted after successful save
                    me.homePhone = me.formatPhoneNbr(homePhone);
                    me.cellPhone = me.formatPhoneNbr(cellPhone);
                    me.workPhone = me.formatPhoneNbr(workPhone);
                    me.emergencyPhone = me.formatPhoneNbr(emergencyPhone);
                    me.nokPhone = me.formatPhoneNbr(nokPhone);
                    me.putInReadOnlyMode();
                    me.formEditing = false;
                },
                failure: function (resp) {
                    mode = 'readonly';
                    me.formEditing = false;
                    console.log(resp);
                    Ext.MessageBox.alert('Save Failed', 'Check console log for details.');
                }
            });
        }
        else {
            //textfield.invalidText = 'test ...';
            //Ext.MessageBox.alert('Invalid Phone number format', 'Please enter a Phone number in the format (999)999-9999.');
        }
    },

    onPhoneChange: function() {
        this.dirty = this.isPhoneChanged();

        if ( this.getForm().isValid() && this.dirty ) {
            this.up('menu').down('#closeDoneBtn').enable();
        }
        else {
            this.up('menu').down('#closeDoneBtn').disable();
        }
    }
});