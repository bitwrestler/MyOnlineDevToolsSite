$(function () {
    const resultSelector = '#hhmmResult .hhmm-result-value';
    const entrySelector = '.hhmm-entry';
    const urlBuilder = new ApiUrlBuilder('api/datetime');

    $(document).on('input', entrySelector, calculateHHMM);

    function calculateHHMM() {
        const entries = $(entrySelector).map(function () {
            return $(this).val();
        }).get();

        $.ajax({
            url: urlBuilder.makeUrl('add-hhmm'),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({ HHMMEntries: entries }),
            success: function (data) {
                $(resultSelector).text((Number(data) || 0).toFixed(2));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('add-hhmm failed:', textStatus, errorThrown, jqXHR.responseText);
                $(resultSelector).text('error');
            }
        });
    }
});
