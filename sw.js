---
---
//! ServiceWorker
const
    VERSION = 'Static {{ site.version }}',
    FILES   = [
        './',
        './index.html',
        'https://benji.pw/assets/icons/t.png',
        // './styles/master.css',
        './styles/master.testing.css',
        //! Static stuff
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/css/materialize.min.css',
        // 'https://www.gstatic.com/firebasejs/4.1.5/firebase.js',
        'https://code.jquery.com/jquery-2.1.1.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/js/materialize.min.js'
    ];
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(VERSION).then(cache => {
            return cache.addAll(FILES);
        })
    );
});
self.addEventListener('activate', _ => {
    //! TODO: Clean up the old caches
})
this.addEventListener('fetch', event => {
    // console.log('Handling fetch for ' + event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            //! Check if it's in the cache,
            if (response) {
                console.log('Serving file(s) from cache');
                return response;
            } else {
                //! No response found in cache, going to the network
                return fetch(event.request).then(response => {
                    //! Received a response from the network
                    return response;
                })
                .catch(err => {
                    console.log('Fetching failed: ', err);
                })
            }
        })
    );
});
self.addEventListener('push', event => {
    event.waitUntil(
        self.registration.showNotification('Notification Title', {
            body: 'Lorem ipsum dolor sit amet...',
            icon: 'https://benji.pw/assets/icons/t.png',
            badge: 'https://benji.pw/assets/icons/t.png',
            vibrate: [100, 150, 100],
            data: {
                id: 'messageID' //! Can be retrieved with Firebase
            },
            actions: [
                // {action: 'actionName', title: 'Title to be displayed'},
                {action: 'open',  title: 'Open'},
                {action: 'reply', title: 'Reply'}
            ]
        })
    );
});
self.addEventListener('notificationclick', event => {
    var id = event.notification.data.id;
    event.notification.close();
    if (event.action === 'reply') {
        //! Create a reply
    }
    else if (event.action === 'open') {
        //! Open the message
        // clients.openWindow('/path/to/open')
    }
    else {
        //! Some fallback when clicked, such as open the tchat, per se
        // client.openWindow('./#tchat')
    }
}, false);
