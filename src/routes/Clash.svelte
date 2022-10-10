<script>
    import supabase from '../supabase'
    import { user } from '../store'
    import { getVideoData } from '../utils'
    import { onMount } from 'svelte'
    import { Client } from 'tmi.js'
    export let params = {}
    let clashData = {}
    let errorText = ''
    let loading = true
    let copyInput = {}
    let submissions = []
    let twitchClient = {}
    if($user){

        twitchClient = Client({
            options: { debug: true },
            identity: {
                username: $user.user_metadata.name,
                password: `oauth:${$user.access_token}`
            },
            channels: [ $user.user_metadata.name ]
        })
        twitchClient.connect()
    }else{
        errorText = 'You need to log in to see this page!'
    }
    onMount(() => {
        supabase
            .from('Clash')
            .select('*')
            .eq('id', params.id)
            .single()
            .then(({ error, data }) => {
                if (error) {
                    errorText = 'Clash does not exist!'
                } else {
                    clashData = data
                    loadSubmissions()
                    supabase
                        .from('ClashVideo')
                        .on('*', (payload) => {
                            loadSubmissions()
                        })
                        .subscribe()
                }
                loading = false
            })
    })
    function copyLink() {
        copyInput.select()
        document.execCommand('copy')
    }
    async function loadSubmissions() {
        let { error, data } = await supabase
            .from('ClashVideo')
            .select('*')
            .eq('clash_id', clashData.id)

        submissions = data.map((d) => {
            let params = new URLSearchParams(new URL(d.link).search)
            return {
                ...d,
                youtubeId: params.get('v')
            }
        })
    }
    async function deleteSubmission(videoData) {
        let { error, data } = await supabase
            .from('ClashVideo')
            .delete()
            .eq('id', videoData.id)

        if (error) {
            errorText = error.message
        }
    }
    function startGame(){
        if(twitchClient._isConnected()){
            twitchClient._sendMessage(0,$user.user_metadata.name,'----START VOTING----')
        }
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
    <h1>{clashData.topic}</h1>
    <button
        type="button"
        class="btn btn-outline-secondary mt-3 btn-lg"
        on:click={copyLink}>Copy Link!</button
    >

    <button   
    type="button"
    class="btn mt-3 btn-lg btn-secondary"
    on:click="{startGame}">
        Start
    </button>
    <input
        type="text"
        class="not-shown"
        bind:this={copyInput}
        value={`${location.origin}/#/submit/${clashData.id}`}
    />
    <div class="card border-primary mb-3 mt-5" style="">
        <div class="card-body">
            <h4 class="card-title">
                Submissions ({submissions.length}/{clashData.video_count})
            </h4>
            <p class="card-text">below you can see all the submissions</p>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" />

                        <th scope="col" />
                        <th scope="col">Title</th>
                        <th scope="col">Submitted By</th>
                        <th scope="col" />
                    </tr>
                </thead>
                <tbody>
                    {#each submissions as submission, i}
                        <tr>
                            {#await getVideoData(submission.youtubeId)}
                                <div class="progress">
                                    <div
                                        class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width: 100%;"
                                    />
                                </div>
                            {:then videoDescription}
                                <td>{i + 1}</td>
                                <td>
                                    <a
                                        href="https://www.youtube.com/watch?v={videoDescription.id}"
                                        target="_blank"
                                    >
                                        <img
                                            src={videoDescription.snippet
                                                .thumbnails.default.url}
                                            alt={videoDescription.snippet.title}
                                        />
                                    </a>
                                </td>
                                <td>{videoDescription.snippet.title}</td>
                                <td>
                                    {submission.name}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        on:click={() =>
                                            deleteSubmission(submission)}
                                        >Remove</button
                                    >
                                </td>
                            {/await}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{/if}

<style>
    .not-shown {
        position: absolute;
        top: -10000px;
        left: -10000px;
        z-index: -1;
    }
</style>
