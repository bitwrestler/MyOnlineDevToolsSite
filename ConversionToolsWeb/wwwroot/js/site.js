// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

(function ($) {

    const navSelector = 'nav a';

    // Normalize a path for comparison: remove query/hash, trailing slash, decode, lower-case
    function getAnchorFromUrl(p) {
        if (!p || p.indexOf('#') == -1) return 'datetime';
        return p.split('#')[1];
    }

    function markActiveNav(selector, force) {
        var current = getAnchorFromUrl(force || window.location.href);
        $(selector).each(function () {
            var href = $(this).attr('href');
            if (!href) return;
            var linkPath = getAnchorFromUrl(href);
            if (current === linkPath) {
                $(this).removeClass('outline');
                $(this).addClass('secondary');
            } else {
                $(this).removeClass('secondary');
                $(this).addClass('outline');
            }
        });
    }

    $(document).on('click', navSelector, function () {
        markActiveNav(navSelector, $(this).attr('href'));
    });

    $(function () {
        markActiveNav(navSelector);
    });

})(jQuery);


function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .catch(err => console.error("Copy failed:", err));
}
async function loadTemplate(templateName) {
    return await $.get("/templates/" + templateName + ".html");
}

function makeGetRequest(url, callback) {
    _makeRequest(url, null, callback, "GET");
}

function makePostRequest(url, model, callback) {
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
