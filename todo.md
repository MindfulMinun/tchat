# tchat todo list:
- [x] Store / Receive chats with the Firebase Realtime DB
- [ ] Send Push Messages w/ Firebase Messaging
- [ ] Use Firebase Storage for user-uploaded images.
    - [ ] (Only upload if user is logged in)
- [x] Create Authentication
    - [x] Sign in with email
    - [x] Sign in with Google
    - [x] Anon’s would still be able to read messages
- [x] Create global messaging
- [ ] Create image uploader


## Individual files
- `index.html`
    - [ ] 115: Change ID `list` to something more descriptive
    - [ ] *FIXME*, 215: Listen until *all* the assets are ready, not just `index`
- `sw.js`
    - [ ] Offline? Nahh
    - [ ] Implement push notifications
- `tchat.js`
    - [ ] 39-41
        - [x] *FIXME*: Before sending a message, verify that `channel` is active.
        - [ ] Add a character limit to prevent spam
        - [ ] Add message throttle to prevent spam
            - (throttle = limit # of messages per second)
    - [ ] 11-14: Add support for the following:
        - [ ] Channels
            - [ ] User-created channels
            - [x] Switching back and forth between channels
        - [ ] Pseudo-Markdown??
            - [x] Links
            - [x] Bold
            - [x] Italics
            - [ ] Strikethrough
            - [x] Links
            - [ ] Images
- `master.scss`
