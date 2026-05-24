

document.addEventListener('DOMContentLoaded', function () {
    let urlBuilder = ApiUrlBuilder('/api/utility')
    makeGetRequest(urlBuilder.makeUrl('remoteip'), function (response) {
        $('#myIpResult').val(response.ipAddress)
    });
});