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
        data.forEach((e, index) => {
            if (entry.convertType === e.convertType && entry.datetime === e.datetime && entry.tz === e.tz) {
                return true;
            }
        });
        return false;
    },
    getHistoryEntries: function () {
        return this._retrieve() || [];
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
    $(historyId).attr("open", '');
    let container = $('#historyCollectionContainer');
    historyObject.getHistoryEntries().forEach(entry => {
        loadTemplate('historyRow').then(rowHtml => {
            let thisTemplateRow = $(rowHtml).clone();
            thisTemplateRow.find(".__historyRow").click(function () {
                //TODO : Implement re-populate of main form from history entry and close modal
            });
            thisTemplateRow.find(".__historyRow").text(entry.convertTypeString + ": " + entry.datetime + " (" + entry.tz + ")");
            container.append(thisTemplateRow);
        });
    });
}