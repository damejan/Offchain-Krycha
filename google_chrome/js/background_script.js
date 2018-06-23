console.log('background_script.js');

// function listener(tab){
//     chrome.tabs.insertCSS(tab.tabId,{file: "css/content.css"});
// }

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

chrome.webNavigation.onCompleted.addListener(function(details){
    console.log(details);
    chrome.tabs.insertCSS(details.tabId,{file: "css/content.css"});
    chrome.tabs.executeScript(details.tabId,{file:"js/jquery-3.3.1.min.js"});
    chrome.tabs.executeScript(details.tabId,{file:"js/jquery-observe.js"});
    chrome.tabs.executeScript(details.tabId,{file:"js/artyom.window.min.js"});
    chrome.tabs.executeScript(details.tabId,{file:"js/content.js"});
}, {url: [{hostContains: "dlive.io"}]});

var contextMenuItem = {
    "id": "ignoreUser",
    "title": "don't read this user",
    "contexts": ["link"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){
    if(clickData.menuItemId == "ignoreUser" && clickData.linkUrl){
        console.log(clickData);
        var s = clickData.linkUrl;
        s = s.substring(s.indexOf('@')+1);
        chrome.storage.sync.get({ignoredUsers: []}, function(result){
            if(result.ignoredUsers){
                var ignored_users = result.ignoredUsers;
                ignored_users.push(s);
                chrome.storage.sync.set({'ignoredUsers': ignored_users});
            } else{
                var ignored_Users = result.ignoredUsers;
                ignored_Users.push(s);
                chrome.storage.sync.set({'ignoredUsers': []});
                chrome.storage.sync.set({'ignoredUsers': ignored_Users});
            }
        });
        console.log(s);
    }
});