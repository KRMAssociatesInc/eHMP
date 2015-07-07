Ext.define('gov.va.hmp.team.PersonTilePanel', {
    extend:'Ext.panel.Panel',
    requires:[
        'gov.va.hmp.ux.PopUpButton',
        'gov.va.hmp.team.PersonField',
        'gov.va.hmp.team.PersonTile'
    ],
    alias:'widget.persontilepanel',
    layout:'column',
    items:[
        {
            xtype:'popupbutton',
            ui:'link',
            scale:'large',
            text:'Add a new person',
            cls:'hmp-person-add-btn',
            popUp:{
                xtype:'form',
                width:300,
                items:[
                    {
                        xtype:'personfield',
                        margin:10,
                        width:280,
                        emptyText:'Add by name',
                        listeners:{
                            select:function (combobox, records) {
                                var menu = combobox.up('menu');
                                menu.ownerButton.hideMenu();

                                var tiles = menu.ownerButton.up('persontilepanel');
                                tiles.addPerson(records[0]);
                            }
                        }
                    }
                ]
            },
            popUpButtons:[],
            listeners:{
                menushow:function (btn, menu) {
                    var combobox = menu.down('personfield');
                    combobox.clearValue();
                    combobox.focus(true, 50);
                }
            }
        },
        {
            xtype:'persontile',
            text:'AVIVAUSER THIRTYTHREE'
        },
        {
            xtype:'persontile',
            text:'VEHU TEN'
        }
    ],
    /**
     *
     * @param {gov.va.hmp.team.Person} person
     */
    addPerson:function (person) {
        this.add({
            xtype:'persontile',
            data:person, // TODO: alter PersonTile to make this work correctly, right now one must set 'text' property
            text:person.get('name')
        });
    },
    removePerson:function (person) {
        // TODO: implement me
    }
});