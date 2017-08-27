(function(G) {
    'use strict';
    var F = {
        lazyLoad: function (e) {

            if (F.inView(e)) {
                _loadImg(e);
            } else {
                document.addEventListener('scroll', function _scroll() {
                    if (F.inView(e)) {
                        _loadImg(e);
                        document.removeEventListener('scroll', _scroll);
                    }
                });
            }

            function _loadImg(i) {
                F.print('Loading image...');
                var blurredSrc = i.src;
                i.setAttribute('src', i.dataset.lazy);
                i.addEventListener('load', function () {
                    if (!(i.getAttribute('data-loaded') === "false")) {
                        i.removeAttribute('data-lazy');
                        F.print('Lazy loaded image:', i.src);
                    } else {

                    }
                });
                i.addEventListener('error', function () {
                    i.setAttribute('data-loaded', false);
                    i.setAttribute('src', blurredSrc);
                    F.print("There was a problem lazy-loading the image.", i.dataset.lazy);
                });
            }

        },
        bindInput: function (a) {
            var input = a.querySelector('input');
            input.addEventListener('keyup', function () {
                if (input.value === '') {
                    a.classList.remove('feather-active');
                } else {
                    a.classList.add('feather-active');
                }
            });
        },
        print: function () {
            //! A nice little function that lets you stylize console.logs while debugging
            var production = false;
            if (!(production === true)){
                let _arguments = [].slice.call(arguments);
                _arguments.unshift('%cFeather:', 'color:#00e676');
                console.log.apply(this, _arguments);
            }
        },
        inView: function (el) {
            var elemTop    = el.getBoundingClientRect().top;
            var elemBottom = el.getBoundingClientRect().bottom;

            var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            return isVisible;
        }
    }

    function ready(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        [].forEach.call(document.querySelectorAll('img[data-lazy]'), function (i) {
            F.lazyLoad(i);
        });
        [].forEach.call(document.querySelectorAll('.feather-input'), function (a) {
            //! We call this on the .feather-input wrapper, not the input itself
            F.bindInput(a);
        });
    });

    G.Feather = F;
}(this));
