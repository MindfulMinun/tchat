(function() {
    'use strict';
    const
        auth     = firebase.auth(),
        user     = firebase.auth().currentUser,
        accountSection = document.getElementById('account'),
        login    = accountSection.querySelector('#login'),
        //! Old-fashioned sign in
        emailTxt = login.querySelector('input[type="email"]'),
        pwordTxt = login.querySelector('input[type="password"]'),
        loginWithEmail = login.querySelector('button[data-login="loginWithEmail"]'),
        signUpWithEmail = login.querySelector('button[data-login="signUpWithEmail"]'),
        //! Sign in buttons
        googleSignIn   = login.querySelector('button[data-login="google"]'),
        twitterSignIn  = login.querySelector('button[data-login="twitter"]'),
        signOut  = account.querySelector('#signOut'),
        //! Sign in providers
        signInProvSelect = account.querySelector('[data-account="providerSelect"]'),
        removeSignInProv = account.querySelector('[data-account="unlinkProvider"]'),
        addSignInProv = account.querySelector('[data-account="linkProvider"]'),
        signInProviders = [
            new firebase.auth.GoogleAuthProvider(),
            new firebase.auth.TwitterAuthProvider()
            // new firebase.auth.FacebookAuthProvider(),
            // new firebase.auth.GithubAuthProvider()
        ];

    loginWithEmail.addEventListener('click', function () {
        var email = emailTxt.value;
        var pword = pwordTxt.value;
        auth.signInWithEmailAndPassword(email, pword).then(function () {
            emailTxt.value = null;
            pwordTxt.value = null;
        }).catch(function (e) {
            errorHandler(e);
        });
    });
    googleSignIn.addEventListener('click', function () {
        var provider = signInProviders[0];
        auth.signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
        }).catch(function(e) {
            // Handle Errors here.
            var errorCode = e.code;
            var errorMessage = e.message;
            var email = e.email;
            var credential = e.credential;
            errorHandler(e);
        });
    });
    twitterSignIn.addEventListener('click', function () {
        var provider = signInProviders[1];
        auth.signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
        }).catch(function(e) {
          // Handle Errors here.
          var errorCode = e.code;
          var errorMessage = e.message;
          var email = e.email;
          var credential = e.credential;
          errorHandler(e)
        });
    });
    addSignInProv.addEventListener('click', function () {
        var val = signInProvSelect.value;
        var provider = signInProviders[val];
        if (provider !== undefined) {
            auth.currentUser.linkWithPopup(provider).then(function(result) {
                var credential = result.credential;
                var user = result.user;
                Materialize.toast('Linked accounts successfully.', 5000);
            }).catch(function(e) {
                errorHandler(e);
            });
        } else {
            Materialize.toast('Please select a provider.', 3000);
        }
    });
    removeSignInProv.addEventListener('click', function () {
        var val = signInProvSelect.value;
        if (val === "0") {
            auth.currentUser.unlink("google.com").then(function() {
                Materialize.toast('Unlinked Google account successfully', 5000);
            }).catch(function(e) {
                  errorHandler(e);
            });
        } else if (val === "1") {
            auth.currentUser.unlink("twitter.com").then(function() {
                Materialize.toast('Unlinked Twitter account successfully', 5000);
            }).catch(function(e) {
                errorHandler(e);
            });
        } else {
            Materialize.toast('Please select a provider.', 3000);
        }
    });
    signUpWithEmail.addEventListener('click', function () {
        //! TODO: Verify real email
        var email = emailTxt.value;
        var pword = pwordTxt.value;
        auth.createUserWithEmailAndPassword(email, pword).catch(function (e) {
            errorHandler(e);
        });
        user.sendEmailVerification().then(function() {
            Materialize.toast('Account created. Please verify your email address.', 10000);
        }).catch(function(error) {
            Materialize.toast('An error occured. Please reverify your email. <a href="./manage-account/#reverify-email" class="btn-flat">Resend email</a>', 7000);
        });
    });
    signOut.addEventListener('click', function () {
        auth.signOut();
    });

    function errorHandler(e, txt) {
        var errtxt;
        if (e.code === "auth/user-not-found") {
            errtxt = "Sorry, but no account is associated with that email.";
        } else if (e.code === "auth/invalid-email") {
            errtxt = "The email isn’t formatted correctly.";
        } else if (e.code === "auth/wrong-password") {
            errtxt = 'Incorrect or invalid password.';
        } else if (e.code === "auth/network-request-failed") {
            errtxt = "A network error prevented the request.";
        } else if (e.code === "auth/provider-already-linked") {
            errtxt = "You’ve already linked an account with that provider. You can’t have more than one account per provider";
        } else {
            errtxt = "Error: " + e.message;
        }
        Materialize.toast(errtxt, 7000);
        console.log(e);
    };
}());
