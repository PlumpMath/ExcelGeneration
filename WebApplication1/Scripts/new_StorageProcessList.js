/// <reference path="../Extjs_42/ext.js" />
/// <reference path="jquery-1.4.1-vsdoc.js" />
Ext.namespace('DMS.StorageList.UI');

Ext.onReady(function () {
    DMS.StorageList.UI();
});

DMS.StorageList.UI = function (config) {

    var entity = {};
    var mylist = [];

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

    var editor = Ext.create('Ext.form.TextField', {




});


var grid = Ext.create('Ext.grid.Panel', {
    id: 'grid',
    width: 790,
    autoHeight: true,
    frame: true,
    store: store,
    columns: [
                            { text: '区別', width: 100, sortable: true, dataIndex: 'type', align: 'center' },
                            { text: 'コード', width: 100, sortable: true, dataIndex: 'code', align: 'center' },
                            { text: '入/出庫日', width: 200, sortable: true, dataIndex: 'date', align: 'center', renderer: changeMyDate },
                            { text: '倉庫コード', width: 110, sortable: true, dataIndex: 'stcd', align: 'left' },
                            { text: '倉庫名称', width: 110, sortable: true, dataIndex: 'stnm', align: 'left' },
                            { text: 'メモ', width: 150, sortable: true, dataIndex: 'memo', align: 'left', editor: { xtype: 'textfield'} }
                        ],
    selType: 'cellmodel',
    plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        ]
});

var mainPanel = new Ext.Panel({
    title: "入库出库",
    width: 800,
    layout: "column",
    autoHeight: true,
    frame: true,
    border: false,
    items:
        [
    //memo,
            grid
        ],
    buttons:
        [{
            text: 'Update',
            handler: function () {
                var stock = store.getModifiedRecords();              //获取所有更新过的记录
                var recordCount = stock.length;               //获取数据集中记录的数量
                if (recordCount == 0) return false;

                var _stock;

                for (var i = 0; i < recordCount; i++) {

                    _stock = {};

                    var url = "";

                    if (stock[i].data.type == "入库") {
                        url = "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_instockSet(guid'" + stock[i].data.id + "')";
                        _stock.new_inbound_memo = stock[i].data.memo;
                    }
                    else {
                        url = "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_outstockSet(guid'" + stock[i].data.id + "')";
                        _stock.new_outbound_memo = stock[i].data.memo;
                    }

                    //                    alert(Ext.encode(_stock));

                    //                    return;

//                    $.ajax({
//                        type: "PUT",
//                        contentType: 'application/json; charset=utf-8',
//                        dataType: "json",
//                        async: false,
//                        url: url,
//                        data: Ext.encode(_stock),
//                        beforeSend: function (XMLHttpRequest) {
//                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
//                        },
//                        success: function (data, status, XMLHttpRequest) {
//                            store.commit();
//                        },
//                        error: function (data) {
//                        }
//                    });





                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        data: Ext.encode(_stock),
                        url: url,
                        beforeSend: function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
                            XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                        },
                        success: function (data, textStatus, XmlHttpRequest) {                           
                        },
                        error: function (XmlHttpRequest, textStatus, errorThrown) {
                        }
                    });


                }
                store.commitChanges();
            }
        }],
    renderTo: Ext.getBody()
});



}