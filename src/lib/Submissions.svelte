<script>
    import { createEventDispatcher } from 'svelte'
    export let submissions
    export let clashData
    let copyInput = {}
    const dispatch = createEventDispatcher()

    function copyLink() {
        copyInput.select()
        document.execCommand('copy')
    }
</script>

<button
    type="button"
    class="btn btn-outline-secondary mt-3 btn-lg"
    on:click={copyLink}>Copy Link!</button
>

<button
    type="button"
    class="btn mt-5 btn-lg btn-secondary fs-2"
    disabled={submissions.length !== clashData.video_count}
    on:click={() => dispatch('startGame')}
>
    Start ({submissions.length}/{clashData.video_count})
</button>
<input
    type="text"
    class="not-shown"
    bind:this={copyInput}
    value={`${location.origin}/#/submit/${clashData.id}`}
/>
<div class="card border-primary mb-3 mt-5 overflow-auto">
    <div class="card-body h-100">
        <h4 class="card-title">
            Submissions ({submissions.length}/{clashData.video_count})
        </h4>
        <p class="card-text">below you can see all the submissions</p>
        <table class="table table-hover h-100 mt-3">
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
                        <td>{i + 1}</td>
                        <td>
                            <a
                                href="https://www.youtube.com/watch?v={submission
                                    .videoData.id}"
                                target="_blank"
                            >
                                <img
                                    src={submission.videoData.snippet.thumbnails
                                        .default.url}
                                    alt={submission.videoData.snippet.title}
                                />
                            </a>
                        </td>
                        <td>{submission.videoData.snippet.title}</td>
                        <td>
                            {submission.name}
                        </td>
                        <td>
                            <button
                                type="button"
                                class="btn btn-danger"
                                on:click={() =>
                                    dispatch('deleteSubmission', submission)}
                            >
                                Remove</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .not-shown {
        position: absolute;
        top: -10000px;
        left: -10000px;
        z-index: -1;
    }
</style>
