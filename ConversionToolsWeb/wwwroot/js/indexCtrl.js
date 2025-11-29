const convertTypes = { Ticks: 1, Unix: 2, TimeSpan : 3 };

document.addEventListener('DOMContentLoaded', function () {
    let possibleControls = Object.values(convertTypes);

    for (let i = 0; i < possibleControls.length; i++) {
        let controlIds = _getControlIds(possibleControls[i]);
        $(controlIds.date).change(function () {
            if ($(controlIds.date).val()) {
                $(controlIds.numeric).val('');
            }
            evalEnableConvert(controlIds);
        });
        $(controlIds.numeric).change(function () {
            if ($(controlIds.numeric).val()) {
                $(controlIds.date).val('');
            }
            evalEnableConvert(controlIds);
        });
        evalEnableConvert(controlIds);
    }

    // Allow double-click on any input in the form to clear its own value.
    // Use delegated handler so it works for inputs that may be added/changed later.
    $(document).on('dblclick', '#convertForm input[type="text"], #convertForm input[type="number"]', function (e) {
        $(this).val('');
        evalEnableConvertAll();
    });

    getNows();

});

function _getControlIds(convertType) {
    switch (convertType) {
        case convertTypes.Unix:
            return { numeric: "#unixEpochEntry", date: "#unixDateEntry", tz: "#unixTimeZoneSelect", button: "#unixConvertButton" };
        case convertTypes.TimeSpan:
            return { numeric: "#timespanTicksEntry", date: "#timespanDateEntry", tz: null, button: "#timespanConvertButton" };
        default:
            return { numeric: "#ticksEntry", date: "#dateEntry", tz: "#timeZoneSelect", button: "#convertButton" };
    }
}

function convertTicks(dateTime, timzoneId) {
    let controlIds = _getControlIds(convertTypes.Ticks);
    $(controlIds.numeric).val('');
    $(controlIds.date).val(dateTime);
    $(controlIds.tz).val(timzoneId);
    evalEnableConvert(controlIds);
    convert(convertTypes.Ticks);
}

function convert(convertType) {

    let controlIds = _getControlIds(convertType);

    if (!checkEnableConvert(controlIds)) {
        return;
    }
    let dateVal = $(controlIds.date).val().replace(/Z$/, "");
    let ticksVal = $(controlIds.numeric).val();
    let timeZoneVal = $(controlIds.tz)?.val();
    if (dateVal) {

        convertDateToTicks(convertType, dateVal, timeZoneVal, function (data) { $(controlIds.numeric).val(data.ticks); });
    }
    else if (ticksVal) {
        convertTicksToDate(convertType, ticksVal, timeZoneVal, function (data) { $(controlIds.date).val(data.dateTime); });
    }
}

function convertDateToTicks(convertType,  dateStr, timeZone, callback) {
    let model = { DateTime: dateStr, TimeZoneId: timeZone };

    var url = "/api/to-ticks";
    switch (convertType) {
        case convertTypes.Unix:
            url = "/api/to-unix";
        case convertTypes.TimeSpan:
            url = "/api/timespan/to-ticks";
    }
    makePostRequest(url, model, callback);
}

function convertTicksToDate(convertType, ticksStr, timeZone,callback) {
    let model = { Ticks: ticksStr, TimeZoneId: timeZone };

    var url = "/api/from-ticks";
    switch (convertType) {
        case convertTypes.Unix:
            url = "/api/from-unix";
        case convertTypes.TimeSpan:
            url = "/api/timespan/from-ticks";
    }
    makePostRequest(url, model, callback);
}

function evalEnableConvertAll() {
    for (const convertType of Object.values(convertTypes)) {
        const controlIds = _getControlIds(convertType);
        evalEnableConvert(controlIds);
    }
}

function evalEnableConvert(controlIds) {
    $(controlIds.button).prop('disabled', !checkEnableConvert(controlIds));
}

function checkEnableConvert(controlIds) {
    return !!($(controlIds.date).val() || $(controlIds.numeric).val());
}

function getNows() {
    let nowRoutine = function (data) {
        const nowElement = $("#nowResult");
        nowElement.empty();
        data.forEach(function (item, idx) {
            let newRow = $("<div>").addClass("grid").appendTo(nowElement);
            $("<div>").text(item.timeZoneId).appendTo(newRow);
            const nowDiv = $("<div>").appendTo(newRow);

            const copyClipboard = $("<span>").appendTo(nowDiv);
            $("<img>")
                .attr("src", "/copy.png")
                .attr("title", "Copy to clipboard: " + item.dateTime)
                .addClass("copy-to-clipboard")
                .click(function () {
                    copyToClipboard(item.dateTime);
                })
                .appendTo(copyClipboard)
                ;

            $("<a>")
                .attr("href", "javascript:void(0);")
                .text(item.dateTime)
                .click(function () { convertTicks(item.dateTime, item.timeZoneId); })
                .appendTo(nowDiv);

            
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