<script>
    // @ts-nocheck

    import supabase from '../../supabase'
    import { user, twitch_token } from '../../store'
    import { getVideoData, validateLink, getTwitchToken } from '../../utils'
    import { onMount } from 'svelte'
    import Submissions from '../../lib/c/Submissions.svelte'
    import Game from '../../lib/c/Game.svelte'
    import Edit from '../../lib/c/Edit.svelte'
    import keys from '../../keys'
    export let params = {}
    let clashData = {}
    let errorText = ''
    let loading = true
    let submissions = []
    let stateEnums = {
        NOT_STARTED: 1,
        SHOW_START: 2,
        RUNNING: 3,
        SHOW_RESULTS: 4
    }
    const battleStateEnums = {
        PICKED: 1,
        VOTING: 2,
        ENDED: 3,
        FINSISH: 4
    }
    let gameState = {
        state: stateEnums.NOT_STARTED,
        submissions: [],
        winners: [],
        video1: null,
        video2: null,
        vote1: 0,
        vote2: 0,
        voted: []
    }
    let editWindow = false
    let redemptionId = ''
    let redemptionLoading = false
    if (!$user) {
        errorText = 'You need to log in to see this page!'
    }
    onMount(() => {
        loadClash().then(() => {
            loadSubmissions()
            supabase
                .from('ClashVideo')
                .on('*', async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        if (payload.new.clash_id !== clashData.id) return
                        let id = ''
                        if (payload.new.link.includes('youtu.be')) {
                            id = payload.new.link.split('youtu.be/')[1]
                        } else {
                            let params = new URLSearchParams(
                                new URL(payload.new.link).search
                            )
                            id = params.get('v')
                        }
                        let videoData = await getVideoData(id)
                        submissions = submissions.concat({
                            ...payload.new,
                            videoData,
                            youtubeId: id
                        })
                    }
                    if (payload.eventType === 'DELETE') {
                        submissions = submissions.filter(
                            (submission) => submission.id !== payload.old.id
                        )
                    }
                    if (payload.eventType === 'UPDATE') {
                        let submission = submissions.find((element) => {
                            return element.id === payload.old.id
                        })
                        submission.approval = payload.new.approval
                        submissions =
                            submissions /* stupid but works to refresh the store :DDD */
                    }
                })
                .subscribe()
            loading = false
        })
    })
    let client = new tmi.Client({
        channels: [$user.user_metadata.name],
        identity: {
            username: $user.user_metadata.name,
            password: getTwitchToken
        }
    })
    if (localStorage.getItem('twitch_refresh_token')) {
        client.connect()
    } else {
        errorText = 'Something went wrong, please log in again'
    }
    client.on('redeem', async (channel, username, reward, tags, redeemMsg) => {
        if (reward === redemptionId) {
            let success = await submitVideo(
                channel,
                tags['display-name'],
                redeemMsg
            )
            let redemptionsRes = await fetch(
                `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${$user.user_metadata.provider_id}&status=UNFULFILLED&reward_id=${reward}`,
                {
                    method: 'GET',
                    headers: {
                        'Client-ID': keys.twitchClientId,
                        Authorization: `Bearer ${$twitch_token}`
                    }
                }
            )
            let redemptions = await redemptionsRes.json()
            let redemption = redemptions.data.find(
                (redemption) => redemption.user_login === tags.username
            )
            if (redemption) {
                if (!success) {
                    await fetch(
                        `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${$user.user_metadata.provider_id}&id=${redemption.id}&reward_id=${reward}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Client-ID': keys.twitchClientId,
                                Authorization: `Bearer ${$twitch_token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                status: 'CANCELED'
                            })
                        }
                    )
                } else {
                    await fetch(
                        `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${$user.user_metadata.provider_id}&id=${redemption.id}&reward_id=${reward}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Client-ID': keys.twitchClientId,
                                Authorization: `Bearer ${$twitch_token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                status: 'FULFILLED'
                            })
                        }
                    )
                }
            }
        }
    })
    client.on('message', async (channel, tags, message, self) => {
        if (gameState.battleState === battleStateEnums.VOTING) {
            if (!gameState.voted.includes(tags.username)) {
                if (message === '1') {
                    gameState.vote1++
                    gameState.voted.push(tags.username)
                }
                if (message === '2') {
                    gameState.vote2++
                    gameState.voted.push(tags.username)
                }
            }
        }
        if (
            gameState.state === stateEnums.NOT_STARTED &&
            clashData.allow_chat_submit &&
            !clashData.enable_reward_submission
        ) {
            if (message.startsWith('!submit')) {
                submitVideo(
                    channel,
                    tags['display-name'],
                    message.split(' ')[1]
                )
            }
        }
        if (
            message.startsWith('!clashlink') &&
            gameState.video1 &&
            gameState.video2
        ) {
            let number = message.split(' ')[1]
            if (number === '1') {
                client.say(
                    channel,
                    `Here is the link for Video 1: https://www.youtube.com/watch?v=${gameState.video1.youtubeId}`
                )
            }
            if (number === '2') {
                client.say(
                    channel,
                    `Here is the link for Video 2: https://www.youtube.com/watch?v=${gameState.video2.youtubeId}`
                )
            }
        }
    })
    async function loadClash() {
        let { data, error } = await supabase
            .from('Clash')
            .select('*')
            .eq('id', params.id)
            .single()
        if (error) {
            errorText = 'Clash does not exist!'
        } else {
            clashData = data
        }
    }
    async function loadSubmissions() {
        let { error, data } = await supabase
            .from('ClashVideo')
            .select('*')
            .eq('clash_id', clashData.id)

        submissions = await Promise.all(
            data.map(async (d) => {
                let id = ''
                if (d.link.includes('youtu.be')) {
                    id = d.link.split('youtu.be/')[1]
                } else {
                    let params = new URLSearchParams(new URL(d.link).search)
                    id = params.get('v')
                }
                let videoData = await getVideoData(id)
                return {
                    ...d,
                    videoData,
                    youtubeId: id
                }
            })
        )
    }
    async function deleteSubmission(event) {
        let { error, data } = await supabase
            .from('ClashVideo')
            .delete()
            .eq('id', event.detail.id)

        if (error) {
            errorText = error.message
        }
    }
    async function startGame() {
        gameState.state = stateEnums.SHOW_START
        if (redemptionId) {
            deleteRedemption()
        }
    }
    function go() {
        gameState.state = stateEnums.RUNNING
        gameState.submissions = submissions.sort(() => Math.random() - 0.5)
    }
    async function createRedemption() {
        let title = '[VideoClash] Submit a video'
        redemptionLoading = true
        let listRes = await fetch(
            `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${$user.user_metadata.provider_id}`,
            {
                method: 'GET',
                headers: {
                    'Client-ID': keys.twitchClientId,
                    Authorization: `Bearer ${$twitch_token}`
                }
            }
        )
        let listData = await listRes.json()
        let existing = listData.data.find((d) => d.title === title)
        if (existing) {
            redemptionId = existing.id
        } else {
            let redemptionRes = await fetch(
                `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${$user.user_metadata.provider_id}`,
                {
                    method: 'POST',
                    headers: {
                        'Client-Id': keys.twitchClientId,
                        Authorization: `Bearer ${$twitch_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        cost: clashData.reward_cost,
                        prompt: 'Submit a video to the clash',
                        is_user_input_required: true,
                        is_max_per_user_per_stream_enabled: true,
                        max_per_user_per_stream: clashData.video_per_person
                    })
                }
            )
            let redemptionData = await redemptionRes.json()
            if (redemptionData.data) {
                redemptionId = redemptionData.data[0].id
            }
        }
        redemptionLoading = false
    }
    async function deleteRedemption() {
        redemptionLoading = true
        let res = await fetch(
            `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${$user.user_metadata.provider_id}&id=${redemptionId}`,
            {
                method: 'DELETE',
                headers: {
                    'Client-Id': keys.twitchClientId,
                    Authorization: `Bearer ${$twitch_token}`
                }
            }
        )
        redemptionId = ''
        redemptionLoading = false
    }
    async function submitVideo(channel, username, link) {
        let submitted = false
        if (submissions.length !== clashData.video_count) {
            let { valid, response } = await validateLink(
                link,
                clashData.max_video_length
            )
            if (valid) {
                let { error, data } = await supabase.from('ClashVideo').insert({
                    name: username,
                    link,
                    clash_id: params.id
                })
                if (error) {
                    client.say(channel, `@${username} something went wrong!`)
                } else {
                    submitted = true
                    client.say(
                        channel,
                        `@${username} your submission has been added!`
                    )
                }
            } else {
                client.say(channel, `@${username} ${response}`)
            }
        } else {
            client.say(
                channel,
                `@${username} the submission limit has been reached!`
            )
        }
        return submitted
    }
    function sendLink() {
        client.say(
            $user.user_metadata.name,
            `Submit your video here: ${location.origin}/#/c/submit/${clashData.id}`
        )
    }

    function copyLinkToClipboard() {
        navigator.clipboard.writeText(
            `${location.origin}/#/mod/clash/${clashData.id}`
        )
    }
</script>

{#if loading}
    <div class="progress">
        <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style="width: 100%;"
        />
    </div>
{:else if errorText}
    <div class="alert alert-dismissible alert-danger">
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            on:click={() => (errorText = '')}
        />
        {errorText}
    </div>
{:else}
    <h1>
        {clashData.topic}
    </h1>

    {#if gameState.state == stateEnums.NOT_STARTED}
        <div class="d-flex  gap-5">
            <button
                class="btn btn-primary my-3"
                on:click={() => (editWindow = true)}
                >Edit Clash <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    />
                </svg></button
            >
            <button class="btn btn-primary my-3" on:click={copyLinkToClipboard}>
                Mod-Link
                <span class="fa fa-eye-slash" />
            </button>
        </div>
        <Submissions
            {submissions}
            {clashData}
            bind:redemptionId
            bind:redemptionLoading
            on:deleteSubmission={deleteSubmission}
            on:startGame={startGame}
            on:createRedemption={createRedemption}
            on:deleteRedemption={deleteRedemption}
            on:sendLink={sendLink}
        />
    {:else if gameState.state == stateEnums.SHOW_START}
        <h3 class="mt-5">Are you ready?</h3>
        <button type="button" class="btn btn-primary btn-lg mt-5" on:click={go}
            >Then GOOOO!</button
        >
    {:else if gameState.state == stateEnums.RUNNING}
        <Game bind:gameState {clashData} {battleStateEnums} {client} />
    {:else if gameState.state == stateEnums.SHOW_RESULTS}
        SHOW RESULTS
    {/if}
    <Edit bind:open={editWindow} {clashData} {loadClash} />
{/if}

<style>
</style>
