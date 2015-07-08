/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 3:47 PM
 */

'use strict';

var notice = $('<div/>', {
    class: 'chrome-extension-notice',
    style: 'color: ' + rule.color + '; ' +
    'background-color: ' + rule.backgroundColor,
    text: rule.text
});

$('body').prepend(notice);