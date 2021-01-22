const localStrategy = require('passport-local').Strategy
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: "userEmail", passwordField: "userPassword" }, (email, senha, done) => {
        Usuario.findOne({ where: { emailUsuario: email } }).then((usuario) => {
            if (!usuario) {
                console.log("Conta não existe")
                return done(null, false, { message: 'Esta conta não existe' })
            } else {
                bcrypt.compare(senha, usuario.senhaUsuario, (erro, batem) => {
                    if (batem) {
                        return done(null, usuario)
                    } else {
                        return done(null, false, { message: "Senha Incorreta" })
                    }
                })
            }
        })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.idUsuarios)
    });

    passport.deserializeUser(function (id, done) {
        Usuario.findOne({ where: { idUsuarios: id } }).then(user => {
            done(null, user)
        }).catch(err => done(err));
    });
}
