export default class currentDTO {
    constructor(user) {
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
    }
}

