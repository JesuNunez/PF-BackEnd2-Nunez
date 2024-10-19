export function soloAdmin(req, res, next) {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(403).send("Acceso denegado, solo administradores");
    }
}

export function soloUser(req, res, next) {
    if (req.user.role === "user") {
        next();
    } else {
        res.status(403).send("Acceso denegado, solo usuarios clientes");
    }
}