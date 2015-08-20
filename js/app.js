// Module Pattern
var myApp = (function () {

    // Private Variables to scope
    var baseUrl = 'https://console.cloud-elements.com/elements/api-v2/';

    return {
        init: function () {
            this.clickGetFiles();
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
            
            $('body').html(html);
        }
    }

})();

var myServer = (function () {

    var orgSec = '';
    var uSec = '';
    var elToken = '';

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