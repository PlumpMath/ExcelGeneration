


function IsEmail(email) {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (reg.test(email)) {
        return true;
    }
    return false;
}


function changeMyDate(date) {
    if (date == null || date == '') return null;
    if (date) {
        var type = date instanceof Date;

        if (!type) {
            var date = new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
        }
        var yyyy = date.getFullYear();
        var month = date.getMonth() + 1;
        var mm = month < 10 ? "0" + month : month;
        var day = date.getDate();
        var dd = day < 10 ? "0" + day : day;

        var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var ff = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + ff + ":" + ss;
    }
}

function parseDecimal(number) {

    if (!number||parseFloat(number) == NaN) {
        return "0.0000000000";
    }
    var myTmp = parseFloat(number).toString();
    var array = myTmp.split('.');
    var myLen = 0;

    if (array.length == 1) {
        myTmp += ".";
    } else {
        myLen = array[1].length;
    }

    for (var i = 10; i > myLen; i--) {
        myTmp += "0";
    }

    return myTmp;
}

function createEntity(LogicalName, Id, Name) {

    var entity = {};
    entity.__metadata = { "type": "Microsoft.Crm.Sdk.Data.Services.EntityReference" };
    entity.Id = Id;
    entity.LogicalName = LogicalName;
    entity.Name = Name;

    return entity;

}
