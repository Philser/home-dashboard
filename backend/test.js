const crypto = require('crypto')
const bcrypt = require('bcrypt')


let sha = crypto.createHash('sha256').update('UN3rKSW#AeA&R2yNbe').digest('hex')
console.log(sha)

// bcrypt.hash(sha, 10, function (err, hash) {
//     console.log(hash)
// })


/*
db.user.insertOne({username: 'phil', passwordHash: '$2b$10$nZvMAVOhet.bu6d6QzJiduWbZPEwKkL7M/gNEd8Ac9ni3ZF55V1k.'})

*/


crypto.generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
}, (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
    console.log(publicKey)
    console.log(privateKey)
});
