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
    },
    TicksGreater: {
        id: 5,
        evaluation: function () { ticksGreaterEvaluation(5); }
    },
    DateTimeDifference: {
        id : 6,
        evaluation: function () { ticksDifferenceEvaluation(6); }
    }
};

let urlBuilder;

document.addEventListener('DOMContentLoaded', function () {
    urlBuilder = new ApiUrlBuilder('api/datetime');
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
        ticksGreaterEvaluation(convertTypes.TicksGreater.id);
    });
    getNows();
});

function standardEvaluation(convertId) {
    _initConvertTypedEvalListener(_getConvertTypeById(convertId));
}

function ticksDifferenceEvaluation(convertId) {
    let enableFunc = function (cids) { 
        let shouldDisable = !($(cids.numeric).val() && $(cids.date).val());
        $(cids.button).prop('disabled', shouldDisable );
        if(shouldDisable && cids.clear_result_func && cids.result)
        {
            cids.clear_result_func(cids.result);
        }
    };
    let controlIds = _getControlIds(_getConvertTypeById(convertId));
    $(controlIds.date).change(function () {
        enableFunc(controlIds);
    });
    $(controlIds.numeric).change(function () {
        enableFunc(controlIds);
    });
    enableFunc(controlIds);
}

function ticksGreaterEvaluation(convertId) {
    ticksDifferenceEvaluation(convertId);
    let controlIds = _getControlIds(_getConvertTypeById(convertId));
    var ctls = [$(controlIds.date), $(controlIds.numeric)];
    for (const e of ctls) {
        e.removeAttr("aria-invalid");
    }
}


function _getConvertTypeById(controlId) {
    for (const [key, value] of Object.entries(convertTypes)) {
        if (value.id === controlId) {
            return value;
        }
    }
    throw "Can not convert id " + controlId;
}

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
}

function _getControlIds(convertType) {
    switch (convertType.id) {
        case convertTypes.Unix.id:
            return { numeric: "#unixEpochEntry", date: "#unixDateEntry", tz: "#unixTimeZoneSelect", button: "#unixConvertButton" };
        case convertTypes.TimeSpan.id:
            return { numeric: "#timespanTicksEntry", date: "#timespanDateEntry", tz: null, button: "#timespanConvertButton" };
        case convertTypes.TicksDifference.id:
            return { numeric: "#ticksDifference1", date: "#ticksDifference2", tz: null, button: "#ticksDifferenceConvertButton", result: "#ticksDifferenceResult" };
        case convertTypes.TicksGreater.id:
            return { numeric: "#ticksGreater1", date: "#ticksGreater2", tz: null, button: "#ticksGreaterConvertButton", result: null };
        case convertTypes.DateTimeDifference.id:
            return { 
                numeric: "#dateTimeDiff1", date: "#dateTimeDiff2", tz:"#dateTimeDiffTimeZoneSelect", button:"#dateTimeDiffConvertButton", result:"#dateTimeDiffResult",
                clear_result_func: function(resultId){ $(resultId).empty(); }
            };
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

function _getCtlByVal(cids, data) {
    ticksGreaterEvaluation(convertTypes.TicksGreater.id)
    var ctls = [cids.date, cids.numeric];
    for (const e of ctls) {
        const $el = $(e);
        if ($el.val() == data) {
            return $el;
        }
    }
    return null;
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
        convertTicksDifference(dateVal, ticksVal, function (data) {
            $(controlIds.result).val(data.dateTime);
        });
    } else if (convertType.id === convertTypes.DateTimeDifference.id){
        convertDateTimeDiff(dateVal,ticksVal, timeZoneVal);
    } else if (convertType.id === convertTypes.TicksGreater.id) {
        convertTicksGreater(dateVal, ticksVal, function (data) {
            let ctl = _getCtlByVal(controlIds, data);
            if (ctl) {
                ctl.attr("aria-invalid", "false");
            }
        });
    } else if (dateVal) {
        convertDateToTicks(convertType, dateVal, timeZoneVal, function (data) { $(controlIds.numeric).val(data.ticks); });
    }
    else if (ticksVal) {
        convertTicksToDate(convertType, ticksVal, timeZoneVal, function (data) { $(controlIds.date).val(data.dateTime); });
    }
}

function convertDateToTicks(convertType,  dateStr, timeZone, callback) {
    let model = { DateTime: dateStr, TimeZoneId: timeZone };

    var url = urlBuilder.makeUrl("to-ticks");
    switch (convertType) {
        case convertTypes.Unix:
            url =   urlBuilder.makeUrl("to-unix");
            break;
        case convertTypes.TimeSpan:
            url = urlBuilder.makeUrl("timespan/to-ticks");
            break;
    }
    makePostRequest(url, model, callback);
}

function convertTicksToDate(convertType, ticksStr, timeZone,callback) {
    let model = { Ticks: ticksStr, TimeZoneId: timeZone };

    var url = urlBuilder.makeUrl("from-ticks");
    switch (convertType) {
        case convertTypes.Unix:
            url = urlBuilder.makeUrl("from-unix");
            break;
        case convertTypes.TimeSpan:
            url = urlBuilder.makeUrl("timespan/from-ticks");
            break;
    }
    makePostRequest(url, model, callback);
}

function convertTicksDifference(ticks1, ticks2, callback) {
    let model = { Ticks1: ticks1, Ticks2: ticks2 };
    var url = urlBuilder.makeUrl("timespan/ticks-difference");
    makePostRequest(url, model, callback);
}

function convertTicksGreater(ticks1, ticks2, callback) {
    let model = { Ticks1: ticks1, Ticks2: ticks2 };
    var url = urlBuilder.makeUrl("ticks-greater");
    makePostRequest(url, model, callback);
}

function convertDateTimeDiff(dt1,dt2,timeZone)
{
    let ctrlData = _getControlIds(convertTypes.DateTimeDifference);
    let container = $(ctrlData.result);
    container.empty();
    let model = [{ dateTime:dt1, timeZoneId:timeZone }, { dateTime:dt2, timeZoneId:timeZone }];
    loadTemplate('dateTimeDifferenceDisplay').then(
        (rowHtml) => {
            makePostRequest(urlBuilder.makeUrl("get-difference"), model , function (data) {
                let updatedHtml = rowHtml
                    .replaceAll("__days", data.days)
                    .replaceAll("__hours", data.hours)
                    .replaceAll("__minutes", data.minutes)
                    .replaceAll("__seconds", data.seconds)
                    .replaceAll("__ticks", data.ticks);
                const $row = $(updatedHtml);
                container.append($row);
            });            
        }
    );
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
    makeGetRequest(urlBuilder.makeUrl("now"), function (data) {
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