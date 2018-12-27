var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


//=====================AUTENTICAFION GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
app.post('/google', async(req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            mesanje: 'no valido'
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (usuario) {
            if (usuario.google === false) {
                return res.status(400).json({
                    ok: false,
                    mesanje: 'Debe de usar su autenticacion normal'
                });
            } else {
                var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 })
                res.status(200).json({
                    ok: true,
                    usuario,
                    token,
                    id: usuario._id
                });
            }
        } else {
            //el usuario no existe .. hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuario) => {
                var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 })
                res.status(200).json({
                    ok: true,
                    usuario,
                    token,
                    id: usuario._id
                });
            });
        }
    })

    //return res.status(200).json({
    //    ok: true,
    //    mesanje: 'google',
    //    googleUser: googleUser
    //});
});

//=====================AUTENTICAFION NORMAL
app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear token
        usuario.password = ':)';
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 })


        res.status(200).json({
            ok: true,
            usuario,
            token,
            id: usuario._id
        });
    });
});

module.exports = app;