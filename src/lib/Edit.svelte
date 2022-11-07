<script>
    import supabase from '../supabase'
    import { onMount } from 'svelte'
    export let open = false
    export let showBackdrop = true
    export let clashData
    export let loadClash
    let loading = false
    let formData = {}
    onMount(() => {
        formData = {
            ...clashData,
            video_count: String(clashData.video_count),
            video_per_person: String(clashData.video_per_person)
        }
    })
    const modalClose = () => {
        open = false
    }
    async function updateClash() {
        loading = true
        let { error, data } = await supabase
            .from('Clash')
            .update(formData)
            .eq('id', clashData.id)
        if (!error) {
            loadClash()
            open = false
        } else {
            alert(error.message)
        }

        loading = false
    }
</script>

{#if open}
    <div
        class="modal"
        id="sampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="sampleModalLabel"
        aria-hidden={false}
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="sampleModalLabel">
                        Update Clash
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        on:click={modalClose}
                    >
                        <span aria-hidden="true" />
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group mt-3">
                            <label for="topic" class="form-label mt-4"
                                >Topic
                                <input
                                    type="text"
                                    class="form-control"
                                    id="topic"
                                    bind:value={formData.topic}
                                />
                            </label>
                        </div>
                        <div class="form-group mt-3">
                            <div class="form-check form-switch">
                                <input bind:checked={formData.allow_chat_submit} class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                                <label class="form-check-label" for="flexSwitchCheckDefault" >Allow Chat Submissions</label>
                              </div>
                        </div>
                        <div class="form-group mt-3">
                            <label for="video_count" class="form-label mt-4"
                                >Video Count</label
                            >
                            <select
                                class="form-select"
                                id="video_count"
                                bind:value={formData.video_count}
                            >
                                <option>4</option>
                                <option>8</option>
                                <option>16</option>
                                <option>32</option>
                                <option>64</option>
                            </select>
                        </div>
                        <div class="form-group mt-3">
                            <label for="vote_time" class="form-label mt-4"
                                >Voting Time</label
                            >
                            <input
                                type="range"
                                class="form-range"
                                id="vote_time"
                                min="20"
                                max="60"
                                bind:value={formData.vote_time}
                            />
                            <small class="form-text"
                                >{formData.vote_time}s</small
                            >
                        </div>
                        <div class="form-group mt-3">
                            <label
                                for="video_per_person"
                                class="form-label mt-4">Videos per User</label
                            >
                            <select
                                class="form-select"
                                id="video_per_person"
                                bind:value={formData.video_per_person}
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option value="999">Infinite</option>
                            </select>
                        </div>
                        <div class="form-group mt-3">
                            <label for="videolen" class="form-label mt-4"
                                >Max. Video length (min)</label
                            >
                            <input
                                type="number"
                                class="form-control"
                                id="videolen"
                                bind:value={formData.max_video_length}
                            />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal"
                        on:click={modalClose}>Close</button
                    >
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click|preventDefault={updateClash}
                        >Update Clash {#if loading}
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            />
                        {/if}</button
                    >
                </div>
            </div>
        </div>
    </div>
    {#if showBackdrop}
        <div class="modal-backdrop show" />
    {/if}
{/if}

<style>
    .modal {
        display: block;
    }
</style>
