(function() {
    'use strict';
    //! Account

    var welcome = document.getElementById('accountWelcome'),
        sideNavName  = document.querySelector('#slide-out').querySelector('.name'),
        sideNavEmail = document.querySelector('#slide-out').querySelector('.email'),
        sideNavImg   = document.querySelector('#slide-out').querySelector('img'),
        auth = firebase.auth(),
        user = firebase.auth().currentUser,
        displayName = document.getElementById('displayName'),
        displayImg  = document.getElementById('displayImg'),
        editAccount = document.getElementById('editAccount'),
        saveAccount = document.getElementById('saveAccount'),
        discardAccountChanges = document.getElementById('discardAccountChanges');


    updateUI();
    auth.onAuthStateChanged(function (user) {
        updateUI();
        updateUserDB(user);
        if (user) {
            Materialize.toast('Logged in as ' + user.displayName, 3000);
        } else {
            $(function () {
                $('ul.tabs').tabs('select_tab', 'account');
            })
            console.log('Logged out or not logged in');
        }
    });
    editAccount.addEventListener('click', function () {
        editAccount.classList.add('hide');
        saveAccount.classList.remove('hide');
        discardAccountChanges.classList.remove('hide');

        if (user) {
            displayName.value = user.displayName;
            displayImg.value  = user.photoURL;
        }
        displayName.disabled = false;
        displayImg.disabled = false;
    });
    saveAccount.addEventListener('click', function () {
        //! TODO: Verify that a display name is valid
        //! TODO: Verify that displayImg is an actual image
        editAccount.classList.remove('hide');
        saveAccount.classList.add('hide');
        discardAccountChanges.classList.add('hide');

        saveSettings().then(function() {
            displayName.value = null;
            displayImg.value = null;
            displayName.disabled = true;
            displayImg.disabled = true;
            updateUI();
            Materialize.toast('Settings saved successfully.', 5000);
        }, function(error) {
            Materialize.toast('Error: ' + error.message, 5000);
        });
    });
    discardAccountChanges.addEventListener('click', function () {
        editAccount.classList.remove('hide');
        saveAccount.classList.add('hide');
        discardAccountChanges.classList.add('hide');

        displayName.value = null;
        displayImg.value = null;
        displayName.disabled = true;
        displayImg.disabled = true;
        updateUI();
    });

    function updateUI() {
        var anonUserIcon = 'https://benji.pw/assets/icons/t.png',
            user = firebase.auth().currentUser;
        if (user) {
            welcome.innerText      = "Hi, " + (user.displayName || 'Anonymous') + '!';
            sideNavName.innerText  = (user.displayName || 'Anonymous');
            sideNavEmail.innerText = (user.email || 'No email provided.');
            sideNavImg.src = user.photoURL || anonUserIcon;
            $('#loginFields').addClass('hide');
            $('#accountInfo').removeClass('hide');

            displayName.value = user.displayName;
            displayImg.value = user.photoURL;
            if (Materialize && Materialize.updateTextFields) {
                Materialize.updateTextFields();
            }
        } else {
            welcome.innerText = "You’re not logged in. Log in or sign up.";
            sideNavName.innerText = 'Not logged in.';
            sideNavEmail.innerText = null;
            sideNavImg.src = anonUserIcon;
            $('#loginFields').removeClass('hide');
            $('#accountInfo').addClass('hide');

            displayName.value = null;
            displayImg.value = null;
            if (Materialize && Materialize.updateTextFields) {
                Materialize.updateTextFields();
            }
        }
    }
    function saveSettings() {
        var user = firebase.auth().currentUser;
        return user.updateProfile({
            displayName: displayName.value,
            photoURL: displayImg.value
        });
    }
    function updateUserDB(user) {
        if (user) {
            // console.log(user);
            var usersDB = firebase.database().ref().child('users'),
                uid     = user.uid,
                me      = usersDB.child(uid);
            me.set({
                username: user.displayName,
                photo   : user.photoURL,
                lastUpdated: Number(Date.now())
            });
            // console.log('Updated user db');
        }

    }

}());
