const convertTypes = {
    Ticks: {
        id: 1,
        evaluation: function () { standardEvaluation(1); }
    },
    Unix: {
        id: 2,
        evaluation: function () { standardEvaluation(2); }
    },
    TimeSpan: {
        id: 3,
        evaluation: function () { standardEvaluation(3); }
    },
    TicksDifference: {
        id: 4,
        evaluation: function () { ticksDifferenceEvaluation(4); }
    }
};
const baseApiUrl = "/api/datetime";

document.addEventListener('DOMContentLoaded', function () {
    let possibleControls = Object.values(convertTypes);

    for (let i = 0; i < possibleControls.length; i++) {
        let evaluationFunc = possibleControls[i].evaluation;
        if (evaluationFunc) {
            evaluationFunc();
        }
    }

    // Allow double-click on any input in the form to clear its own value.
    // Use delegated handler so it works for inputs that may be added/changed later.
    $(document).on('dblclick', '#convertForm input[type="text"], #convertForm input[type="number"]', function (e) {
        $(this).val('');
        evalEnableConvertAll();
    });

    getNows();

});

function standardEvaluation(convertId) {
    _initConvertTypedEvalListener(_getConvertTypeById(convertId));
};

function ticksDifferenceEvaluation(convertId) {
    let enableFunc = function (cids) { $(cids.button).prop('disabled', !($(cids.numeric).val() && $(cids.date).val()) ); };
    let controlIds = _getControlIds(_getConvertTypeById(convertId));
    $(controlIds.date).change(function () {
        enableFunc(controlIds);
    });
    $(controlIds.numeric).change(function () {
        enableFunc(controlIds);
    });
    enableFunc(controlIds);
};

function _getConvertTypeById(controlId) {
    for (const [key, value] of Object.entries(convertTypes)) {
        if (value.id === controlId) {
            return value;
        }
    }
    throw "Can not convert id " + controlId;
};

function _initConvertTypedEvalListener(convertType) {
    let controlIds = _getControlIds(convertType);
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
};

function _getControlIds(convertType) {
    switch (convertType.id) {
        case convertTypes.Unix.id:
            return { numeric: "#unixEpochEntry", date: "#unixDateEntry", tz: "#unixTimeZoneSelect", button: "#unixConvertButton" };
        case convertTypes.TimeSpan.id:
            return { numeric: "#timespanTicksEntry", date: "#timespanDateEntry", tz: null, button: "#timespanConvertButton" };
        case convertTypes.TicksDifference.id:
            return { numeric: "#ticksDifference1", date: "#ticksDifference2", tz: null, button: "#ticksDifferenceConvertButton", result: "#ticksDifferenceResult" };
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
    if (convertType.id === convertTypes.TicksDifference.id) {
        convertTicksDifference(dateVal, ticksVal, function (data) { $(controlIds.result).val(data.dateTime); });
    }  else if (dateVal) {
        convertDateToTicks(convertType, dateVal, timeZoneVal, function (data) { $(controlIds.numeric).val(data.ticks); });
    }
    else if (ticksVal) {
        convertTicksToDate(convertType, ticksVal, timeZoneVal, function (data) { $(controlIds.date).val(data.dateTime); });
    }
}

function convertDateToTicks(convertType,  dateStr, timeZone, callback) {
    let model = { DateTime: dateStr, TimeZoneId: timeZone };

    var url = _makeUrl("to-ticks");
    switch (convertType) {
        case convertTypes.Unix:
            url = _makeUrl("to-unix");
        case convertTypes.TimeSpan:
            url = _makeUrl("timespan/to-ticks");
    }
    makePostRequest(url, model, callback);
}

function convertTicksToDate(convertType, ticksStr, timeZone,callback) {
    let model = { Ticks: ticksStr, TimeZoneId: timeZone };

    var url = _makeUrl("from-ticks");
    console.log("Convert type: " + convertType);
    switch (convertType) {
        case convertTypes.Unix:
            url = _makeUrl("from-unix");
            break;
        case convertTypes.TimeSpan:
            url = _makeUrl("timespan/from-ticks");
            break;
    }
    makePostRequest(url, model, callback);
}

function convertTicksDifference(ticks1, ticks2, callback) {
    let model = { Ticks1: ticks1, Ticks2: ticks2 };
    var url = _makeUrl("timespan/ticks-difference");
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

async function getNows() {
    const rowHtml = await loadTemplate('nowRow');
    makeGetRequest(_makeUrl("now"), function (data) {
        const container = $("#nowResult");
        container.empty();

        data.forEach(item => {
            const $row = $(rowHtml).clone();
            const clipBoardCopyText = "Copy to clipboard: " + item.dateTime;
            const linkConvertTest = "Convert " + item.dateTime + " (" + item.timeZoneId + ") to ticks";

            $row.find(".__tz").text(item.timeZoneId);

            $row.find(".__copy img")
                .click(() => copyToClipboard(item.dateTime));

            $row.find(".__tooltipcopy")
                .attr("aria-label", clipBoardCopyText)
                .attr("data-tip", clipBoardCopyText);

            $row.find(".__tooltipnow")
                .attr("aria-label", linkConvertTest)
                .attr("data-tip", linkConvertTest);

            $row.find(".__date-link")
                .text(item.dateTime)
                .click(() => convertTicks(item.dateTime, item.timeZoneId));

            container.append($row);
        });
    });
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

function _makeUrl(suffix) {
    return baseApiUrl + "/" + suffix;
}