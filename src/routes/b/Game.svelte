<script>
    // @ts-nocheck

    import supabase from '../../supabase'
    import { user, twitch_token } from '../../store'
    import keys from '../../keys'
    import { getVideoData, validateLink, getTwitchToken } from '../../utils'
    import { onMount } from 'svelte'

    export let params = {}
    let gameData = {}
    let errorText = ''
    let loading = true
    let stateEnums = {
        NOT_STARTED: 1,
        RUNNING: 2,
        SHOW_RESULTS: 3
    }
    let users = []
    let kickedUsers = []
    let gameState = {
        state: stateEnums.NOT_STARTED
    }
    let picked = {}
    let submitted = null
    if (!$user) {
        errorText = 'You need to log in to see this page!'
    }
    function fillDummyUsers() {
        users.push({
            id: 91642630,
            display_name: 'DropManiaGaming',
            profile_image_url:
                'https://static-cdn.jtvnw.net/jtv_user_pictures/6340f815-9e0a-4be6-b929-b13cdce53ba3-profile_image-300x300.png'
        })
    }
    onMount(() => {
        loadGame().then(() => {
            loading = false
            /* TODO: remove */
            fillDummyUsers()
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

    client.on('message', async (channel, tags, message, self) => {
        if (
            gameState.state === stateEnums.NOT_STARTED &&
            message.startsWith('!vcjoin')
        ) {
            let userRes = await fetch(
                `https://api.twitch.tv/helix/users?id=${tags['user-id']}`,
                {
                    method: 'GET',
                    headers: {
                        'Client-ID': keys.twitchClientId,
                        Authorization: `Bearer ${$twitch_token}`
                    }
                }
            )
            let userData = await userRes.json()
            let user = userData.data[0]
            let userExists = users.find((u) => u.id === user.id)
            if (!userExists && !kickedUsers.includes(user.id)) {
                users = [...users, user]
            }
        }
        if (
            gameState.state === stateEnums.RUNNING &&
            message.startsWith('!vcpick') &&
            tags['user-id'] == picked.id &&
            !submitted
        ) {
            let link = message.split(' ')[1]
            let { response, valid, videoData } = await validateLink(
                link,
                gameData.max_video_length
            )
            if (valid) {
                submitted = videoData
                console.log('submitted', submitted)
            } else {
                client.say(channel, `@${tags['display-name']}, ${response}`)
            }
        }
    })
    async function loadGame() {
        let { data, error } = await supabase
            .from('Best')
            .select('*')
            .eq('id', params.id)
            .single()
        if (error) {
            errorText = 'Game does not exist!'
        } else {
            gameData = data
        }
    }
    function kickUser(user) {
        kickedUsers = [...kickedUsers, user.id]
        users = users.filter((u) => u.id !== user.id)
    }
    function startGame() {
        let pickedUser = users[Math.floor(Math.random() * users.length)]
        pickUser(pickedUser)
        gameState.state = stateEnums.RUNNING
    }
    function pickUser(user) {
        picked = user
        users = users.filter((u) => u.id !== user.id)
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
        {gameData.topic}
    </h1>
    {#if gameState.state == stateEnums.NOT_STARTED}
        <h4>Type <b><i>!vcjoin</i></b> to join the game</h4>
        <button
            type="button"
            class="btn mt-3 btn-lg btn-secondary fs-2"
            disabled={users.length < 1}
            on:click={startGame}
        >
            Start
        </button>
        <div
            class="card border-primary mb-3 mt-5 overflow-auto"
            style="height: 60vmin;"
        >
            <div class="card-body h-100">
                <h4 class="card-title">
                    Joined ({users.length}/{gameData.max_user})
                </h4>
                <p class="card-text">below you can see all the joined Users</p>
                <table class="table table-hover h-100 mt-3">
                    <thead>
                        <tr>
                            <th scope="col" />
                            <th scope="col">Name</th>
                            <th scope="col" />
                        </tr>
                    </thead>
                    <tbody>
                        {#each users as user}
                            <tr>
                                <td>
                                    <img
                                        src={user.profile_image_url}
                                        class="rounded-circle"
                                        style="width: 2rem;"
                                        alt="..."
                                    />
                                </td>
                                <td>{user.display_name}</td>
                                <td>
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        on:click={() => kickUser(user)}
                                    >
                                        Kick
                                    </button>
                                </td></tr
                            >
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {:else if gameState.state == stateEnums.RUNNING}
        {#if !submitted}
            <h3 class="mt-3">
                {picked.display_name} you have 30 seconds to pick a video!
            </h3>
            <h4>
                Type <i><b>!vcpick [link]</b></i> to pick a video
            </h4>
        {:else}
            <h3 class="mt-3">
                {picked.display_name} picked a video!
            </h3>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${submitted.id}?rel=0`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title="Video"
                class="video"
            />
        {/if}
    {/if}
{/if}

<style>
    .video {
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }
</style>
