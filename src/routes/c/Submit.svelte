<script>
    import supabase from '../../supabase'
    import { onMount } from 'svelte'
    import { validateLink } from '../../utils'
    export let params = {}
    let clashData = {}
    let errorText = ''
    let invalidVideo = ''
    let loading = true
    let loadingbtn = false
    let formData = {
        name: '',
        link: ''
    }
    let submitted = false
    let videoData = null
    let disableSubmit = true
    let submittedCount = 0
    $: submittedCount >= clashData.video_count && !submitted
        ? (errorText = 'Clash is full!')
        : (errorText = '')
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
                    if (localStorage.getItem(`submitted-${params.id}`)) {
                        if (
                            Number(
                                localStorage.getItem(`submitted-${params.id}`)
                            ) >= clashData.video_per_person
                        ) {
                            submitted = true
                        }
                    }
                }
                loading = false
            })

        loadSubmissionCount()
        supabase
            .from('ClashVideo')
            .on('*', (payload) => {
                loadSubmissionCount()
            })
            .subscribe()
    })
    function loadSubmissionCount() {
        supabase
            .from('ClashVideo')
            .select('*', { count: 'exact' })
            .eq('clash_id', params.id)
            .then(({ data, error }) => {
                if (!error) {
                    submittedCount = data.length
                }
            })
    }
    async function submitVideo() {
        loadingbtn = true
        let { error, data } = await supabase
            .from('ClashVideo')
            .insert({ ...formData, clash_id: clashData.id })
        if (error) {
            errorText = error.message
        } else {
            submitted = true
            let submittedCount = localStorage.getItem(`submitted-${params.id}`)
            localStorage.setItem(
                `submitted-${params.id}`,
                submittedCount ? (Number(submittedCount) + 1).toString() : '1'
            )
        }
        loadingbtn = false
    }
    async function inputLink(event) {
        disableSubmit = true
        let link = event.target.value
        let {
            response,
            valid,
            videoData: vd
        } = await validateLink(link, clashData.max_video_length)
        disableSubmit = !valid
        invalidVideo = response
        videoData = vd
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
        {errorText}
    </div>
{:else}
    <h1>{clashData.topic} ({submittedCount}/{clashData.video_count})</h1>
    {#if !submitted}
        <div class="card border-primary mb-3 mt-5 w-100">
            <div class="card-body">
                <form>
                    <label for="name" class="col-form-label">Your Name:</label>
                    <input
                        type="text"
                        class="form-control"
                        id="name"
                        placeholder="Nickname..."
                        bind:value={formData.name}
                    />
                    <div class="form-group">
                        <label for="link" class="col-form-label"
                            >Share a Youtube-Link (max {clashData.max_video_length}min.):
                        </label>
                        <input
                            type="text"
                            class="form-control {invalidVideo
                                ? 'is-invalid'
                                : ''}"
                            id="link"
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            bind:value={formData.link}
                            on:input={inputLink}
                        />
                        {#if invalidVideo}
                            <div class="invalid-feedback">{invalidVideo}</div>
                        {/if}
                    </div>
                    {#if videoData}
                        <img
                            class="my-4"
                            src={videoData.snippet.thumbnails.medium.url}
                            style="max-width: 300px;"
                            alt="Thumbnail"
                        />
                        <div
                            class=" d-flex justify-content-center align-items-center"
                        >
                            <p>{videoData.snippet.title}</p>
                        </div>
                    {/if}
                    <button
                        class="btn btn-secondary mt-4 "
                        type="submit"
                        disabled={disableSubmit || !formData.name}
                        on:click|preventDefault={submitVideo}
                    >
                        {#if loadingbtn}
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            />
                        {/if}
                        Submit Video!
                    </button>
                </form>
            </div>
        </div>
    {:else}
        <div class="alert alert-dismissible alert-success mt-5">
            Your Video is submitted! You can close this window now.
        </div>
    {/if}
{/if}
