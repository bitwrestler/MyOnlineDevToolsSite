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
    var id;
    var retProperty;
    let dateVal = $(dateId).val();
    let ticksVal = $(ticksId).val();
    let timeZoneVal = $(timeZoneSelectId).val();
    if (dateVal) {
        ret = convertDateToTicks(dateVal, timeZoneVal);
        id = ticksId;
        retProperty = 'Ticks';
    }
    else if (ticksVal) {
        ret = convertTicksToDate(ticksVal, timeZoneVal);
        id = dateId;
        retProperty = 'DateTime';
    }
    if (ret) {
        $(id).val(ret[retProperty]);
    }
}

function convertDateToTicks(dateStr, timeZone) {
    return { Ticks: '637234567890123456', DateTime : dateStr, TimeZoneId : timeZone };
}

function convertTicksToDate(ticksStr, timeZone) {
    return { Ticks: ticksStr, DateTime: '2025-11-22 XX:XX', TimeZoneId : timeZone };
}

function evalEnableConvert() {
    $(convertButtonId).disabled = !checkEnableConvert();
}
f
function checkEnableConvert() {
    return $(dateId).val || $(ticksId).val;
}
