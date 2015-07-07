/**
 * User: Liam Dickson
 * Date: 7/1/15
 * Time: 3:09 PM
 */

'use strict';

var div = document.createElement("div");
div.style.fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
div.style.textAlign = 'center';
div.style.fontWeight = 'bold';
div.style.fontSize = '12px';
div.style.lineHeight = '14px';
div.style.width = '100%';
div.style.position = 'fixed';
div.style.top = '0';
div.style.left = '0';
div.style.height = '15px';
div.style.zIndex = '9999';

// defined in subdomain files
div.innerHTML = innerHTML;
div.style.backgroundColor = backgroundColor;
div.style.color = color;

document.getElementsByTagName('body')[0].appendChild(div);