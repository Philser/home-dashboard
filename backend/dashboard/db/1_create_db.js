db.createUser({
    user: "phil",
    pwd: "phil",
    roles: [
        {
            role: "readWrite",
            db: "dashboard"
        }
    ]
})
