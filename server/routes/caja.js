const express = require('express');
const app = express();
const Caja = require('../models/caja');
const underscore = require('underscore');

const { verificarToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/caja',verificarToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    let fecha_solicitada = req.query.fecha || null;
    let hora_solicitada = req.query.hora || null;
    
    let solicitud = "";
    if (fecha_solicitada === null && hora_solicitada === null) {
        solicitud = {

        }
    }
    if (fecha_solicitada != null && hora_solicitada != null) {
        solicitud = {
            fecha: fecha_solicitada,
            hora: hora_solicitada
        }
    }
    if (fecha_solicitada != null && hora_solicitada === null) {
        solicitud = {
            fecha: fecha_solicitada
        }
    }

    if (hora_solicitada != null && fecha_solicitada === null) {
        solicitud = {
            hora: hora_solicitada
        }
    }
            
    //console.log(solicitud);
    Caja.find(solicitud, 'n_caja fecha hora')
        .skip(desde)
        .limit(limite)
        .exec((err, cajas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Caja.count(solicitud, (err, conteo) => {
                res.json({
                    ok: true,
                    registros: conteo,
                    cajas
                })
            })
        })
})


app.post('/caja', function(req, res) {
    let fecha = new Date()
    let body = req.body;
    let caja = new Caja({
        n_caja: body.numero_caja,
        fecha: fecha.getDate() + "/" + fecha.getMonth() + 1 + "/" + fecha.getFullYear(),
        hora: fecha.getHours() + ":" + fecha.getMinutes()
    })
    caja.save((err, cajaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                cajaInfo: cajaDB
            })
        }

    })
})



app.delete('/caja/:id', [verificarToken, verificaAdminRole ],function(req, res) {
    let id = req.params.id;

    Caja.findByIdAndDelete(id, (err, regCajaEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (regCajaEliminado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Registro de caja no encontrado en la base de datos'
                }
            })
        }
        res.json({
            ok: true,
            usuario: regCajaEliminado
        })
    })
})

module.exports = app