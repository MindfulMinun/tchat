(function() {
    'use strict';
    window.tchat = {
        currentChannel: {
            id: null
        },
        notifs: false
    };
    window.tchat.channel = function (chID, switching) {
        //! Variables & stuff
        tchat.currentChannel.id = chID.toLowerCase()
        var
            list     = document.getElementById('list'),
            chattxt  = document.getElementById('chatTxt'),
            channelDisplay = document.getElementById('chName'),
            channel  = firebase.database().ref().child('chat/channels/' + tchat.currentChannel.id),
            messages = channel.child('msgs'),
            query    = messages.limitToLast(100);

        //! TODO: Add support for channels
        //! TODO: Add support for images
        //! TODO: Add support for pseudo-Markdown

        if (switching === true) {
            Materialize.toast('Switching to channel ' + tchat.currentChannel.id + '&hellip;', 3000);
        }

        //! Before appending messages, clear current ones in case of a channel change.
        //! Furthermore, clear all event listeners
        list.innerHTML = '';
        chattxt.removeEventListener('keypress', inputListener);
        channel.off('value');
        query.off('child_added');
        query.off('child_changed');
        query.off('child_removed');


        //! Add listeners
        channel.on('value', function (snapshot) {
            var data = snapshot.val();
            try {
                channelDisplay.innerText = data.meta.name;
            } catch (e) {
                Materialize.toast("That’s not a valid channel. Switching to global&hellip;", 3000);
                tchat.channel('global');
            }
        });
        query.on('child_added', function (snapshot) {
            const li = document.createElement('li'),
                data = snapshot.val();
            li.id = "msg" + snapshot.key;
            messageToString(data)
            .then(function (string) {
                li.innerHTML = string;
                list.appendChild(li);
                updateScroll();
            });
        });
        query.on('child_changed', function (snapshot) {
            const liChanged = document.getElementById("msg" + snapshot.key),
                data = snapshot.val();
            messageToString(data)
            .then(function (string) {
                liChanged.innerHTML = string;
            });

        });
        query.on('child_removed', function (snapshot) {
            const liToRemove = document.getElementById("msg" + snapshot.key);
            if (liToRemove) {
                liToRemove.remove();
            }
        });

        //! Input handler
        chattxt.addEventListener('keypress', inputListener);

        function inputListener(e) {
            if ((e.which === 13 || e.keyCode === 13) && chattxt.value !== '') {
                //! XXX: Add character limit
                //! XXX: Add message throttling.
                if (firebase.auth().currentUser) {
                    sendMessage(chattxt.value);
                } else {
                    Materialize.toast("You’re not logged in. Log in to send chats.", 5000)
                }
                chattxt.value = '';
            }
        }

        //! Chacacter escaping
        function escapeHTML(s) {
            return s.replace(/[<>]/g, function(c) {
                return {
                    // '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;'
                    // '"': '&quot;',
                    // "'": '&#39;'
                }[c];
            });
        }
        function sendMessage(msg, from) {
            var channel  = firebase.database().ref().child('chat/channels/' + tchat.currentChannel.id);
            var messages = channel.child('msgs');
            var meta = {
                    edited: false,
                    from: firebase.auth().currentUser.uid,
                    msg: msg,
                    timestamp: Number(Date.now())
                };
            messages.push().set(meta);
            updateScroll()
        }
        function messageToString(data) {
            // var url = /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            // var em  = /\b_(\S[\s\S]*?)_\b/gi;
            // var bold = /(?:^| +)\*{1}(\S[\s\S]*?)\*{1}(?: +|$)/gi;

            //! Keep raw messsage for notification
            var raw = data.msg;

            //! HTML escape message
            data.msg = escapeHTML(data.msg);
            //! Link module
            data.msg = data.msg.replace(/[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, function (str) {
                var a = document.createElement('a'),
                    h = Boolean(str.startsWith('http://') || str.startsWith('https://'));
                h ? a.href = str : a.href = '//' + str;
                a.innerHTML = str;
                a.target = '_blank';
                return a.outerHTML;
            });
            //! Bold module
            data.msg = data.msg.replace(/(?:^| +)\*{1}(\S[\s\S]*?)\*{1}(?: +|$)/gi, function (str, s1) {
                var strong = document.createElement('strong');
                strong.innerHTML = s1;
                return strong.outerHTML;
            })
            //! Em module
            data.msg = data.msg.replace(/\b_(\S[\s\S]*?)_\b/gi, function (str, s1) {
                var em = document.createElement('em');
                em.innerHTML = s1;
                return em.outerHTML;
            });

            //! String constructor
            return firebase.database().ref('/users/' + data.from).once('value').then(function(snapshot) {
                var user = snapshot.val();
                return [user.username, data.msg, user, data];
            }).then(function (a) {
                var notOldMessage = (Number(a[3].timestamp) > Number(tchat.loadedTime));
                if (!document.hasFocus() && tchat.notifs === true && notOldMessage) {
                    navigator.serviceWorker.ready.then(function (reg) {
                        reg.showNotification(a[0] || 'New message', {
                            body: a[1],
                            icon: a[2].photo,
                            badge: 'https://benji.pw/assets/icons/t.png',
                            vibrate: [100,150,100],
                            data: { id: 'tchat', url: 'https://benji.pw/tchat/' }
                            // image: 'https://puu.sh/vK9JI/4b9737eec5.jpg',
                            // actions: [
                            //     {action: 'like', title: 'Like'},
                            //     {action: 'save', title: 'Favorite'}
                            // ]
                        });
                    });
                }
                return a;
            }).then(function (a) {
                return '' + a[0] + ': ' + a[1];
            });
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
    }
    tchat.channel('global', false);
}());
