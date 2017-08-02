//! There's nothing here... yet.

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    // if (clients.openWindow) {
    //     try {
    //         var found = false;
    //         clients.matchAll().then(function(clients) {
    //             for (i = 0; i < clients.length; i++) {
    //                 if (clients[i].url === event.notification.data.url) {
    //                     // We already have a window to use, focus it.
    //                     found = true;
    //                     clients[i].focus();
    //                     break;
    //                 }
    //             }
    //             if (!found) {
    //                 // Create a new window.
    //                 clients.openWindow(event.notification.data.url).then(function(windowClient) {
    //                     //! Do stuff
    //                 });
    //             }
    //             event.notification.close();
    //           });
    //     } catch (e) {
    //         console.log(e);
    //         event.notification.close();
    //     }
    // } else {
    //     event.notification.close();
    // }
});
