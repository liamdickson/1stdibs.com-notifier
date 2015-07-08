/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 5:23 PM
 */

'use strict';


chrome.storage.sync.get('pageRules',function (data) {
    $('#rules').text(JSON.stringify(data.pageRules, null, 2));
});