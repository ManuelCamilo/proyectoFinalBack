const isAdmin = (request, response, next) => {
    const adminRole = "admin"
    if (request.session.user && request.session.user.role === adminRole) {
        next();
    } else {
        response.status(401).json({ error: "Acceso no autorizado"})
    }
}

export default isAdmin;