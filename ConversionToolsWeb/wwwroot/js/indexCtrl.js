var form, dateEl, ticksEl, timeZoneSelectEl, convertBtnEl;


document.addEventListener('DOMContentLoaded', function () {
    form = document.getElementById('convertForm');
    dateEl = document.getElementById('dateEntry');
    ticksEl = document.getElementById('ticksEntry');
    timeZoneSelectEl = document.getElementById('timeZoneSelect');
    convertBtnEl = document.getElementById('convertButton');

        dateEl?.addEventListener('change', function () {
            ticksEl.value = '';
            checkEnableConvert();
        });
        ticksEl?.addEventListener('change', function () {
            dateEl.value = '';
            checkEnableConvert();
        });
        timeZoneSelectEl?.addEventListener('change', function () {

        });
});

function convert() {
    if (! checkEnableConvert()) {
        return;
    }
    if (dateEl.value) {
        let ret = convertDateToTicks(dateEl.value, timeZoneSelectEl.value);
        if (ret) {
            ticksEl.value = ret.Ticks;
        }
    }
    else if (ticksEl.value) {
        let ret = convertTicksToDate(ticksEl.value, timeZoneSelectEl.value);
        if (ret) {
            dateEl.value = ret.DateTime;
        }
    }
}

function convertDateToTicks(dateStr, timeZone) {
    return { Ticks: '637234567890123456', DateTime : dateStr, TimeZoneId : timeZone };
}

function convertTicksToDate(ticksStr, timeZone) {
    return { Ticks: ticksStr, DateTime: '2025-11-22 XX:XX', TimeZoneId : timeZone };
}

function checkEnableConvert() {
    convertBtnEl.disabled = !dateEl.value && !ticksEl.value;
    return ! convertBtnEl.disabled;
}