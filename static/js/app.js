// Module Pattern
var myApp = (function () {

    // Private Variables to scope
    var baseUrl = 'https://console.cloud-elements.com/elements/api-v2/';

    return {
        init: function () {
            this.clickGetFiles();
            var cookie = document.cookie;
            console.log(cookie);
            var token = null;
            if (document.cookie) {
                var parts = cookie.split(';');
                for(var i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    console.log(part);
                    if(part.startsWith('element')) {
                        token = part.split('=')[1];
                        break;
                    }
                }
            }
            if (token === null) {
                window.location = '/unauthorized';
            } else {
                alert(token);
            }
        },
        clickGetFiles: function () {
            $('#getData').on('click', function () {
                myApp.getFiles();
            });
        },
        getFiles: function () {
            var url = baseUrl + 'hubs/documents/folders/contents';
            var queryString = '?path=/';

            // https://console.cloud-elements.com/elements/api-v2/hubs/documents/files?path=/

            url += queryString;

            myServer.getData('GET', url, function (data) {
                myApp.buildFileList(data);
            });
        },
        buildFileList: function(data) {

            var html = '<table><thead><tr><td>Type</td><td>Name</td><tbody>';

            for(var i=0; i<data.length; i++) {

                html += '<tr><td>';

                // Checks if it's a folder or not
                if(data[i].directory === true) {
                    html += 'Folder';
                }
                else {
                    html += 'File';
                }

                html += '</td><td>' + data[i].name;
            }

            $('div.drive-content').html(html);
        }
    }

})();

var myServer = (function () {

    var orgSec = '7ded9bdd3382aabb7309eebbba91cf38';
    var uSec = 'DkGdePCO45Txh743GPRefTOfdKIDi47trqkX1HXFQfw=';
    var elToken = '7W+Xer4toEXOFduygHeESwkf6k+1BVkci9V/h3+mjEc=';

    return {
        getData: function (method, url, cb) {
            console.log('Authorization: Organization ' + orgSec + ' User ' + uSec + ' Element ' + elToken);

            var jqhxr = $.ajax({
                    type: method,
                    url: url,
                    headers: {
                        'Authorization' : 'Organization ' + orgSec + ', User ' + uSec + ', Element ' + elToken
                    }
                })
                .done(function (data) {
                    //200 - Server Status
                    cb(data);
                })
                .error(function (data) {
                    cb(data);
                });
        }
    }

})();


// Initialize App When Document Ready
$(document).on('ready', function () {
    myApp.init();
});
