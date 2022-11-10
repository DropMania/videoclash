import keys from './keys'
import moment from 'moment'
import { twitch_token } from './store'
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

export async function validateLink(link, maxLen) {
    let response = ''
    let valid = false
    let videoData = null
    try {
        let id = ''
        if (link.includes('youtu.be')) {
            id = link.split('youtu.be/')[1]
        } else {
            let params = new URLSearchParams(new URL(link).search)
            id = params.get('v')
        }
        if (id) {
            videoData = await getVideoData(id)
            if (videoData) {
                let duration = videoData.contentDetails.duration
                let minutes = moment.duration(duration).asMinutes()
                if (minutes <= maxLen) {
                    valid = true
                    response = ''
                } else {
                    response = 'the Video is too long!'
                }
            } else {
                response = 'the Video doesnt exist!'
            }
        } else {
            response = 'You need to paste a Youtube-Video link!'
        }
    } catch (e) {
        response = 'You need to paste a Youtube-Video link!'
    }
    return { response, valid, videoData }
}

export async function getTwitchToken() {
    let URL = 'https://vc-refresh.vercel.app/refresh'
    if (location.origin.startsWith('http://')) {
        URL = 'http://localhost:5000/refresh'
    }
    let res = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh_token: localStorage.getItem('twitch_refresh_token')
        })
    })
    let data = await res.json()
    twitch_token.set(data.token)
    return 'oauth:' + data.token
}
