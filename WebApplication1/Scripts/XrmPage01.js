/// <reference path="../Extjs_42/ext.js" />
/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../XrmServiceToolkit/XrmServiceToolkit.js" />

Ext.namespace('DMS.XrmPage');

Ext.onReady(function () {

    var res = XrmServiceToolkit.Rest.Retrieve(
                "FA0090C3-F9DB-E311-B128-8851FB6DA383",
                "AccountSet",
                null, null,
                function (result) {

                    alert(Ext.encode(result));
                    var Id = result.AccountId;
                    equals(Id, "FA0090C3-F9DB-E311-B128-8851FB6DA383", "Retrieve() method should return the same account ID as Create() result. ");
                },
                function (error) {
                    equal(true, false, error.message);
                },
                false
            );

                alert(res);


    //DMS.XrmPage.UI({});
});

DMS.XrmPage.UI = function (config) {
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
        columns: [
                            { text: 'Guid', width: 230, sortable: true, dataIndex: 'new_universitystudentId', align: 'center' },
                            { text: 'ID', width: 90, sortable: true, dataIndex: 'new_id', align: 'center' },
                            { text: 'Name', width: 120, sortable: true, dataIndex: 'new_name', align: 'left' },
                            { text: 'Email', width: 150, sortable: true, dataIndex: 'new_email', align: 'left' },
                            { text: 'ModifyDate', width: 150, sortable: true, dataIndex: 'ModifiedOn', align: 'center', renderer: changeMyDate }
                        ],
        renderTo: Ext.getBody(),
        style: 'margin:1px 10px;'
    });


}