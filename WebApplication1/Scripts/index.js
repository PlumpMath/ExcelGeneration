/// <reference path="../Extjs_42/ext.js" />
/// <reference path="jquery-1.4.1-vsdoc.js" />

Ext.namespace('DMS.Index');

Ext.onReady(function () {
    DMS.Index.UI(null);
});


DMS.Index.UI = function (config) {

    var store = Ext.create('Ext.data.Store', {
        fields: ['new_universitystudentId', 'new_id', 'new_name', 'new_email', 'new_birthday', 'new_age', 'new_height', 'new_sex', 'new_weight', 'new_highschool', 'ModifiedOn'],
        proxy: {
            type: 'ajax',
            reader: { type: 'json', root: "d.results" },
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_universitystudentSet"
        }
    });

    store.load();

    var sm = Ext.create('Ext.selection.CheckboxModel', {
        dataIndex: 'new_universitystudentId',
        mode: 'SINGLE',
        allowDeselect: true,
        showHeaderCheckbox: false
    });


    var grid = Ext.create('Ext.grid.Panel', {
        id: 'grid',
        title: '学生列表',
        width: 800,
        height: 300,
        frame: true,
        store: store,
        selModel: sm,
        //style: 'margin-top:30px;',
        columns: [
                            { text: 'Guid', width: 230, sortable: true, dataIndex: 'new_universitystudentId', align: 'center' },
                            { text: 'ID', width: 90, sortable: true, dataIndex: 'new_id', align: 'center' },
                            { text: 'Name', width: 120, sortable: true, dataIndex: 'new_name', align: 'left' },
                            { text: 'Email', width: 150, sortable: true, dataIndex: 'new_email', align: 'left' },
                            { text: 'ModifyDate', width: 150, sortable: true, dataIndex: 'ModifiedOn', align: 'center', renderer: changeMyDate }
                        ],
        dockedItems: [
                                    {
                                        xtype: 'toolbar',
                                        items: [
                                                        {
                                                            text: 'Create',
                                                            scope: this,
                                                            handler: function () {
                                                                DMS.Index.UI.PopWindow({ title: 'Create Window' }, null).show();
                                                            }
                                                        },
                                                        {
                                                            text: 'Update',
                                                            scope: this,
                                                            handler: function () {
                                                                var records = grid.getSelectionModel().getSelection();
                                                                if (records.length == 0) {
                                                                    Ext.MessageBox.alert("提示", "请选择一条记录");
                                                                } else {
                                                                    DMS.Index.UI.PopWindow({ title: 'Update Window' }, records[0]).show();
                                                                }
                                                            }
                                                        },
                                                        {
                                                            text: 'Delete',
                                                            scope: this,
                                                            handler: function () {
                                                                var records = grid.getSelectionModel().getSelection();
                                                                if (records.length == 0) {
                                                                    Ext.MessageBox.alert("提示", "请选择一条记录");
                                                                } else {
                                                                    $.ajax({
                                                                        type: "DELETE",
                                                                        contentType: 'application/json; charset=utf-8',
                                                                        dataType: "json",
                                                                        async: false,
                                                                        url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_universitystudentSet(guid'" + records[0].data.new_universitystudentId + "')",
                                                                        beforeSend: function (XMLHttpRequest) {
                                                                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
                                                                        },
                                                                        success: function (data, status, XMLHttpRequest) {
                                                                            store.reload();
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
                                                            text: 'Test',
                                                            scope: this,
                                                            handler: function () {
                                                                var res = XrmServiceToolkit.Rest.Retrieve(
                                                                                "FA0090C3-F9DB-E311-B128-8851FB6DA383",
                                                                                "AccountSet",
                                                                                null, null,
                                                                                function (result) {
                                                                                    alert(Ext.encode(result));
                                                                                },
                                                                                function (error) {
                                                                                    equal(true, false, error.message);
                                                                                },
                                                                                false
                                                                            );

                                                            }
                                                        }
                                                    ]
                                    }
                                ],
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: '显示 {0}   -   {1} 条，共计 {2}条',
            emptyMsg: '没有数据'
        }),
        renderTo: "mainPanel"
    });
};


DMS.Index.UI.PopWindow = function (config, record) {

    var pop_line_01 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-top:5px; margin-bottom:5px;',
        items: [
                        {
                            id: 'num_student_code',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_id : '',
                            fieldLabel: '学号',
                            readOnly: true,
                            width: 300,
                            labelWidth: 100,
                            allowBlank: true
                        },
                         {
                             xtype: 'label',
                             id: 'lab_student_code',
                             html: '自动分配，不能修改',
                             style: 'margin-left:5px; margin-top:5px; color:red ;'
                         }
                    ]
    });

    var pop_line_02 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-bottom:5px;',
        items: [
                        {
                            id: 'txt_student_name',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_name : '',
                            fieldLabel: '姓名',
                            width: 300,
                            labelWidth: 100
                        },
                        {
                            hideLabel: false,
                            id: 'radio_student_sex',
                            xtype: 'radiogroup',
                            fieldLabel: '性别',
                            labelStyle: "text-align:right;",
                            labelWidth: 100,
                            width: 300,
                            columns: [50, 80],
                            items: [
                                                            { id: 'rad_sex_01', boxLabel: '男', checked: true, name: 'radiogrp2', inputValue: 0 },
                                                            { id: 'rad_sex_02', boxLabel: '女', name: 'radiogrp2', inputValue: 1 }
                                                      ]
                        }
                    ]
    });

    if (record) {
        if (record.data.new_sex) {
            Ext.getCmp('rad_sex_02').setValue(1);
        } else {
            Ext.getCmp('rad_sex_02').setValue(0);
        }
    }

    var pop_line_03 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-bottom:5px;',
        items: [
                        {
                            id: 'txt_student_email',
                            xtype: 'textfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_email : '',
                            fieldLabel: 'Email',
                            width: 300,
                            labelWidth: 100
                        },
                        {
                            id: 'date_birthday',
                            xtype: 'datefield',
                            labelStyle: "text-align:right;",
                            fieldLabel: '出生日期',
                            width: 300,
                            labelWidth: 100,
                            value: record && record.data.new_birthday ? new Date((changeMyDate(record.data.new_birthday)).replace(/-/g, "/")) : null,
                            format: 'Y-m-d',
                            style: 'margin-bottom:5px;'
                        }
                    ]
    });


    var school_store = Ext.create('Ext.data.Store', {
        fields: ['new_universityId', 'new_name'],
        proxy: {
            type: 'ajax',
            reader: { type: 'json', root: "d.results" },
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_universitySet"
        }
    });

    var pop_line_05 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-bottom:5px;',
        items: [
                          {
                              id: 'cbx_highschool',
                              xtype: 'combobox',
                              fieldLabel: '高中毕业',
                              labelStyle: "text-align:right;",
                              store: school_store,
                              width: 300,
                              labelWidth: 100,
                              displayField: 'new_name',
                              valueField: 'new_universityId',
                              style: 'margin-bottom:5px;'
                          },
                          {
                              id: 'num_student_age',
                              xtype: 'numberfield',
                              labelStyle: "text-align:right;",
                              emptyText: '',
                              value: record ? record.data.new_age : '',
                              fieldLabel: '入学年龄',
                              width: 300,
                              labelWidth: 100,
                              style: 'margin-bottom:5px;'
                          }
                    ]
    });


    school_store.load({
        callback: function () {
            if (record && record.data.new_highschool) {
                var highschool = record.data.new_highschool;
                Ext.getCmp('cbx_highschool').setValue(highschool.Id);
            }
        }
    });




    var pop_line_07 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-bottom:5px;',
        items: [
                        {
                            id: 'num_student_height',
                            xtype: 'numberfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_height : '',
                            fieldLabel: '身高',
                            width: 300,
                            labelWidth: 100,
                            style: 'margin-bottom:5px;'
                        },
                        {
                            id: 'num_student_weight',
                            xtype: 'numberfield',
                            labelStyle: "text-align:right;",
                            emptyText: '',
                            value: record ? record.data.new_weight : '',
                            fieldLabel: '体重',
                            width: 300,
                            labelWidth: 100,
                            style: 'margin-bottom:5px;'
                        }
                    ]
    });


    var pop_line_09 = Ext.create('Ext.Panel', {
        baseCls: 'x-plain',
        width: 610,
        layout: 'column',
        style: 'margin-bottom:5px;',
        items: [
                        {
                            xtype: 'htmleditor',
                            id: 'htmleditor',
                            fieldLabel: '介绍',
                            hideLabel: false,
                            labelStyle: "text-align:right;",
                            name: 'html',
                            enableColors: false,
                            value: record ? record.data.new_universitystudentId : '',
                            height: 110,
                            width: 600
                        }
                    ]
    });

    var win = new Ext.window.Window({
        id: 'win',
        autoShow: true,
        title: config.title ? config.title : "Window",
        width: 630,
        autoHeight: true,
        plain: true,
        items: [
                        pop_line_01,
                        pop_line_02,
                        pop_line_03,
                        pop_line_05,
                        pop_line_07,
                        pop_line_09
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
                                    //alert(unescape('\u5904\u7406\u8bf7\u6c42\u6d41\u65f6\u51fa\u9519\u3002\u5c06\u5c5e\u6027\u201cId\u201d\u7684\u8bf7\u6c42\u8d1f\u8f7d\u4e2d\u7684\u503c\u8f6c\u6362\u4e3a\u8be5\u5c5e\u6027\u5e94\u6709\u7684\u7c7b\u578b\u201cGuid\u201d\u65f6\u9047\u5230\u4e86\u9519\u8bef\u3002\u6709\u5173\u66f4\u591a\u8be6\u7ec6\u4fe1\u606f\uff0c\u8bf7\u53c2\u89c1\u5185\u90e8\u5f02\u5e38\u3002'));
                                    win.close();
                                }
                            }
                        ]
    });


    function doCreate() {

        //"new_highschool": {"__metadata": {"type": "Microsoft.Crm.Sdk.Data.Services.EntityReference"}, "Id": "72503e94-11db-e311-b5f6-8851fb6da383", "LogicalName": "new_university", "Name": "\u9ea6\u5f53\u52b3\u5927\u5b66"}

        var schoolid = Ext.getCmp('cbx_highschool').getValue();
        var schoolnm = Ext.getCmp('cbx_highschool').getRawValue();

        var new_universitystudent = {};
        new_universitystudent.new_name = Ext.getCmp('txt_student_name').getValue();
        new_universitystudent.new_email = Ext.getCmp('txt_student_email').getValue();
        new_universitystudent.new_age = Ext.getCmp('num_student_age').getValue();
        new_universitystudent.new_sex = Ext.getCmp('rad_sex_02').getValue();
        new_universitystudent.new_highschool = createEntity("new_university", schoolid, schoolnm);
        new_universitystudent.new_weight = parseDecimal(Ext.getCmp('num_student_weight').getValue());
        new_universitystudent.new_height = parseDecimal(Ext.getCmp('num_student_height').getValue());
        new_universitystudent.new_birthday = Ext.getCmp('date_birthday').getValue();

        //alert(Ext.encode(new_universitystudent));
        if (!valid(new_universitystudent)) return;


        /*
        XrmServiceToolkit.Rest.Create(
                new_universitystudent,
                "new_universitystudentSet",
                function (result) {
                    Ext.getCmp('win').close();
                    Ext.getCmp('grid').getStore().reload();
                },
                function (error) {
                    equal(true, false, error.message);
                },
                false
            );*/


        $.ajax({
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            async: false,
            url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_universitystudentSet",
            data: Ext.encode(new_universitystudent),
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, status, XMLHttpRequest) {
                Ext.getCmp('win').close();
                Ext.getCmp('grid').getStore().reload();
            },
            error: function (data) {
            }
        });
    }

    function doUpdate() {

        var schoolid = Ext.getCmp('cbx_highschool').getValue();
        var schoolnm = Ext.getCmp('cbx_highschool').getRawValue();

        var new_universitystudent = {};
        new_universitystudent.new_name = Ext.getCmp('txt_student_name').getValue();
        new_universitystudent.new_email = Ext.getCmp('txt_student_email').getValue();
        new_universitystudent.new_age = Ext.getCmp('num_student_age').getValue();
        new_universitystudent.new_sex = Ext.getCmp('rad_sex_02').getValue();
        new_universitystudent.new_highschool = createEntity("new_university", schoolid, schoolnm);
        new_universitystudent.new_weight = parseDecimal(Ext.getCmp('num_student_weight').getValue());
        new_universitystudent.new_height = parseDecimal(Ext.getCmp('num_student_height').getValue());
        new_universitystudent.new_birthday = Ext.getCmp('date_birthday').getValue();

        //alert(Ext.encode(new_universitystudent));
        if (!valid(new_universitystudent)) return;

        $.ajax({
            type: "PUT",
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            async: false,
            url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_universitystudentSet(guid'" + record.data.new_universitystudentId + "')",
            data: Ext.encode(new_universitystudent),
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, status, XMLHttpRequest) {
                Ext.getCmp('win').close();
                Ext.getCmp('grid').getStore().reload();
            },
            error: function (data) {
            }
        });
    }

    function valid(student) {

        if (!student.new_name) {
            Ext.MessageBox.alert("提示", "名称不能为空");
            return false;
        }

        if (!student.new_email) {
            Ext.MessageBox.alert("提示", "Email不能为空");
            return false;
        }

        if (!IsEmail(student.new_email)) {
            Ext.MessageBox.alert("提示", "Email格式不正确");
            return false;
        }

        if (!student.new_age) {
            Ext.MessageBox.alert("提示", "年龄不能为空");
            return false;
        }

        if (student.new_age <= 18) {
            Ext.MessageBox.alert("提示", "年龄需要超过18岁");
            return false;
        }

        return true;

    }

    return win;
};
