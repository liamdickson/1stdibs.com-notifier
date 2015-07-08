/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 2:58 PM
 */

'use strict';

var pageRules = {
    production: {
        regex: '^.*://(www|adminv2|admin)\\.1stdibs\\.com/',
        text: 'WARNING: You are on the 1stdibs.com production site.',
        backgroundColor: 'red',
        color: 'white'
    },
    stage: {
        regex: '^.*://.*stage\\.1stdibs\\.com',
        text: 'You are on the 1stdibs.com staging site.',
        backgroundColor: 'yellow',
        color: 'black'
    }
};

chrome.storage.sync.get('pageRules',function (data) {
    if (data.pageRules) {
        pageRules = data.pageRules;
        console.log('Data get: ', pageRules);
    } else {
        chrome.storage.sync.set({pageRules: pageRules});
        console.log('Data set: ', pageRules);
    }
});

var matchesPage = function (url, rule) {
    return (new RegExp(rule.regex)).test(url);
};

var pageListener = function (tabId, changeInfo, tab) {
    var rule;
    if (changeInfo.status == 'complete' && (rule = _.find(pageRules, _.partial(matchesPage, tab.url)))) {
        chrome.tabs.executeScript(tabId, { code: 'var rule = ' + JSON.stringify(rule) }, function () {
            chrome.tabs.executeScript(tabId, { file: './insertNotice.js' });
        });
    }
};

var refreshListener = function () {
    chrome.tabs.onUpdated.removeListener(pageListener);
    chrome.tabs.onUpdated.addListener(pageListener);
};

chrome.tabs.onUpdated.addListener(pageListener);