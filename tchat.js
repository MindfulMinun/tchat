(function() {
    'use strict';
    const
        channelName = 'debugging',
        list     = document.getElementById('list'),
        channel  = firebase.database().ref().child('chat/channels/' + channelName),
        messages = channel.child('msgs'),
        query    = messages.limitToLast(100),
        chattxt  = document.getElementById('chatTxt');

    //! TODO: Add support for channels
    //! TODO: Add support for images
    //! TODO: Add support for pseudo-Markdown

    channel.once('value').then(function (snap) {
        var data = snap.val()
        document.getElementById('chName').innerText = data.meta.name;
        console.log('Currently in chat/channels/' + channelName, data);
    });
    query.on('child_added', function (snap) {
        console.log(snap.val());
        const li = document.createElement('li');
        li.id = "msg" + snap.key;
        li.innerText = snap.val().from + ": " + snap.val().msg;
        list.appendChild(li);
        updateScroll();
    });
    query.on('child_changed', function (snap) {
        const liChanged = document.getElementById("msg" + snap.key);
        liChanged.innerText = snap.val().from + ": " + snap.val().msg;
    });
    query.on('child_removed', function (snap) {
        const liToRemove = document.getElementById("msg" + snap.key);
        liToRemove.remove();
    });

    chattxt.addEventListener('keypress', function (e) {
        if (e.keyCode == 13 && chattxt.value !== '') {
            //! XXX: FIXME: Verify that `channel` is active
            //! XXX: Add character limit
            //! XXX: Add message throttling.
            if (firebase.auth().currentUser) {
                sendMessage(chattxt.value, (firebase.auth().currentUser.displayName || 'Anon.'));
            } else {
                Materialize.toast("You’re not logged in. Log in to send chats.", 7000)
            }
            chattxt.value = '';
        }
    });

    function sendMessage(msg, from) {
        console.log(channel);
        var newdbr = messages.push(),
            meta = {
                edited: false,
                from: from,
                msg: msg,
                timestamp: Number(Date.now())
            };
        newdbr.set(meta);
    }
    function updateScroll() {
        if (document.getElementById('tchat').classList.contains('active')) {
            var el = document.getElementsByClassName('chat-container')[0];
            el.scrollTop = el.scrollHeight;
        }
    }
    $(document).ready(function () {
        $('ul.tabs').tabs({
            onShow: updateScroll
        });
    });

}());
