(function() {
    const
        auth     = firebase.auth(),
        emailTxt = document.getElementById('email'),
        pwordTxt = document.getElementById('password'),
        login    = document.getElementById('login'),
        signUp   = document.getElementById('signUp'),
        google   = document.getElementById('googleSignIn'),
        signOut  = document.getElementById('signOut');

    login.addEventListener('click', function () {
        var email = emailTxt.value;
        var pword = pwordTxt.value;
        auth.signInWithEmailAndPassword(email, pword).then(function () {
            emailTxt.value = null;
            pwordTxt.value = null;
        }).catch(function (e) {
            errorHandler(e);
        });
    });
    signUp.addEventListener('click', function () {
        //! TODO: Verify real email
        var email = emailTxt.value;
        var pword = pwordTxt.value;
        auth.createUserWithEmailAndPassword(email, pword).catch(function (e) {
            console.log(e);
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
        } else {
            errtxt = "Error: " + e.message;
        }
        Materialize.toast(errtxt, 7000);
        console.log(e);
    };
}());
