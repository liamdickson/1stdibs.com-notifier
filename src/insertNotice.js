/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 3:47 PM
 */

'use strict';

var $ = require('jquery');
var notice;

var color = rule.color ? 'color:' + rule.color + ';' : '';
var bgColor = rule.backgroundColor ? 'background-color:' + rule.backgroundColor + ';' : '';

notice = $('<div/>', {
    class: 'chrome-extension-notice',
    style: color + bgColor,
    text: rule.text
});
$('body').prepend(notice);