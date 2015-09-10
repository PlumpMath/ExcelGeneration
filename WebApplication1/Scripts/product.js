function PageBind() {
    var obj = Xrm.Page.getAttribute("new_produce_cd").getValue();

    var id = obj[0].id.replace('{', '').replace('}', '');

    ///alert(id);

    $.ajax({
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: false,
        url: "http://192.168.0.5/GDCCRM2011/XRMServices/2011/OrganizationData.svc/new_produceSet(guid'" + id + "')",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, status, XMLHttpRequest) {
            ///alert(Ext.encode(data.d.new_produce_enddate));
            Xrm.Page.getAttribute("new_type").setValue(parseInt(data.d.new_produce_type.Value));

            ///Xrm.Page.getAttribute("new_type").selectIndex = data.d.new_produce_type.Value;
            var value = new Array();
            var olookup = new Object();
            olookup.id = data.d.new_factory_cd.Id;
            olookup.name = data.d.new_factory_cd.Name;
            olookup.entityType = data.d.new_factory_cd.LogicalName;
            value[0] = olookup;
            Xrm.Page.getAttribute("new_factory_cd").setValue(value);

            var mydate = new Date(parseInt(data.d.new_produce_enddate.replace("/Date(", "").replace(")/", ""), 10));
            Xrm.Page.getAttribute("new_produce_enddate").setValue(mydate);
            
        }
    });
}