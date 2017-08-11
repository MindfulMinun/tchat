# Direct Messaging
Assume there are two people, say Alice and Bob.  
Alice multiplies[<sup>&dagger;</sup>][1] her uID with Bob's UID.  
Bob multiplies[<sup>&dagger;</sup>][1] his uID with Alice's UID.  


This results in them both having the same number which they can use to generate a channel key.
Then, they both use the some form of key exchange to encrypt their messages with, basically establishing End-to-end encryption.

However, there's one problem: where do they store their keys? They can't store them locally because of self-XSS. They can't store them in the database because that would defeat the point of encryption.

Nevertheless, I *will* be implementing direct messaging, just not with End-to-end encryption.

<div id="note-1">
<sup>&dagger;</sup> This would preferably be function, it wouldn't have to be secure, but it would have to make sure that no two UIDs would return the same as another two UIDs. Furthermore, it should compress the multiplied number so that the channel key isn't 
</div>

[1]: #note-1
