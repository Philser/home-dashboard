db.createUser(
    {
        user: "user",
        pwd: "password",
        roles: [{ role: 'readWrite', db: 'dashboard' }]
    })

db = new Mongo().getDB("dashboard");

db.createCollection("user")

db.user.insert([
    {
        "username": "user",
        "passwordHash": "$2a$12$8O3huAtyJgGKFM2bvAeF7u9cHppflqBQ3zpe39c97L/v6c0rXffBm" // "password"
    }
])