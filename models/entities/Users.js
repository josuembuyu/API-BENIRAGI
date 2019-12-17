module.exports.Users = function Users() {
    return {
        email: String,
        password: String,
        id_type: String,
        flag: false,
        visibility: false,
        created_at: new Date()
    }
}

module.exports.Identity = function Identity() {
    return {
        name: String,
        lastName: String,
        postName: String,
        created_at: new Date() 
    }
}