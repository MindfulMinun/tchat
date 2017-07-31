(function() {
    'use strict';
    window.tchat = {};
    window.tchat.channel = function (channelName, switching) {
        channelName = channelName.toLowerCase() || 'global';
        //! Set some constants
        const
            list     = document.getElementById('list'),
            chattxt  = document.getElementById('chatTxt'),
            channelDisplay = document.getElementById('chName'),
            channel  = firebase.database().ref().child('chat/channels/' + channelName),
            messages = channel.child('msgs'),
            query    = messages.limitToLast(100);

        //! TODO: Add support for channels
        //! TODO: Add support for images
        //! TODO: Add support for pseudo-Markdown

        if (switching === true) {
            Materialize.toast('Switching to channel ' + channelName + '&hellip;', 3000);
        }

        //! Before appending messages, clear current ones in case of a channel change.
        list.innerHTML = '';

        //! Add listeners
        channel.once('value').then(function (snapshot) {
            var data = snapshot.val();
            try {
                channelDisplay.innerText = data.meta.name;
            } catch (e) {
                Materialize.toast("That’s not a valid channel. Switching to global&hellip;", 3000);
                tchat.channel('global');
            }
        });
        query.on('child_added', function (snapshot) {
            const li = document.createElement('li');
            li.id = "msg" + snapshot.key;
            li.innerHTML = parseMessage(snapshot.val());
            list.appendChild(li);
            updateScroll();
        });
        query.on('child_changed', function (snapshot) {
            const liChanged = document.getElementById("msg" + snapshot.key);
            liChanged.innerHTML = parseMessage(snapshot.val())

        });
        query.on('child_removed', function (snapshot) {
            const liToRemove = document.getElementById("msg" + snapshot.key);
            liToRemove.remove();
        });

        //! Input handler
        chattxt.addEventListener('keypress', function (e) {
            if ((e.which === 13 || e.keyCode === 13) && chattxt.value !== '') {
                //! XXX: FIXME: Verify that `channel` is active
                //! XXX: Add character limit
                //! XXX: Add message throttling.
                if (firebase.auth().currentUser) {
                    sendMessage(chattxt.value, (firebase.auth().currentUser.displayName || 'Anon.'));
                } else {
                    Materialize.toast("You’re not logged in. Log in to send chats.", 5000)
                }
                chattxt.value = '';
            }
        });

        //! Chacacter escaping
        const ESC_MAP = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        function escapeHTML(s) {
            return s.replace(/[&<>'"]/g, function(c) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[c];
            });
        }
        function sendMessage(msg, from) {
            var newdbr = messages.push(),
                meta = {
                    edited: false,
                    from: from,
                    msg: msg,
                    timestamp: Number(Date.now())
                };
            newdbr.set(meta);
        }
        function parseMessage(data) {
            var url = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            var em  = /\b_(\S[\s\S]*?)_\b/gi;
            var bold = /(?:^| +)\*{1}(\S[\s\S]*?)\*{1}(?: +|$)/g;
            data.msg = escapeHTML(data.msg);
            //! Link module
            data.msg = data.msg.replace(url, function (str) {
                var a = document.createElement('a'),
                    h = Boolean(str.startsWith('http://') || str.startsWith('https://'));
                h ? a.href = str : a.href = '//' + str;
                a.innerHTML = str;
                a.target = '_blank';
                return a.outerHTML;
            });
            //! Bold module
            data.msg = data.msg.replace(bold, function (str, s1) {
                var strong = document.createElement('strong');
                strong.innerHTML = s1;
                return strong.outerHTML;
            })
            //! Em module
            data.msg = data.msg.replace(em, function (str, s1) {
                var em = document.createElement('em');
                em.innerHTML = s1;
                return em.outerHTML;
            })
            console.log(data.msg);
            return '' + data.from + ": " + data.msg;
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
