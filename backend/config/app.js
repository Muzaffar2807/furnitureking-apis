const dotenv = require('dotenv')
dotenv.config()
const env = process.env.NODE_ENV

const dev = {
    app: {
        port: process.env.PORT,
        ui_base_url: process.env.UI_APP_URL,
    },
    jwt: {
        token_secret: 'DRXqa9r4UsjO5F0wMybN2BdTiKGmzAoL',
        token_life: 2592000, // in seconds -  30 Days 
        refresh_token_secret: 'wXyjKZpuoDsmg1MLP8CaHkfO2bUhrF6W',
        refresh_token_life: 7776000 // in seconds - 7 Days
    },
   
};
const config = {
    dev
}
module.exports =
    config[env]