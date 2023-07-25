export default class currentDTO {
    constructor(user) {
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
    }
}

// first_name: request.user.first_name,
// last_name: request.user.last_name,
// email: request.user.email,
// age: request.user.age,
// role: request.user.role