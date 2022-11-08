<script>
// @ts-nocheck

    import supabase from '../supabase'
    import { user } from '../store'
    import { getVideoData, validateLink } from '../utils'
    import { onMount } from 'svelte'
    import { Client } from 'tmi.js'
    import Submissions from '../lib/Submissions.svelte'
    import Game from '../lib/Game.svelte'
    import Edit from '../lib/Edit.svelte'
    import keys from '../keys'
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
        voted: [],
    }
    let editWindow = false
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
                })
                .subscribe()
            loading = false
        })
    })
    let client = new Client({
        channels: [$user.user_metadata.name],
        identity: {
            username: $user.user_metadata.name,
            password: ()=>`oauth:${$user.access_token}`
        }
    })
    client.connect()
    client.on('connected', async (address, port) => {
        /* let res = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${$user.user_metadata.provider_id}`,{
            method: 'POST',
            headers: {
                'Client-Id': keys.twitchClientId,
                'Authorization': `Bearer ${$user.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": "Submit a video",
                "cost": 100,
                "prompt": "Submit a video to the clash",
            })
        }) */
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
        if(gameState.state === stateEnums.NOT_STARTED && clashData.allow_chat_submit){
            if(message.startsWith('!submit')){
                if(submissions.length !== clashData.video_count){
                    let link = message.split(' ')[1]
                    let {valid,response} = await validateLink(link, clashData.max_video_length)
                    if(valid){
                        let { error, data } = await supabase
                            .from('ClashVideo')
                            .insert({ name:tags[ 'display-name' ], link, clash_id: params.id })
                        if(error){
                            client.say(channel,`@${tags[ 'display-name' ]} something went wrong!`)
                        }else{
                            client.say(channel,`@${tags[ 'display-name' ]} your submission has been added!`)
                        }
                    }else{
                        client.say(channel,`@${tags[ 'display-name' ]} ${response}`)
                    }
                }else{
                    client.say(channel,`@${tags[ 'display-name' ]} the submission limit has been reached!`)
                }
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
    function startGame() {
        gameState.state = stateEnums.SHOW_START
    }
    function go() {
        gameState.state = stateEnums.RUNNING
        gameState.submissions = submissions.sort(() => Math.random() - 0.5)
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
        <Submissions
            {submissions}
            {clashData}
            on:deleteSubmission={deleteSubmission}
            on:startGame={startGame}
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
