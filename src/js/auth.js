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
    googleSignIn.addEventListener('click', function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
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
        // firebase.auth().signInWithRedirect(provider);
    });
    signUp.addEventListener('click', function () {
        //! TODO: Verify real email
        var email = emailTxt.value;
        var pword = pwordTxt.value;
        auth.createUserWithEmailAndPassword(email, pword).catch(function (e) {
            errorHandler(e);
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
