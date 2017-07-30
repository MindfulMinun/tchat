# tchat todo list:
- [x] Store / Receive chats with the Firebase Realtime DB
- [ ] Send Push Messages w/ Firebase Messaging
- [ ] Use Firebase Storage for user-uploaded images.
    - [ ] (Only upload if user is logged in)
- [x] Create Authentication
    - [x] Sign in with email
    - [x] Sign in with Google
    - [x] Sign in anonymously.
    - [x] Anon’s would still be able to read messages
- [x] Create global messaging
- [ ] Create uploader


## Individual files
- `index.html`
    - [ ] *FIXME*, 215: Listen until *all* the assets are ready, not just `index`
    - [ ] 193: Maybe remove commit message?
    - [ ] 209: Redundant?
- `tchat.js`
    - [ ] 39-41
        - [ ] *FIXME*: Before sending a message, verify that `channel` is active.
        - [ ] Add a character limit to prevent spam
        - [ ] Add message throttle to prevent spam
            - (throttle = limit # of messages per second)
    - [ ] 11-14: Add support for the following:
        - [ ] Channels
        - [ ] Images
        - [ ] Pseudo-Markdown
- `master.scss`
    - [ ] Toasts
        - [ ] Change bg to white
        - [ ] Change to black text
        - [ ] Make links blue
