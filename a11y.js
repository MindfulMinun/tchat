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
            sideNav.querySelector('a').focus();
            log('Focused sideNav');
        } else if (action === 'close') {
            previousActiveElement.focus();
            log('Returned focus to previousActiveElement');
        }
    }
    a11y.dialog = function (action, id) {
        var dialog = document.getElementById(id);
        previousActiveElement = document.activeElement;
        if (action === 'open') {
            $('.modal').modal('open');
            try {
                dialog.querySelector('input').focus();
            } catch (e) {
                dialog.querySelector('button').focus();
            } finally {
                log('Focused dialog');
            }
        } else if (action === 'close') {
            previousActiveElement.focus();
            log('Returned focus to previousActiveElement');
        }
    }
    switchChannelsBtn.addEventListener('click', function () {
        a11y.dialog('open', 'switchChannel')
    });
    sideNavBtn.addEventListener('click', function () {
        a11y.sideNav('open');
    });
    function log(str, args) {
        console.log('%ca11y:', 'color:#448aff', str);
    }
}());
