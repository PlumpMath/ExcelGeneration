/// <reference path="../Extjs_42/ext.js" />


Ext.namespace('DMS.Sample.UI');


Ext.onReady(function () {
    DMS.Sample.UI();

    DMS.Sample.UI.GetData();
});

DMS.Sample.UI = function (config) {

    var txt_student_code = new Ext.form.NumberField({
        id: 'txt_student_code',
        labelStyle: "text-align:right;",
        emptyText: '',
        value: '',
        fieldLabel: '学号',
        width: 550,
        labelWidth: 100,
        style: 'margin-bottom:5px;',
        allowBlank: true
    });

    var txt_student_name = new Ext.form.TextField({
        id: 'txt_student_name',
        labelStyle: "text-align:right;",
        emptyText: '',
        value: '',
        fieldLabel: '姓名',
        width: 550,
        labelWidth: 100,
        style: 'margin-bottom:5px;'
    });

    var txt_student_email = new Ext.form.TextField({
        id: 'txt_student_email',
        labelStyle: "text-align:right;",
        emptyText: '',
        value: '',
        fieldLabel: 'Email',
        width: 550,
        labelWidth: 100,
        style: 'margin-bottom:5px;'
    });

    var date_birthday = new Ext.form.DateField({
        id: 'date_birthday',
        labelStyle: "text-align:right;",
        value: new Date(),
        fieldLabel: '出生日期',
        width: 550,
        labelWidth: 100,
        format: 'Y-m-d',
        style: 'margin-bottom:5px;'
    })

    var cbx_highschool = new Ext.form.ComboBox({
        id: 'cbx_highschool',
        fieldLabel: '高中毕业',
        labelStyle: "text-align:right;",
        store: ['第一高中', '第二高中', '第三高中'],
        width: 550,
        labelWidth: 100,
        displayField: 'key',
        valueField: 'value',
        style: 'margin-bottom:5px;'
    })

    var txt_student_age = new Ext.form.NumberField({
        id: 'txt_student_age',
        labelStyle: "text-align:right;",
        emptyText: '',
        value: '',
        fieldLabel: '入学年龄',
        width: 550,
        labelWidth: 100,
        style: 'margin-bottom:5px;'
    });

    var txt_student_weight = new Ext.form.NumberField({
        id: 'txt_student_weight',
        labelStyle: "text-align:right;",
        emptyText: '',
        value: '',
        fieldLabel: '体重',
        width: 550,
        labelWidth: 100,
        style: 'margin-bottom:5px;'
    });

    var txt_student_height = new Ext.form.NumberField({
        id: 'txt_student_height',
        labelStyle: "text-align:right;",
        emptyText: '',
        value: '',
        fieldLabel: '身高',
        width: 550,
        labelWidth: 100,
        style: 'margin-bottom:5px;'
    });

    var mainPanel = new Ext.Panel({
        title: "学生",
        width: 800,
        layout: "column",
        autoHeight: true,
        frame: true,
        border: false,
        items:
        [
            txt_student_code,
            {
                xtype: 'label',
                id: 'lab_check_student_code',
                html: '',
                style: 'margin:5px;3px; color:red'
            },
            txt_student_name,
            txt_student_email,
            {
                xtype: 'label',
                id: 'lab_check_student_email',
                html: '',
                style: 'margin:5px;3px; color:red'
            },
            {
                hideLabel: false,
                id: 'radio_student_sex',
                xtype: 'radiogroup',
                fieldLabel: '性别',
                labelStyle: "text-align:right;",
                labelWidth: 100,
                width: 550,
                columns: [80, 500],
                items: [
                                    { id: 'rad_sex_01', boxLabel: '男', checked: true, name: 'radiogrp2', inputValue: 0 },
                                    { id: 'rad_sex_02', boxLabel: '女', name: 'radiogrp2', inputValue: 1 }
                              ]
            },
            date_birthday,
            cbx_highschool,
            txt_student_age,
            txt_student_weight,
            txt_student_height,
            {

                xtype: 'htmleditor',
                id: 'htmleditor',
                fieldLabel: '介绍',
                hideLabel: false,
                labelStyle: "text-align:right;",
                name: 'html',
                enableColors: false,
                value: '我是一个三好学生。',
                height: 110,
                width: 550
            }
        ],
        style: 'margin:10px 10px;',
        buttons:
        [
            { text: '保存', handler: function () { Valid(); } },
            { text: '取消' }
        ],
        buttonAlign: 'center',
        renderTo: Ext.getBody()
    });

    function Valid() {

        Ext.fly("lab_check_student_code").dom.innerHTML = '';
        Ext.fly("lab_check_student_email").dom.innerHTML = '';

        /// 验证学号
        var student_code = Ext.getCmp("txt_student_code").getValue();
        if (student_code == null || student_code < 0) {
            Ext.fly("lab_check_student_code").dom.innerHTML = '学号应该为正整数';
        }

        /// 验证email
        var student_email = Ext.getCmp("txt_student_email").getValue();
        if (!IsEmail(student_email)) {
            Ext.fly("lab_check_student_email").dom.innerHTML = '不是正确的email';
        }


    }
}


DMS.Sample.UI.GetData = function () {
    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: false,
        url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_universitystudentSet(guid'b82c416a-43db-e311-b5d5-8851fb6da383')",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, status, XMLHttpRequest) {
            DMS.Sample.UI.SetData(data);
        }
    });
}

DMS.Sample.UI.SetData = function (data) {

    Ext.getCmp('txt_student_code').setValue(data.d.new_id);
    Ext.getCmp('txt_student_name').setValue(data.d.new_name);
    Ext.getCmp('txt_student_email').setValue(data.d.new_email);

    if (data.d.new_sex == 1 || data.d.new_sex == true) {
        Ext.getCmp('rad_sex_01').setValue('1');
    } else {
        Ext.getCmp('rad_sex_01').setValue('0');
    }

    Ext.getCmp('txt_student_email').setValue(data.d.new_email);

    Ext.getCmp('htmleditor').setValue(Ext.encode(data));

}




function IsEmail(email) {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

    if (reg.test(email)) {
        return true;
    }
    return false;
}

