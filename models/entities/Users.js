module.exports.Users = function Users() {
    return {
        email: String,
        password: String,
        id_type: String,
        flag: false,
        visibility: true,
        created_at: new Date()
    }
}