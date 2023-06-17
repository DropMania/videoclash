<script>
    import supabase from '../../supabase'
    import { user } from "../../store.js";
    import keys from '../../keys.js';
    import { alertDialog } from '../../utils';
    
    export let bOpen = true;
	export let onOkay = () => {};
	export let onCancel = () => {};
    
    let showBackdrop = true,
        suggestion_text="",
        suggestion_type="general";
	let onChange = () => {};
	
	function _onCancel() {
        onCancel();
		close();
	}
	
	async function _onOkay() {

        const { data, error } = await supabase.from('user_suggestions').insert({
            created_by: $user.id,
            suggestion: suggestion_text,
            type: suggestion_type
        })
        if (error) {
            alertDialog(
                document.getElementById('app'),
                "Error",
                "We are sorry but something when wrong here!"
            )
        } else {

        }

        onOkay();
		close();
	}
 
    function close(){
        bOpen = false
    }
    $: onChange()
 
</script>

{#if bOpen && $user}

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
                    Do you have any suggestions for us?
                </h5>
            </div>
            <div class="modal-body">
                <p>
                    Do you have any ideas for what we should add next? <br/>
                    Have you found any bugs that we are not aware of? <br/>
                    Are there any game modes you would like to see? <br/>
                    Write them down below and send them to us! <br/>
                    Alternatively, you can join our <a href="{keys.discordLink}" target="_blank">Discord</a>  and communicate with us there!
                </p>
                <div class="form-group">
                    <fieldset>
                      <label class="form-label mt-4" for="readOnlyInput">From</label>
                      <input class="form-control" id="readOnlyInput" type="text" placeholder="{$user.user_metadata.nickname}" readonly>
                    </fieldset>
                </div>
                <div class="form-group">
                    <label for="exampleSelect1" class="form-label mt-4">Suggestion type</label>
                    <select class="form-select" aria-label="Default select example" bind:value={suggestion_type}>
                        <option value="general">General</option>
                        <option value="bugfix">BugFix</option>
                        <option value="idea">Idea</option>
                        <option value="gamemode">Gamemode</option>
                        <option value="question">Question</option> 
                    </select>
                </div>
                
                <span>Your suggestion below:</span>
                <div class="input-group">
                    <textarea style="min-height: 150px;" class="form-control" aria-label="With textarea" bind:value={suggestion_text}></textarea>
                </div>
            
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                    on:click={_onCancel}>Close</button
                >
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                    on:click={_onOkay}>Send</button
                >

            </div>
        </div>
    </div>
</div>

    {#if showBackdrop}
        <div class="modal-backdrop show" />
    {/if}

{:else}
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
                Eto? what?
            </h5>
        </div>
        <div class="modal-body">
            We don't know how you got here but we only allow logged in users to make suggestions!
        </div>
    </div>
</div>
</div> 
{/if}

<style>
    .modal {
        display: block;
    }
</style>