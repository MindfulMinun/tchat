(function($, M) {
    'use strict';
    window.tchat = {
        currentChannel: {
            id: null
        },
        notifs: false
    };
    window.tchat.channel = function (chID, switching) {
        //! Variables & stuff
        tchat.currentChannel.id = chID.toLowerCase();
        var
            section  = document.getElementById('tchat'),
            messageContainer = section.querySelector('[data-tchat="messageContainer"]'),
            inputBox         = section.querySelector('input[data-tchat="input"]'),
            channelName      = section.querySelector('[data-tchat="chName"]'),
            channel  = firebase.database().ref().child('chat/channels/' + tchat.currentChannel.id),
            messages = channel.child('msgs').orderByKey();

        //! TODO: Add support for channels
        //! TODO: Add support for images
        //! TODO: Add support for pseudo-Markdown

        if (switching === true) {
            M.toast('Switching to channel ' + tchat.currentChannel.id + '&hellip;', 1500);
        }

        //! Before appending messages, clear current ones in case of a channel change.
        //! Furthermore, clear all event listeners
        messageContainer.innerHTML = '';
        inputBox.removeEventListener('keypress', inputListener);
        channel.off('value');
        messages.off('child_added');
        messages.off('child_changed');
        messages.off('child_removed');


        //! Add listeners
        channel.on('value', function (snapshot) {
            var data = snapshot.val();
            try {
                channelName.innerText = data.meta.name;
            } catch (e) {
                M.toast("That’s not a valid channel. Switching to global&hellip;", 3000);
                tchat.channel('global');
                return;
            }
        });
        messages.on('child_added', function (snapshot) {
            const li = document.createElement('li'),
                data = snapshot.val();
            li.id = "msg" + snapshot.key;
            messageContainer.appendChild(li);
            messageToString(data)
            .then(function (string) {
                li.innerHTML = string;
                updateScroll();
            });
        });
        messages.on('child_changed', function (snapshot) {
            const liChanged = document.getElementById("msg" + snapshot.key),
                data = snapshot.val();
            messageToString(data)
            .then(function (string) {
                liChanged.innerHTML = string;
            });
        });
        messages.on('child_removed', function (snapshot) {
            const liToRemove = document.getElementById("msg" + snapshot.key);
            if (liToRemove) {
                liToRemove.remove();
            }
        });

        //! Input handler
        inputBox.addEventListener('keypress', inputListener);

        function inputListener(e) {
            if ((e.which === 13 || e.keyCode === 13) && inputBox.value !== '') {
                //! XXX: Add character limit
                //! XXX: Add message throttling.
                if (firebase.auth().currentUser) {
                    sendMessage(inputBox.value);
                } else {
                    M.toast("You’re not logged in. Log in to send chats.", 3000);
                }
                inputBox.value = '';
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
            let channel  = firebase.database().ref().child('chat/channels/' + tchat.currentChannel.id);
            let messages = channel.child('msgs');
            var meta = {
                    edited: false,
                    from: firebase.auth().currentUser.uid,
                    msg: msg,
                    timestamp: Number(Date.now())
                };
            messages.push().set(meta);
            updateScroll();
        }
        function messageToString(data) {
            //! Regular expressions
            var url    = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
            var em     = /(^|[\s\S])\_(\S[\s\S]*?)\_([\s\S]|$)/g;
            var bold   = /(^|[\s\S])\*(\S[\s\S]*?)\*([\s\S]|$)/g;
            // var emBold =
            // var boldEm =

            //! Keep raw messsage for notification
            var raw = data.msg;

            //! User reference for later
            var users = firebase.database().ref('/users/' + data.from);

            //! HTML escape message
            data.msg = escapeHTML(data.msg);
            //! Link module
            data.msg = data.msg.replace(url, function (str) {
                var a = document.createElement('a'),
                    h = Boolean(str.startsWith('http:\/\/') || str.startsWith('https:\/\/'));
                a.href = h ? str : '\/\/'+ str;
                a.innerHTML = str;
                a.target = '_blank';
                return a.outerHTML;
            });
            //! Em module
            data.msg = data.msg.replace(em, function (str, s1, s2, s3) {
                var em = document.createElement('em');
                em.innerHTML = s2;
                return s1 + em.outerHTML + s3;
            });
            //! Bold module
            data.msg = data.msg.replace(bold, function (str, s1, s2, s3) {
                var strong = document.createElement('strong');
                strong.innerHTML = s2;
                return s1 + strong.outerHTML + s3;
            });

            //! String constructor
            return users.once('value').then(function (snapshot) {
                var u = snapshot.val();
                var a = {
                    name: u.username,
                    msg : data.msg,
                    user: u,
                    data: data,
                    raw : raw
                };
                return a;
            }).then(function (a) {
                //! Notification module
                var notOldMessage = (Number(a.data.timestamp) > Number(tchat.loadedTime));
                if (!document.hasFocus() && tchat.notifs === true && notOldMessage) {
                    navigator.serviceWorker.ready.then(function (reg) {
                        reg.showNotification(a.name || 'New message', {
                            body: raw,
                            icon: a.user.photo,
                            badge: 'https:\/\/benji.pw/assets/icons/t.png',
                            vibrate: [100,150,100],
                            data: { id: 'tchat', url: 'https:\/\/benji.pw/tchat/' }
                            // image: 'https:\/\/puu.sh/vK9JI/4b9737eec5.jpg',
                            // actions: [
                            //     {action: 'like', title: 'Like'},
                            //     {action: 'save', title: 'Favorite'}
                            // ]
                        });
                    });
                }
                return a;
            }).then(function (a) {
                //! Actually forming the message
                a.msg = twemoji.parse(a.msg);
                // console.log(a);
                let name    = document.createElement('a');
                let message = document.createElement('p');
                let btn     = document.createElement('btn');
                name.innerText = a.name;
                name.classList.add('name');
                name.href = 'https:\/\/benji.pw/tchat/#u/'+ a.data.from;
                name.title = `${a.name}'s profile`;
                message.innerHTML = a.msg;
                message.classList.add('msg')

                return String(name.outerHTML + ': ' + message.outerHTML);
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
    };
    tchat.channel('global', false);
}(jQuery, Materialize));
