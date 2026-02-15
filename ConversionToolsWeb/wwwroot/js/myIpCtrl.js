

document.addEventListener('DOMContentLoaded', function () {
    const baseApiUrl = "/api/utility/remoteip";
    makeGetRequest(baseApiUrl, function (response) {
        $('#myIpResult').val(response.ipAddress)
    });
});