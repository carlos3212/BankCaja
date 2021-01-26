const jwt = require('jsonwebtoken');
// ================================
//verificar token
// ================================
let verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}

///Verifica rol de Administrador

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Se requiere de un ROL de Administrador'
            }
        })
    }
}
module.exports = {
    verificarToken,
    verificaAdminRole
}