import { Sequelize } from "sequelize"

const db = new Sequelize('socialmediaprototypedb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

export default db