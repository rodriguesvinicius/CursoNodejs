const Sequelize = require('sequelize');
const pg = require('pg')

pg.defaults.ssl = true

//conexão com banco de dados       // DATABASE       // USERNAME                     /// PASSWORD
const sequelize = new Sequelize('des6i46h71m5v6', 'xphbxexnrfvzxa', 'c2d272a740e5ed27c0c405205af6e363ceb9ccc55a29f88b5066108082c1bbd3', {
    host: 'ec2-54-159-107-189.compute-1.amazonaws.com', /// se estive rlocal use localhost
    port: 5432,
    dialect: 'postgres',
    dialectOptions: { // remover esse atributo quando estiver rodando local
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    },
})

sequelize.authenticate().then(() => {
    console.log("Conectado com sucesso")
}).catch((err) => {
    console.log(err)
})


module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}