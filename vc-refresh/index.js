const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()
const app = express()

app.use(express.json())

let BASE_URL = ''
if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://www.videoclash.app'
} else {
    BASE_URL = 'http://localhost:5173'
}
const corsOptions = {
    origin: BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(cors(corsOptions))
app.get('/', (req, res) => {
    res.send('Nothing to see here')
})
app.post('/refresh', async (req, res) => {
    const { refresh_token } = req.body
    let response = await axios({
        method: 'post',
        url: 'https://id.twitch.tv/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }
    })
    res.json({ token: response.data.access_token })
})
app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening at ${5000}`)
})
