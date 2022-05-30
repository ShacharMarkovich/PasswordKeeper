/* global chrome */
// TODO: insert here a code that work after posting an login/register form
//  OR code that insert auto the data to the website


/*chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { message: 'load' });
  });
*/

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher(
        /* {pageUrl: { hostEquals: 'localhost' }}*/
      )],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
