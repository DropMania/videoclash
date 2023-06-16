
import { Client } from "tmi.js";
import { getTwitchToken } from "src/utils.js";
import { twitch_token } from "src/store.js";
import keys from "src/keys.js";


var oClient = null;
var sChannel = null;
var sRedemtionId = "";
var sProvider = "";

const setProvider = (createRedemption) => {
    sProvider = createRedemption;
}

const createClient = (channel) =>{
    oClient = Client({
        channels: [channel],
        identity: {
            username: channel,
            password: getTwitchToken
        }
    }).connect()

    sChannel = channel
}

const sendChannelMsg = async (msg) =>{
    oClient.say(sChannel, msg);
}

const createRedemption = async (sTitle, sProviderId, nCosts, sPromt, nMaxPerUsers) => {
    // let title = '[VideoClash] Submit a video'
    let listRes = await fetch(
        `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${sProviderId}`,
        {
            method: 'GET',
            headers: {
                'Client-ID': keys.twitchClientId,
                Authorization: `Bearer ${twitch_token}`
            }
        }
    )
    let listData = await listRes.json()
    let existing = listData.data.find((d) => d.title === sTitle)
    if (existing) {
        sRedemtionId = existing.id
    } else {
        let redemptionRes = await fetch(
            `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${sProviderId}`,
            {
                method: 'POST',
                headers: {
                    'Client-Id': keys.twitchClientId,
                    Authorization: `Bearer ${twitch_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sTitle,
                    cost: nCosts,
                    prompt: sPromt,
                    is_user_input_required: true,
                    is_max_per_user_per_stream_enabled: true,
                    max_per_user_per_stream: nMaxPerUsers
                })
            }
        )
        let redemptionData = await redemptionRes.json()
        if (redemptionData.data) {
            sRedemtionId = redemptionData.data[0].id
        }
    }
}












module.exports = { oClient, createClient, sendChannelMsg, createRedemption, setProvider };