var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
//--------------------------------------------------------
//Verificar token
//--------------------------------------------------------
//Manera N|1
/*app.use('/', (req, res, next) => {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mesanje: 'token incorrecto ',
                errors: err
            });
        }
        next();
    });
});*/
//Manera N|2
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mesanje: 'token incorrecto ',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
        //return res.status(200).json({
        //    ok: true,
        //    decoded
        //});
    });
}