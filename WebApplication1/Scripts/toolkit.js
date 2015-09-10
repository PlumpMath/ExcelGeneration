/// <reference path="../Extjs_42/ext.js" />
/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../XrmServiceToolkit/XrmServiceToolkit.js" />

Ext.namespace('DMS.Toolkit');

Ext.onReady(function () {
    DMS.Toolkit.UI(null);
});

DMS.Toolkit.UI = function (config) {

    var store = Ext.create('Ext.data.Store', {
        fields: ['new_toolkitId', 'new_name', 'new_length', 'new_author', 'new_version'],
        proxy: {
            type: 'ajax',
            reader: { type: 'json', root: "d.results" },
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_toolkitSet"
        }
    });

    store.load();

    var sm = Ext.create('Ext.selection.CheckboxModel', {
        dataIndex: 'new_toolkitId',
        mode: 'SINGLE',
        allowDeselect: true,
        showHeaderCheckbox: false
    });


    var grid = Ext.create('Ext.grid.Panel', {
        id: 'grid',
        title: 'Toolkit list',
        width: 800,
        height: 300,
        frame: true,
        store: store,
        selModel: sm,
        //style: 'margin-top:30px;',
        columns: [
                            { text: 'Guid', width: 230, sortable: true, dataIndex: 'new_toolkitId', align: 'center' },
                            { text: 'Toolkit Name', width: 230, sortable: true, dataIndex: 'new_name', align: 'left' },
                            { text: 'Toolkit Size', width: 80, sortable: true, dataIndex: 'new_length', align: 'right' },
                            { text: 'Author', width: 120, sortable: true, dataIndex: 'new_author', align: 'left' },
                            { text: 'Version', width: 80, sortable: true, dataIndex: 'new_version', align: 'center' }
                        ],
        dockedItems: [
                                    {
                                        xtype: 'toolbar',
                                        items: [
                                                        {
                                                            text: 'Create',
                                                            scope: this,
                                                            handler: function () {
                                                                DMS.Toolkit.UI.PopWindow({ title: 'Create Window' }, null).show();
                                                            }
                                                        },
                                                        {
                                                            text: 'Update',
                                                            scope: this,
                                                            handler: function () {
                                                                var records = grid.getSelectionModel().getSelection();
                                                                if (records.length == 0) {
                                                                    Ext.MessageBox.alert("Message box", "Please choose a record.");
                                                                } else {
                                                                    DMS.Toolkit.UI.PopWindow({ title: 'Update Window' }, records[0]).show();
                                                                }
                                                            }
                                                        },
                                                        {
                                                            text: 'Delete',
                                                            scope: this,
                                                            handler: function () {
                                                                var records = grid.getSelectionModel().getSelection();
                                                                if (records.length == 0) {
                                                                    Ext.MessageBox.alert("Message box", "Please choose a record.");
                                                                } else {
                                                                    Ext.MessageBox.confirm("Message box", "Do you want delete this record?", function (button, text) {
                                                                        if (button == 'yes') {

                                                                            var toolkitid = records[0].data.new_toolkitId;

                                                                            alert(toolkitid);

                                                                            XrmServiceToolkit.Rest.Delete(
                                                                                toolkitid,
                                                                                "new_toolkitSet",
                                                                                function () {
                                                                                    store.reload();
                                                                                },
                                                                                function (error) { },
                                                                                false
                                                                            );


                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        },
                                                        {
                                                            text: 'Refresh',
                                                            scope: this,
                                                            handler: function () {
                                                                store.reload();
                                                            }
                                                        },
                                                        {
                                                            text: 'Retrieve',
                                                            scope: this,
                                                            handler: function () {
                                                                var res = XrmServiceToolkit.Rest.Retrieve(
                                                                        "c65f0388-c3f5-e311-ba26-8851fb6da383",
                                                                        "new_toolkitSet",
                                                                        null, null,
                                                                        function (result) {
                                                                            alert(Ext.encode(result));
                                                                        },
                                                                        function (error) {
                                                                        },
                                                                        false
                                                                    );
                                                            }
                                                        }
                                                    ]
                                    }
                                ],
        renderTo: "mainPanel"
    });

}




DMS.Toolkit.UI.PopWindow = function (config, record) {

    var pop_line_01 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-top:5px; margin-bottom:5px;',
        items: [
                        {
                            id: 'txt_toolkit_name',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_name : '',
                            fieldLabel: 'Toolkit Name',
                            readOnly: true,
                            width: 300,
                            labelWidth: 100,
                            allowBlank: true
                        }
                    ]
    });


    var pop_line_02 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-top:5px; margin-bottom:5px;',
        items: [
                        {
                            id: 'txt_toolkit_size',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_length : '',
                            fieldLabel: 'Toolkit Size',
                            readOnly: true,
                            width: 300,
                            labelWidth: 100,
                            allowBlank: true
                        }
                    ]
    });


    var pop_line_03 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-top:5px; margin-bottom:5px;',
        items: [
                        {
                            id: 'txt_author',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_author : '',
                            fieldLabel: 'Author',
                            readOnly: true,
                            width: 300,
                            labelWidth: 100,
                            allowBlank: true
                        }
                    ]
    });

    var pop_line_04 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-top:5px; margin-bottom:5px;',
        items: [
                        {
                            id: 'txt_version',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_version : '',
                            fieldLabel: 'Version',
                            readOnly: true,
                            width: 300,
                            labelWidth: 100,
                            allowBlank: true
                        }
                    ]
    });



    var win = new Ext.window.Window({
        id: 'win',
        autoShow: true,
        title: config.title ? config.title : "Window",
        width: 430,
        autoHeight: true,
        plain: true,
        items: [
                        pop_line_01,
                        pop_line_02,
                        pop_line_03,
                        pop_line_04
                    ],
        modal: true,
        resizable: false,
        frame: true,
        buttons: [
                            {
                                text: 'Submit',
                                handler: function () {
                                    if (record) {
                                        doUpdate();
                                    } else {
                                        doCreate();
                                    }
                                }
                            },
                            {
                                text: 'Cancel', handler: function () {
                                    win.close();
                                }
                            }
                        ],
        buttonAlign: 'center'
    });

    return win;
}