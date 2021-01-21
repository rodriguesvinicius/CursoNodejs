const express = require('express');
const routes = express.Router();
const passport = require('passport')
const { deslogado } = require('../helper/authentication')

routes.get('/dashboard', deslogado ,  (req, res) => {
    res.render('usuarios/index.handlebars')
})

routes.get('/profile', deslogado, (req,res)=>{
    res.render('usuarios/profile.handlebars')
})

// autenticando o usuario nesta rota
routes.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/usuario/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next)
})

routes.get('/logout', (req, res) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect('/')
})

module.exports = routes