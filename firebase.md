Firebase chat app:
- Store chats with the Firebase Realtime Db
- Send Push Messages w/ Firebase Messaging
- Auth users w/ email or Google
    - Allow Anon Users
- Use Firebase Storage for user-uploaded images.
    - (Only upload if user is logged in)

Create stuff in chunks:
1. Create Authentication
    - Google, Anon, and Email in that order
    - Anon’s would still be able to see messages
2. Create global messaging
    - Message would be sent like so:
tchat`: {
   chat: {
      1: {
         sender: ‘’,
         msg: ‘’
      }
   }
}`
3. Create uploader
