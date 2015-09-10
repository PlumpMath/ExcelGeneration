/// <reference path="../Extjs_42/ext.js" />
/// <reference path="jquery-1.4.1-vsdoc.js" />

Ext.namespace('DMS.InOutStock.UI');

Ext.onReady(function () {
    DMS.InOutStock.UI();
});

DMS.InOutStock.UI = function (config) {

    var entity = {};
    var mylist = [];


    /*
    entity.type = "入库";
    entity.id = "new_instockId";
    entity.code = "new_inbound_cd";
    entity.date = new Date();
    entity.stcd = "ST001";
    entity.stnm = "倉庫001";
    entity.memo = "倉庫001";
    */

    /*var memo = new Ext.form.HtmlEditor({
    id: 'htmleditor',
    fieldLabel: '介绍',
    hideLabel: false,
    labelStyle: "text-align:right;",
    name: 'html',
    enableColors: false,
    value: '我是一个三好学生。',
    height: 110,
    width: 780
    });*/



    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: false,
        url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_instockSet",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, status, XMLHttpRequest) {
            if (data && data.d.results) {
                var stock = data.d.results;
                Ext.each(stock, function (n) {
                    entity = {};
                    entity.type = "入库";
                    entity.id = n.new_instockId;
                    entity.code = n.new_inbound_cd;
                    entity.date = n.new_inbound_date;
                    entity.stcd = n.new_stock_nm;
                    entity.stnm = n.new_stock_cd.Name;
                    entity.memo = n.new_inbound_memo;
                    mylist.push(entity);
                });
            }
        }
    });

    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: false,
        url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_outstockSet",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, status, XMLHttpRequest) {
            if (data && data.d.results) {
                var stock = data.d.results;
                Ext.each(stock, function (n) {
                    entity = {};
                    entity.type = "出库";
                    entity.id = n.new_outstockId;
                    entity.code = n.new_outbound_cd;
                    entity.date = n.new_outbound_date;
                    entity.stcd = n.new_stock_nm;
                    entity.stnm = n.new_stock_cd.Name;
                    entity.memo = n.new_outbound_memo;
                    mylist.push(entity);
                });
            }
        }
    });

    mylist.push(entity);

    /// 区別	コード	入/出庫日	倉庫コード	倉庫名称	メモ
    var store = Ext.create('Ext.data.Store', {
        fields: ['type', 'code', 'date', 'stcd', 'stnm', 'memo']
    });



    store.loadData(mylist);

    //var editor = Ext.create('Ext.form.TextField', {});

    var grid = Ext.create('Ext.grid.Panel', {
        id: 'grid',
        columnWidth: 1,
        autoHeight: true,
        frame: true,
        store: store,
        forceFit: true,
        columns: [
                            { text: '区別', width: 100, sortable: true, dataIndex: 'type', align: 'center' },
                            { text: 'コード', width: 100, sortable: true, dataIndex: 'code', align: 'center' },
                            { text: '入/出庫日', width: 200, sortable: true, dataIndex: 'date', align: 'center', renderer: changeMyDate },
                            { text: '倉庫コード', width: 110, sortable: true, dataIndex: 'stcd', align: 'left' },
                            { text: '倉庫名称', width: 110, sortable: true, dataIndex: 'stnm', align: 'left' },
                            { text: 'メモ', width: 150, sortable: true, dataIndex: 'memo', align: 'left' }
                        ]
    });

    var txt_product = new Ext.form.TextField({
        id: 'txt_product',
        labelStyle: "text-align:right;",
        emptyText: '',
        fieldLabel: '制品',
        width: 240,
        style: 'margin-top:0px'
    });

    var btn_lookup = new Ext.Button({
        id: 'btn_lookup',
        text: 'search',
        handler: function () {

            txt_product.setValue('');

            var url = "http://192.168.0.5/GDCCRM2011/_controls/lookup/lookupinfo.aspx?AllowFilterOff=1&DefaultType=10026&DefaultViewId=%7b85E5C437-3F65-4F51-9D7E-570974EF3807%7d&DisableQuickFind=0&DisableViewPicker=0&LookupStyle=single&ShowNewButton=1&ShowPropButton=1&browse=0&currentid=%7b2549969D-44ED-E311-B01C-8851FB6DA383%7d&objecttypes=10026"

            var res = window.showModalDialog(url);

            if (res && res.items.length > 0) {
                if (res.items[0].name) {
                    txt_product.setValue(res.items[0].name);
                }
            }
        }
    });

    var look = new Ext.Panel({
        layout: 'column',
        frame: true,
        items: [
                        txt_product,
                        btn_lookup
                    ]
    });

    var mainPanel = new Ext.Panel({
        title: "入库出库",
        width: '100%',
        minWidth: 1024,
        layout: "form",
        autoHeight: true,
        frame: true,
        border: false,
        items:
        [
            look,
            grid
        ],
        renderTo: Ext.getBody()
    });



}