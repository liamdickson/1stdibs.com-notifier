/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 2:58 PM
 */

'use strict';

var _ = require('underscore');
var $ = require('jquery');
var pageRules;
var defaultRules;

defaultRules = {
    production: {
        regex: '.*://(www|adminv2|admin)\\.1stdibs\\.com/',
        text: 'WARNING: You are on the 1stdibs.com production site.',
        backgroundColor: 'red',
        color: 'white'
    },
    stage: {
        regex: '.*://.*stage\\.1stdibs\\.com',
        text: 'You are on the 1stdibs.com staging site.',
        backgroundColor: 'yellow',
        color: 'black'
    }
};

chrome.storage.sync.get('pageRules', function (data) {
    if (data.pageRules) {
        console.log('get stored rules');
        pageRules = data.pageRules;
    } else {
        console.log('set initial rules');
        chrome.storage.sync.set({pageRules: defaultRules});
        pageRules = defaultRules;
    }
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.method == "notifier-setRules") {
        chrome.storage.sync.get('pageRules', function (data) {
            pageRules = data.pageRules;
        });
        sendResponse({type: "notifier-rulesSet"});
    }
    if(message.method == "notifier-resetRules") {
        chrome.storage.sync.set({pageRules: defaultRules});
        sendResponse({type: "notifier-rulesReset"});
    }
});

var matchesPage = function (url, rule) {
    return (new RegExp(rule.regex)).test(url);
};

var pageListener = function (tabId, changeInfo, tab) {
    var rule;
    if (changeInfo.status == 'complete' && (rule = _.find(pageRules, _.partial(matchesPage, tab.url)))) {
        chrome.tabs.executeScript(tabId, { code: 'var rule = ' + JSON.stringify(rule) }, function () {
            chrome.tabs.executeScript(tabId, { file: '/js/insertNotice-bundle.js' });
        });
    }
};

chrome.tabs.onUpdated.addListener(pageListener);