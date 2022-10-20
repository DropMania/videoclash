import keys from './keys'
export function shortid(len = 11) {
    let result = ''
    let chars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    for (let i = len; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

export async function getVideoData(id) {
    let res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${keys.youtubeKey}&id=${id}&part=snippet,contentDetails`,
        { method: 'GET' }
    )
    let data = await res.json()
    return data.items[0]
}

export async function callBot(endpoint, params) {
    let URL = 'https://videoclash-bot.onrender.com'
    if (location.origin.startsWith('http://')) {
        URL = 'http://localhost:5000'
    }
    let res = await fetch(`${URL}/${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(params)
    })
    let data = await res.json()
    return data
}
