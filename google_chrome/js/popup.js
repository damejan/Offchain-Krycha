console.log('popup.js');

var enableDarkTheme = false;

$(function(){

    chrome.storage.sync.get(['darkTheme'], function(result){
        if(result.darkTheme){
            $("#darkThemeCheckbox").prop("checked", true);
            console.log('dark theme is enabled');
            enableDarkTheme = true;
        } else{
            $("#darkThemeCheckbox").prop("checked", false);
            console.log('dark theme is disabled');
            enableDarkTheme = false;
        }
    });

    $('#darkThemeCheckbox').change(function(){
        // var asdf = $('#darkTheme').val();
        // console.log(asdf);
        if(enableDarkTheme){
            console.log('disable dark theme');
            enableDarkTheme = false;
            chrome.storage.sync.set({'darkTheme': false});
        } else{
            console.log('enable dark theme');
            enableDarkTheme = true;
            chrome.storage.sync.set({'darkTheme': true});
        }
    });

    $('#ignoredUsers').click(function(){
        //chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
        chrome.tabs.create({ url: "html/optionsPage.html" });
    });
});