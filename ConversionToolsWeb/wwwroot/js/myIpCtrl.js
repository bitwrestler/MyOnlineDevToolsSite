

document.addEventListener('DOMContentLoaded', function () {
    let urlBuilder = new ApiUrlBuilder('/api/utility');
    makeGetRequest(urlBuilder.makeUrl('remoteip'), function (response) {
        $('#myIpResult').val(response.ipAddress);
    });
});