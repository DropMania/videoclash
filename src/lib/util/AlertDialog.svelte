<script>
	export let onOkay = () => {};
    export let title = "Notice me Senpai!";
    export let body = "Please notice this action! POG";
    
    let bOpen = true;
    let showBackdrop = true;
	let onChange = () => {};

	function _onOkay() {
		onOkay();
		close();
	}

    function close(){
        bOpen = false;
    }
    $: onChange()

</script>

{#if bOpen}
    
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
                    {@html title}
                </h5>
            </div>
            <div class="modal-body">
                <slot name="confirmBody">
                    {@html body}
                </slot>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                    on:click={_onOkay}>Okay</button
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