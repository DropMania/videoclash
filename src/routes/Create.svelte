<script>
    import supabase from '../supabase'
    import { user } from '../store'
    import { shortid } from '../utils'
    import { push } from 'svelte-spa-router'
    let formData = {
        video_count: '8',
        video_per_person: '1',
        max_video_length: 5,
        topic: ''
    }
    let errorText = ''
    let loading = false
    async function createClash() {
        loading = true
        const { data, error } = await supabase.from('Clash').insert({
            id: shortid(),
            created_by: $user.id,
            ...formData
        })
        if (error) {
            errorText = error.message
        } else {
            push(`/clash/${data[0].id}`)
        }
        loading = false
    }
</script>

<div class="d-flex flex-column justify-content-center align-items-center">
    <h1>Create a Clash</h1>
    {#if errorText}
        <div class="alert alert-dismissible alert-danger">
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                on:click={() => (errorText = '')}
            />
            {errorText}
        </div>
    {/if}
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
            <label for="video_count" class="form-label mt-4">Video Count</label>
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
            <label for="video_per_person" class="form-label mt-4"
                >Videos per User</label
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
                <option>999</option>
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
        <button
            type="submit"
            class="btn btn-secondary mt-5 btn-lg"
            on:click|preventDefault={createClash}
        >
            {#if loading}
                <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                />
            {/if}
            Create
        </button>
    </form>
</div>
