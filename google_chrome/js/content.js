console.log('content.js');

//parse or clear url
function urlify(text, replaceType) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
	
	if(typeof replaceType === 'undefined'){
		replaceType = 'url';
	}
	
	if(replaceType === 'url'){
		return text.replace(urlRegex, 'url');
	} else{
		return text.replace(urlRegex, function(url) {
			return '<a href="' + url + '">' + url + '</a>';
		});
	}		
}

//default chat reader settings
var artyomConfig = {
    listen:false,
    debug:false,
    volume: 1,
    speed:1 
}
var TTSLanguage = "en-US";
var chatReaderStart = false;
var artyom = null;

//chat reader control panel icon
var openChatReaderControlPanelIcon = false;

var chatReaderControlPanelIcon = document.createElement('div');
chatReaderControlPanelIcon.className = "chatReaderControlPanelIcon";
chatReaderControlPanelIcon.id = "chatReaderControlPanelIconId";
chatReaderControlPanelIcon.onclick = function(){
    if(openChatReaderControlPanelIcon){
        $('#chatReaderControlPanelContainerId').hide(200);
        openChatReaderControlPanelIcon = false;
    } else {
        $('#chatReaderControlPanelContainerId').show(200);
        openChatReaderControlPanelIcon = true;
        chrome.storage.sync.get(['krystynaVolume','krystynaSpeed','krystynaLanguage'], function(result) {
            if(result.krystynaVolume){
                console.log("set krystyna volume to: " + result.krystynaVolume);
                artyomConfig.volume = result.krystynaVolume;
                $('#krystynaVolumeId').val(result.krystynaVolume*100);
            }
            if(result.krystynaSpeed){
                console.log("set krystyna speed to: " + result.krystynaSpeed);
                artyomConfig.speed = result.krystynaSpeed;
                $('#krystynaSpeedId').val((result.krystynaSpeed*100)/2);
            }
            if(result.krystynaLanguage){
                console.log("set krystyna language to: " + result.krystynaLanguage);
                TTSLanguage = result.krystynaLanguage;
                $('#krystynaLanguageId').val(result.krystynaLanguage);
            }
        });
        if(chatReaderStart){
            $('#KrystynaActivityButtonId').val('stop');
            $('#KrystynaActivityButtonId').css('background-color','#ee1919');
            $('#krystynaActivityStatus').text('On');
            $('#krystynaActivityStatus').css('color','green');
        } else{
            $('#KrystynaActivityButtonId').val('start');
            $('#KrystynaActivityButtonId').css('background-color','#4CAF50');
            $('#krystynaActivityStatus').text('Off');
            $('#krystynaActivityStatus').css('color','red');
        }
    }
}


//dark theme
chrome.storage.sync.get(['darkTheme'], function(result){
    if(result.darkTheme){
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = chrome.extension.getURL('css/darkTheme.css');
        (document.head||document.documentElement).appendChild(style);var style = document.createElement('link');

        var DLiveWhiteLogo = chrome.extension.getURL("img/DLive_white_Logo.png");
        $('.navbar-brand:first a:first img').attr('src', DLiveWhiteLogo);

        //img in controll panel icon div
        var imgInChatReaderControlPanelIcon = document.createElement('img');
        imgInChatReaderControlPanelIcon.src = chrome.extension.getURL("img/speaker_icon_gray.png");
        chatReaderControlPanelIcon.appendChild(imgInChatReaderControlPanelIcon);
    } else{
        //img in controll panel icon div
        var imgInChatReaderControlPanelIcon = document.createElement('img');
        imgInChatReaderControlPanelIcon.src = chrome.extension.getURL("img/speaker_icon.png");
        chatReaderControlPanelIcon.appendChild(imgInChatReaderControlPanelIcon);
    }
});

//chat reader control panel template
//krystyna - chat reader
var chatReaderControlPanelTemplate = '<div class="chatReaderControlPanelContainer" id="chatReaderControlPanelContainerId">' +
'<div class="KrystynaActivity"><input type="submit" class="mainButton" id="KrystynaActivityButtonId" value="start"><div class="infoText">Krystyna: <span id="krystynaActivityStatus">Off</span> </div></div>' +
'<div class="krystynaVolume"><div class="infoText">Volume:</div><input type="range" min="1" max="100" value="100" class="slider" id="krystynaVolumeId"></div>' + 
'<div class="krystynaSpeed"><div class="infoText">Speed:&nbsp;&nbsp;&nbsp;</div><input type="range" min="1" max="100" value="50" class="slider" id="krystynaSpeedId"></div>' +
'<div class="krystynaLanguage"><div class="infoText">Krystyna language:</div><select id="krystynaLanguageId">' +
'<option value="en-US">English (USA)</option><option value="en-GB">English (Great Britain)</option><option value="pl-PL">Polski (Poland)</option><option value="de-DE">Deutsch</option>' +
'<option value="it-IT">Italiano</option><option value="fr-FR">Français</option><option value="ja-JP">Japanese 日本人</option><option value="ru-RU">Russian</option><option value="pt-PT">Brazil</option>' +
'<option value="id-ID">Indonesian (Indonesia)</option><option value="nl-NL">Dutch (netherlands)</option><option value="zh-HK">Chinese (Cantonese)</option><option value="zh-CN">Chinese (Mandarin)</option><option value="hi-IN">Hindi (India Google)</option>' +
'</select></div>' +
'<span style="color: red; margin-left: 5px;">restart krystyna to apply changes</span>' +
'<div class="resetButton"><input type="submit" id="resetButtonId" value="default krystyna settings"> <span> V0.3</span> </div>'
+'</div>';

//filter and say massage
function messageFilter(msg, usr){
    //console.log(msg);
    //console.log(artyom);
    //console.log(usr);
    if(chatReaderStart){
        //artyom.say(msg, {lang: TTSLanguage});
        chrome.storage.sync.get({ignoredUsers: []}, function(result){
            if(result.ignoredUsers){
                if(result.ignoredUsers.includes(usr)){
                    console.log("this user is ignored: "+ usr);
                } else{
                    if(msg && usr.length){
                        msg = urlify(msg);
                        console.log('changed msg: ' + msg);
                        //console.log(usr);
                        artyom.say(msg, {lang: TTSLanguage});
                    } else{
                        console.log('empty string or special message it will not be read');
                    }
                }
            }
        });

    }
    //$('.color-text-primary').last().text(urlify(msg,'HTMLTag'));
}

//controll messages

//messages filtering
var tmp_messages = [];
var messageBuffor = [];

function messageControll(msg, usr){
    tmp_messages.push(msg);
    if(!!tmp_messages.reduce(function(a, b){ return (a === b) ? a : NaN; })){
        //console.log(tmp_messages)
        if(tmp_messages.length>1){
            console.log('spam')
        } else{
            //console.log(msg);
            messageFilter(msg, usr);
        }
        //console.log('spam');
    } else{
        tmp_messages = [];
        // if(messageBuffor.length<=15){
        //     messageBuffor.push(msg);
        //     console.log(messageBuffor);
        // } else{
        //     messageBuffor = [];
        // }
        //console.log(msg);
        messageFilter(msg, usr);
    }
    
}

//chat observer
var startChatObserver = false;
var chatObserverConfig = { characterData: true, childList: true, subtree: true };

var chatObserverCallback = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            //console.log(mutation.addedNodes["0"].textContent);
            var message = $('.color-text-primary').last().text();
            var username = $('.username.color-text-secondary').last().text();
            // var message = mutation.addedNodes["0"].textContent;
            username = username.substring(0,username.indexOf(':'));
            // message = message.substring(username.length+1);
            messageControll(message, username);
        }
        else if (mutation.type === 'characterData') {
            var message = $('.color-text-primary').last().text();
            var username = $('.username.color-text-secondary').last().text();
            username = username.substring(0,username.indexOf(':'));
            messageControll(message, username);
            //console.log(message);
            //console.log('strange changes in the chat');
        }
        else if (mutation.type === 'subtree') {
            //console.log(mutation);
        }
        
    }
};

var chatObserver = new MutationObserver(chatObserverCallback);


//tts functions
function TTSButtonActivity(){
    if(chatReaderStart){
        chatReaderStart = false;
        $('#KrystynaActivityButtonId').val('start');
        $('#KrystynaActivityButtonId').css('background-color','#4CAF50');
        $('#krystynaActivityStatus').text('Off');
        $('#krystynaActivityStatus').css('color','red');
        console.log('chat reader stoped');
        artyom.shutUp();
        artyom = null
    } else{
        chatReaderStart = true;
        $('#KrystynaActivityButtonId').val('stop');
        $('#KrystynaActivityButtonId').css('background-color','#ee1919');
        $('#krystynaActivityStatus').text('On');
        $('#krystynaActivityStatus').css('color','green');
        console.log('chat reader started');
        artyom = new Artyom();
        artyom.initialize(artyomConfig);
    }
}

function TTSVolume(){
    var volume = $('#krystynaVolumeId').val();
    console.log("tts volume: "  + volume/100);
    chrome.storage.sync.set({krystynaVolume: volume/100});
    artyomConfig.volume = volume/100;
}

function TTSSpeed(){
    var speed = $('#krystynaSpeedId').val();
    console.log("tts speed: " + (speed*2)/100);
    chrome.storage.sync.set({krystynaSpeed: (speed*2)/100});
    artyomConfig.speed = (speed*2)/100;
}

function TTSLang(){
    var language = $('#krystynaLanguageId').val();
    console.log("tts language: " + language);
    chrome.storage.sync.set({krystynaLanguage: language});
    TTSLanguage = language;
}

function TTSResetSettings(){
    $('#krystynaVolumeId').val(100);
    artyomConfig.volume = 1;
    chrome.storage.sync.set({krystynaVolume: 1});

    $('#krystynaSpeedId').val(50);
    artyomConfig.speed = 1;
    chrome.storage.sync.set({krystynaSpeed: 1});

    $('#krystynaLanguageId').val('en-US');
    TTSLanguage = "en-US";
    chrome.storage.sync.set({krystynaLanguage: 'en-US'});
}

//lift the icon up or down in textarea on the chat
function liftIconUpOrDown(){
    if($('.textarea:last').val().length>25){
        $('.chatReaderControlPanelIcon').css('top','-26px');
        $('.chatReaderControlPanelContainer').css('bottom','116px');
    } else{
        $('.chatReaderControlPanelIcon').css('top','8px');
        $('.chatReaderControlPanelContainer').css('bottom','90px');
    }
}

$(function(){
    console.log("DOM has been loaded - content.js");

    //start watching the chat if it exists
    if($('#chat-body').length){
        var textArea = $('.field.has-addons').last();
        textArea.append(chatReaderControlPanelIcon);
        textArea.append(chatReaderControlPanelTemplate);
        $('#KrystynaActivityButtonId').click(TTSButtonActivity);
        $('#krystynaVolumeId').change(TTSVolume);
        $('#krystynaSpeedId').change(TTSSpeed);
        $('#krystynaLanguageId').change(TTSLang);
        $('#resetButtonId').click(TTSResetSettings);
        $('.textarea:last').keyup(liftIconUpOrDown);

        if(startChatObserver){
            console.log("chat observer is already started");
        } else{
            startChatObserver = true;
            var chatTarget = document.getElementById('chat-body');
            chatObserver.observe(chatTarget, chatObserverConfig);
        }
    }

    //watching side navigation(attributes of this item change when the user navigates through the web page)
    $('.__cov-progress').last().observe('attributes',function(record){
        console.log('page changed');
        if($('#chat-body').length){
            if($('#chatReaderControlPanelIconId').length){
                console.log('the chat reader control panel has already been injected');
            } else {
                var textArea = $('.field.has-addons').last();
                textArea.append(chatReaderControlPanelIcon);
                textArea.append(chatReaderControlPanelTemplate);
                $('#KrystynaActivityButtonId').click(TTSButtonActivity);
                $('#krystynaVolumeId').change(TTSVolume);
                $('#krystynaSpeedId').change(TTSSpeed);
                $('#krystynaLanguageId').change(TTSLang);
                $('#resetButtonId').click(TTSResetSettings);
                $('.textarea:last').keyup(liftIconUpOrDown);
            }

            if(startChatObserver){
                console.log("chat observer is already started");
            } else{
                startChatObserver = true;
                var chatTarget = document.getElementById('chat-body');
                chatObserver.observe(chatTarget, chatObserverConfig);
                console.log("starting chat observer");
            }
        } else{
            if(startChatObserver){
                startChatObserver = false;
                console.log("disconnect chat observer");
                chatObserver.disconnect();
            }
        }
    });
});