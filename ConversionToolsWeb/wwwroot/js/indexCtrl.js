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
    getNows();
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
    makePostRequest("/api/to-ticks", model,callback);
}

function convertTicksToDate(ticksStr, timeZone,callback) {
    let model = { Ticks: ticksStr, TimeZoneId: timeZone };
    makePostRequest("/api/from-ticks", model, callback);
}

function evalEnableConvert() {
    $(convertButtonId).prop('disabled', !checkEnableConvert());
}

function checkEnableConvert() {
    return !!($(dateId).val || $(ticksId).val);
}

function getNows() {
    let nowRoutine = function (data) {
        const nowElement = $("#nowResult");
        nowElement.empty();
        data.forEach(function (item, idx) {
            let newRow = $("<div>").addClass("grid").appendTo(nowElement);
            $("<div>").text(item.timeZoneId).appendTo(newRow);
            $("<div>").text(item.dateTime).appendTo(newRow);
        });
    };
    makeGetRequest("/api/now",nowRoutine);
}

function makeGetRequest(url, callback)
{
    _makeRequest(url, null, callback, "GET");
}

function makePostRequest(url, model, callback)
{
    _makeRequest(url, model, callback, "POST");
}

function _makeRequest(url, model, callback, requestType) {
    let errorCallback = function (jqXHR, textStatus, errorThrown) {
        console.log("ERROR", textStatus, errorThrown);
        console.log(jqXHR);
    };
    if (model) {
        model = JSON.stringify(model);
    }
    $.ajax({
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: requestType,
        data: model,
        success: callback,
        error: errorCallback
    });
}