function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

window.onload = function(){
    var tableId = document.getElementById('ignoredUsersTable');

    chrome.storage.sync.get({ignoredUsers: []}, function(result){
        console.log(result.ignoredUsers);

        result.ignoredUsers.forEach(function(entry) {
            var trElement = document.createElement('tr');
            tableId.appendChild(trElement);

            var nicknameTd = document.createElement('td');
            nicknameTd.textContent = entry;
            trElement.appendChild(nicknameTd);

            var steemItProfileTd = document.createElement('td');
            trElement.appendChild(steemItProfileTd);

            var steemItProfile = document.createElement('a');
            steemItProfile.href = "https://steemit.com/@" + entry;
            steemItProfile.target = "_blank";
            steemItProfile.textContent = "https://steemit.com/@" + entry;
            steemItProfileTd.appendChild(steemItProfile);

            var dliveProfileTd = document.createElement('td');
            trElement.appendChild(dliveProfileTd);

            var dliveProfile = document.createElement('a');
            dliveProfile.href = "https://www.dlive.io/@" + entry;
            dliveProfile.target = "_blank";
            dliveProfile.textContent = "https://www.dlive.io/@" + entry;
            dliveProfileTd.appendChild(dliveProfile);

            var buttonsTd = document.createElement('td');
            trElement.appendChild(buttonsTd);

            var deleteButton = document.createElement('input');
            deleteButton.type="submit";
            deleteButton.onclick = function(){
                console.log(entry);
                chrome.storage.sync.get({ignoredUsers: []}, function(result){
                    var updatedArray = result.ignoredUsers;
                    removeA(updatedArray, entry);
                    chrome.storage.sync.set({'ignoredUsers': updatedArray});
                    location.reload();
                });
            }
            deleteButton.value = "delete";
            buttonsTd.appendChild(deleteButton);
            
            console.log(entry);
        });
    });
}