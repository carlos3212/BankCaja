const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const usuario = require('../models/usuario');
const underscore = require('underscore');

const { verificarToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificarToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    registros: conteo,
                    usuarios
                })
            })
        })
})

app.post('/usuario', [verificarToken, verificaAdminRole], function(req, res) {
    let body = req.body;
    //console.log(body)
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        } else {
            usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        }

    })


})

app.put('/usuario/:id', [verificarToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = underscore.pick(req.body, ['nombre', 'email', 'img', 'role'])
    usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        }

    })
})

app.delete('/usuario/:id', [verificarToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;

    let cambiarEstado = {
            estado: false
        }
        //Usuario.findByIdAndDelete(id, (err, usarioEliminado) => {
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true, context: 'query' }, (err, usarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usarioBD === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado en la base de datos'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usarioBD
        })
    })
})

module.exports = app