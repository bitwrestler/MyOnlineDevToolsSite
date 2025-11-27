let ticksId = "#ticksEntry";
let dateId = "#dateEntry";
let timeZoneSelectId = "#timeZoneSelect";
let convertButtonId = "#convertButton";

document.addEventListener('DOMContentLoaded', function () {
    $(dateId).change(function () {
        $(ticksId).val('');
        evalEnableConvert();
    });
    $(ticksId).change(function () {
        $(dateId).val('');
        evalEnableConvert();
    });
});

function convert() {
    if (! checkEnableConvert()) {
        return;
    }
    let dateVal = $(dateId).val();
    let ticksVal = $(ticksId).val();
    let timeZoneVal = $(timeZoneSelectId).val();
    if (dateVal) {

        convertDateToTicks(dateVal, timeZoneVal, function (data) { $(ticksId).val(data.ticks); });
    }
    else if (ticksVal) {
        convertTicksToDate(ticksVal, timeZoneVal, function (data) { $(dateId).val(data.dateTime); });
    }
}

function convertDateToTicks(dateStr, timeZone, callback) {
    let model = { DateTime: dateStr, TimeZoneId: timeZone };
    _makeRequest("/api/to-ticks", model,callback);
}

function convertTicksToDate(ticksStr, timeZone,callback) {
    let model = { Ticks: ticksStr, TimeZoneId: timeZone };
    _makeRequest("/api/from-ticks", model, callback);
}

function evalEnableConvert() {
    $(convertButtonId).prop('disabled', !checkEnableConvert());
}

function checkEnableConvert() {
    return !!($(dateId).val || $(ticksId).val);
}

function _makeRequest(url, model, callback, requestType = "POST") {
    let errorCallback = function (jqXHR, textStatus, errorThrown) {
        console.log("ERROR", textStatus, errorThrown);
        console.log(jqXHR);
    };
    $.ajax({
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: requestType,
        data: JSON.stringify(model),
        success: callback,
        error: errorCallback
    });
}