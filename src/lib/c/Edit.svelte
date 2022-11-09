<script>
    import supabase from '../../supabase'
    import { onMount } from 'svelte'
    import ClashForm from './ClashForm.svelte'
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
                        <ClashForm bind:formData />
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
