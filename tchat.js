(function() {
    'use strict';
    const
        list   = document.getElementById('list'),
        dbrObj = firebase.database().ref().child('betaChannel'),
        dbrList = dbrObj.child('messages'),
        chattxt = document.getElementById('chatTxt');

    dbrList.on('child_added', function (data) {
        console.log(data.val());
        const li = document.createElement('li');
        li.id = "msg" + data.key;
        li.innerText = data.val().from + ": " + data.val().msg;
        list.appendChild(li);
        updateScroll();
    });
    dbrList.on('child_changed', function (data) {
        const liChanged = document.getElementById("msg" + data.key);
        liChanged.innerText = data.val().from + ": " + data.val().msg;
    });
    dbrList.on('child_removed', function (data) {
        const liToRemove = document.getElementById("msg" + data.key);
        liToRemove.remove();

    });

    chattxt.addEventListener('keypress', function (e) {
        if (e.keyCode == 13 && chattxt.value !== '') {
            //! TODO: Check if channel is active
            if (firebase.auth().currentUser) {
                sendMessage(chattxt.value, (firebase.auth().currentUser.displayName || 'Anon.'));
            } else {
                Materialize.toast("You’re not logged in. Log in to send chats.", 7000)
            }
            chattxt.value = '';
        }
    });

    function sendMessage(msg, from) {
        var newdbr = dbrList.push(),
            meta = {
                edited: false,
                from: from,
                msg: msg,
                timestamp: Number(Date.now())
            };
        console.log("Sending message...");
        newdbr.set(meta);
    }
    function updateScroll() {
        if (document.getElementById('tchat').classList.contains('active')) {
            var el = document.getElementsByClassName('body')[0];
            el.scrollTop = el.scrollHeight;
        }
    }
    $(document).ready(function () {
        $('ul.tabs').tabs({
            onShow: updateScroll
        });
    });

}());
