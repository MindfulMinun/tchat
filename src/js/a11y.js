(function() {
    'use strict';
    window.a11y = window.a11y || {};

    let previousActiveElement;
    const
        switchChannelsBtn = document.getElementById('aria-switchChannelsBtn'),
        sideNavBtn        = document.getElementById('aria-side-nav-btn'),
        sideNav           = document.getElementById('sideNavWrapper');

    a11y.sideNav = function (action) {
        if (action === 'open') {
            previousActiveElement = document.activeElement || sideNavBtn;
            sideNav.inert = false;
            sideNav.querySelector('a').focus();
            log('Focused sideNav');
        } else if (action === 'close') {
            previousActiveElement.focus();
            sideNav.inert = true;
            log('Returned focus to previousActiveElement');
        }
    }
    a11y.dialog = function (action, id) {
        var dialog = document.getElementById(id);
        previousActiveElement = document.activeElement;
        if (action === 'open') {
            //! TODO: Use `dialog`, not jQuery, to open the modal
            $('.modal').modal('open');
            dialog.inert = false;
            try {
                dialog.querySelector('input').focus();
            } catch (e) {
                dialog.querySelector('button').focus();
            } finally {
                log('Focused dialog');
            }
        } else if (action === 'close') {
            previousActiveElement.focus();
            dialog.inert = true;
            log('Returned focus to previousActiveElement');
        }
    }
    switchChannelsBtn.addEventListener('click', function () {
        a11y.dialog('open', 'switchChannel')
    });
    sideNavBtn.addEventListener('click', function () {
        a11y.sideNav('open');
    });
    function log(str) {
        console.log('%ca11y:', 'color:#448aff', str);
    }
}());
