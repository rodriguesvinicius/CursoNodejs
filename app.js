const express = require('express');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const app = express();
const path = require('path')
const flash = require('connect-flash')
const usuario = require('./Routes/usuario')
const session = require('express-session')
const Usuario = require('./models/Usuario'); // aqui estamos importando o modulo responsavel por acessar a tabela Usuario do banco de dados
const email = require('validator');
const bcrypt = require('bcryptjs')
const passport = require('passport');
require('./config/auth')(passport)
const { deslogado, logado } = require('./helper/authentication')

// configurando a sessao 
app.use(session({
    secret: 'CursoDeNodejs',
    resave: true,
    saveUninitialized: true
}))

//Inicializa o passport no nosso sistema
app.use(passport.initialize())
app.use(passport.session())

//body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(flash()) // configurando o flash para apresentar mensagens de erro ou sucesso nas nossas paginas

// declarando as nossas variaveis globais que poderão ser usadas posteriormente no nosso servidor
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.user || null
    res.locals.error = req.flash("error")
    next()
})


//handlebars aqui estamos setando o main como nosso layout default e tambem liberando AllowAcess para acessar objeto dentro dos arquivos .handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    // ...implement newly added insecure prototype access
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
);

//public 
app.use(express.static(path.join(__dirname, 'public')))

//condigurando o nosso middle
app.use((req, res, next) => {
    console.log("Eu sou um middler")
    next();
})

app.get('/', logado, (req, res) => {
    // rota responsavel por renderizar a tela de login não é ela que efetua o login do usuario
    res.render('login.handlebars')
})

app.get('/register', logado, (req, res) => {
    // rota resposavel por renderizar a tela de registro não e a rota de salvamento do usuario no banco de dados
    res.render('register.handlebars')
})

app.post('/register', (req, res) => {

    // variavel responsavel por armazenar os erros que ocorrerem
    let erros = []

    if (!req.body.userName || typeof req.body.userName == undefined || req.body.userName == null) {
        erros.push({ texto: "Nome esta incorreto" })
    }

    if (!req.body.userEmail || typeof req.body.userEmail == undefined || req.body.userEmail == null) {
        erros.push({ texto: "E-mail está incorreto" })
    }

    if (!req.body.userPassword || typeof req.body.userPassword == undefined || req.body.userPassword == null) {
        erros.push({ texto: "Senha invalida" })
    }

    if (req.body.userPassword.length < 8) {
        erros.push({ texto: "Senha tem que ter 8 caracteres" })
    }

    if (req.body.userPassword != req.body.confirmPassword) {
        erros.push({ texto: "Senhas não coincidem" })
    }

    if (erros.length > 0) {
        res.render('register.handlebars', { erros: erros })
    } else {
        /// vai ser responsavel por inserir o usuario no banco de dados
        Usuario.findOne({ where: { emailUsuario: req.body.userEmail } }).then((usuario) => {
            if (usuario) {
                // se cair aqui é porque já existe no banco de dados o usuario passado
                console.log('usuario ja existe na base de dados')
                req.flash('error_msg', 'Usuario ja existe na base de dados')
                // estou redirecionando para a pagian de registro
                res.redirect('/register')
            } else {

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(req.body.userPassword, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento")
                            res.redirect('/')
                        }

                        let senhaCrypt = hash

                        Usuario.create({
                            nomeUsuario: req.body.userName,
                            emailUsuario: req.body.userEmail,
                            senhaUsuario: senhaCrypt,
                        }).then(() => {
                            // quando cair aqui dentro e porque o usuario foi registrado com sucesso
                            console.log("Usuario cadastrado com sucesso")

                            req.flash('success_msg', "Usuario cadastrado com sucesso")
                            // refirecionando para a tela de login
                            res.redirect('/')
                        }).catch((err) => {
                            // caso ocorra qualquer tipo de erro o catch ira tratar o erro e apresentar no console
                            console.log(err)
                            req.flash('error_msg', "Houve um problema")
                            res.redirect('/')
                        })
                    })
                })

            }
        }).catch((err) => {
            // caso ocorra qualquer tipo de erro o catch ira tratar o erro e apresentar no console
            console.log(err)
        })
    }
})

app.get

// falando pro meu servidor que / usuarios sera o mapa para acessar minhas rotas presentes no module usuarios
app.use('/usuario', usuario)

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log("Servidor rodando")
})

