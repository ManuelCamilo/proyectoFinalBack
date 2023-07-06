import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT,
    uri: process.env.URI,
    client_secret: process.env.CLIENT_SECRET,
    client_id: process.env.CLIENT_ID,
    callback_url: process.env.CALLBACK_URL
}