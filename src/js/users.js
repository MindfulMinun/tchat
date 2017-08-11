(function($) {
    'use strict';
    var section = document.getElementById('u'),
        search  = section.querySelector('button.btn'),
        input   = section.querySelector('input[type="text"]'),
        auth = firebase.auth();

    if (window.location.hash.startsWith('#u')) {
        $(function () {
            $('ul.tabs').tabs('select_tab', 'u');
            var uid = window.location.hash.slice(3);
            if (uid.length === 28) {
                try {
                    var user = firebase.database().ref('/users/' + uid);
                    user.once('value').then(function (snapshot) {
                        drawUserInfo(snapshot.val());
                    });
                } catch (e) {
                    Materialize.toast('Error: An error occured. The location hash isn’t formatted correctly.', 5000);
                    console.error(e);
                }
            }
        });
    }

    auth.onAuthStateChanged(function (user) {
        if (user) {
            section.querySelector('.uid').innerText = user.uid;
        } else {
            section.querySelector('.uid').parentNode.innerText = "";
        }
    });
    search.addEventListener('click', function () {
        if (input.value === input.value.trim() && input.value !== '' && input.value.length === 28) {
            try {
                var user = firebase.database().ref('/users/' + input.value);
                user.once('value').then(function (snapshot) {
                    drawUserInfo(snapshot.val());
                });
            } catch (e) {
                Materialize.toast('Error: An error occured. Presumably, you didn’t type in a user ID correctly.', 5000);
                console.error(e);
            }
        } else {
            Materialize.toast('Please enter a valid user ID', 5000)
        }
    });
    function drawUserInfo(user) {
        if (user) {
            section.querySelector('.user-section').innerHTML = `<div class="card-panel grey darken-3 z-depth-1">
                <div class="row valign-wrapper">
                    <div class="col s4 m2">
                        <img src="" alt="" class="responsive-img valign">
                    </div>
                    <div class="col s8 m10">
                        <p class="flow-text name">&hellip;</p>
                        <p>Last login: <span class="time">&hellip;</span></p>
                    </div>
                </div>
            </div>`;

            section.querySelector('.user-section img').src = user.photo;
            if (user.verified === true) {
                section.querySelector('.user-section .name').innerText = user.username;
                section.querySelector('.user-section .name').innerHTML += ' <i class="material-icons tiny">verified_user</i>'
            } else {
                section.querySelector('.user-section .name').innerText = user.username;
            }
            section.querySelector('.user-section .time').innerText = (new Date(user.lastUpdated).toLocaleString());

            var raw = document.createElement('pre');
            raw.innerText = '//! Raw user data:\n' + JSON.stringify(user, true, 4);
            section.querySelector('.user-section').appendChild(raw);
        } else {
            Materialize.toast('That’s not a valid user ID. Please enter a valid user ID.', 5000);
        }
    }
}(jQuery));
