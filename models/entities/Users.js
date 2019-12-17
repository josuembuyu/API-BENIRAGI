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