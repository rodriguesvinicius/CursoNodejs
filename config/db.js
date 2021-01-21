const Sequelize = require('sequelize');
const pg = require('pg')

//conexão com banco de dados
const sequelize = new Sequelize('postgres', 'postgres', 'Vinizika231199', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
})

sequelize.authenticate().then(()=>{
    console.log("Conectado com sucesso")
}).catch((err)=>{
    console.log(err)
})


module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}