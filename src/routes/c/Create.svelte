<script>
    import supabase from '../../supabase'
    import { user } from '../../store'
    import { shortid } from '../../utils'
    import { push } from 'svelte-spa-router'
    import ClashForm from '../../lib/c/ClashForm.svelte'
    let formData = {
        video_count: '8',
        video_per_person: '1',
        max_video_length: 5,
        topic: '',
        vote_time: 45,
        allow_chat_submit: true,
        enable_reward_submission: false,
        reward_cost: 500
    }
    let errorText = ''
    let loading = false
    async function createClash() {
        loading = true
        const { data, error } = await supabase.from('Clash').insert({
            id: shortid(),
            mod_secret_token: shortid(),
            created_by: $user.id,
            ...formData
        })
        if (error) {
            errorText = error.message
        } else {
            push(`/c/clash/${data[0].id}`)
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
        <ClashForm bind:formData />
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
