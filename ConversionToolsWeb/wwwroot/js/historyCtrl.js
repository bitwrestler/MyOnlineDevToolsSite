const historyId = "#historyModal";
const dataAttribute = "data-history-object";
const historyObject = {
    addHistoryEntry: function (entry) {
        let data = this._retrieve() || [];
        if (this.entryExists(data, entry)) {
            return;
        }
        data.push(entry);
        this._store(data);
    },
    entryExists: function (data, entry) {
        var retValue = false;
        data.forEach((e, index) => {
            if (entry.convertType === e.convertType && entry.datetime == e.datetime && entry.ticks == e.ticks && entry.tz == e.tz) {
                retValue = true;
            }
        });
        return retValue;
    },
    getHistoryEntries: function () {
        return this._retrieve() || [];
    },
    hasHistoryEntries: function () {
        return (!!(this.getHistoryEntries().length > 0));
    },
    clearHistory: function () {
        this._store([]);
    },
    _retrieve: function () {
        let objectVal = $(historyId).attr(dataAttribute);
        if (!objectVal) {
            objectVal = "[]";
        }
        return JSON.parse(objectVal);
    },
    _store: function (collection) {
        $(historyId).attr(dataAttribute, JSON.stringify(collection));
    }
};

function showHistoryModal() {

    if (! historyObject.hasHistoryEntries()) {
        alert("No history.");
        return;
    }

    $(historyId).attr("open", '');
    let container = $('#historyCollectionContainer');
    container.empty();
    historyObject.getHistoryEntries().forEach(entry => {
        loadTemplate('historyRow').then(rowHtml => {
            let thisTemplateRow = $(rowHtml).clone();
            thisTemplateRow.find(".__historyRow").click(function () {
                convertWithData(entry.convertType, entry.datetime, entry.ticks, entry.tz);
                $(historyId).removeAttr("open");
                return false;
            });
            thisTemplateRow.find(".__historyRow").text(entry.convertTypeString + ": " + entry.datetime + " (" + entry.tz + ")");
            container.append(thisTemplateRow);
        });
    });
    return false;
};