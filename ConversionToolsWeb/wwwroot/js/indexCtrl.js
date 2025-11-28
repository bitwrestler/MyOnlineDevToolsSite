document.addEventListener('DOMContentLoaded', function () {
    let possibleControls = [true, false];

    for (let i = 0; i < possibleControls.length; i++) {
        let controlIds = _getControlIds(possibleControls[i]);
        $(controlIds.date).change(function () {
            $(controlIds.numeric).val('');
            evalEnableConvert();
        });
        $(controlIds.numeric).change(function () {
            $(controlIds.date).val('');
            evalEnableConvert();
        });
    }
    getNows();
});

function _getControlIds(ticksOrUnix) {
    if (ticksOrUnix) {
        return { numeric: "#ticksEntry", date: "#dateEntry", tz: "#timeZoneSelect", button: "#convertButton" };
    } else {
        return { numeric: "#unixEpochEntry", date: "#unixDateEntry", tz: "#unixTimeZoneSelect", button: "#unixConvertButton" };
    }
}

function convert(ticksOrUnix) {

    let controlIds = _getControlIds(ticksOrUnix);

    if (!checkEnableConvert(controlIds)) {
        return;
    }
    let dateVal = $(controlIds.date).val();
    let ticksVal = $(controlIds.numeric).val();
    let timeZoneVal = $(controlIds.tz).val();
    if (dateVal) {

        convertDateToTicks(ticksOrUnix, dateVal, timeZoneVal, function (data) { $(controlIds.numeric).val(data.ticks); });
    }
    else if (ticksVal) {
        convertTicksToDate(ticksVal, timeZoneVal, function (data) { $(controlIds.date).val(data.dateTime); });
    }
}

function convertDateToTicks(ticksOrUnix,  dateStr, timeZone, callback) {
    let model = { DateTime: dateStr, TimeZoneId: timeZone };
    let url = ticksOrUnix ? "/api/to-ticks" : "/api/to-unix";
    makePostRequest(url, model, callback);
}

function convertTicksToDate(ticksOrUnix, ticksStr, timeZone,callback) {
    let model = { Ticks: ticksStr, TimeZoneId: timeZone };
    let url = ticksOrUnix ? "/api/from-ticks" : "/api/from-unix";
    makePostRequest(url, model, callback);
}

function evalEnableConvert(controlIds) {
    $(controlIds.button).prop('disabled', !checkEnableConvert());
}

function checkEnableConvert(controlIds) {
    return !!($(controlIds.date).val || $(controlIds.numeric).val);
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