<script>
    import supabase from "../../supabase.js";
    import { user } from "../../store.js";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { shortid, confirmDialog, alertDialog , date_format } from "../../utils.js";

    let invite_tokens = [],
        bLoadingTokens=true;

    onMount(()=>{
        if(!$user){
            push('/')
        }else{
            loadInviteTokens();
        }
    });

    function openRemoveInviteTokenDialog(sToken){
        confirmDialog(
            document.querySelector('#modal'), 
            'Confirm?',
            'Do you really want to remove this invite-token?', 
            ()=>{}, 
            ()=>{deleteInviteToken(sToken)}
        )
    }

    function openCopyInviteTokenAlert(token, token_status, expire_date){
        if(token !== "" && token_status && isDateInFuture(expire_date) ){
            let url = `${location.origin}/#/mod/invite/${token}`;

            alertDialog(
                document.querySelector('#modal'), 
                'Copied!',
                'Invite-link copied to clipboard. \n <b>Only</b> share this link with moderators you want to invite. \n The invite-token is valid for 24h', 
                ()=>{
                    navigator.clipboard.writeText(url);
                }
            )
        }else{
            alertDialog(
                document.querySelector('#modal'), 
                'Invite-Token invalid',
                'Cannot copy invite-link to clipboard. \nThis invite-token is either disabled or expired', 
                ()=>{}
            )
        }
    }

    async function loadInviteTokens() {
        let { data, error } = await supabase
            .from('moderator_invite_tokens')
            .select('*')
            .eq('streamer_id', $user.id)
            .eq('active', 'true')
            .gte('expire_date', new Date().toISOString() )
            .order('created_at', { ascending: false })
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went wrong loading the invite-token list!',
                ()=>{}
            )
        } else {
            invite_tokens = data
        }
        bLoadingTokens = false;
    }

    async function generateNewInviteToken(){
        let { data, error } = await supabase
            .from('moderator_invite_tokens')
            .insert({
                streamer_id: $user.id,
                token: shortid(20)
            })
            .select('*')
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went wrong creating a new invite-token!',
                ()=>{}
            )
        } else {
            loadInviteTokens();
        }
    }

    async function deleteInviteToken(sToken){
        let { data, error } = await supabase
            .from('moderator_invite_tokens')
            .delete()
            .eq('token',sToken)
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went wrong deleting the invite-token!',
                ()=>{}
            )
        } else {
            loadInviteTokens();
        }
    }

    function isDateInFuture(sDate=""){
        return new Date(sDate) > new Date();
    }
</script>

Invite Tokens:
<div>
    <button
        type="button"
        class="btn btn-success text-black rounded"
        on:click={generateNewInviteToken}
    >new Token</button>
</div>
<div class="overflow-auto">
    <table class="table table-hover  mt-3">
        <thead>
            <tr>
                <th scope="col">Actions</th>
                <!-- <th scope="col">Token</th> -->
                <th scope="col">Expire date</th>
            </tr>
        </thead>
        <tbody>
            {#if !bLoadingTokens}
                {#each invite_tokens as token}
                    <tr class={token.active && isDateInFuture(token.expire_date) ? 'bg-success' : 'bg-secondary'}>
                        <td>
                            <div class="d-flex">
                                <button class="btn rounded-circle text-white border border-white"
                                    on:click={()=>{
                                        openRemoveInviteTokenDialog(token.token)
                                    }}
                                >
                                    <span class="fa fa-times"></span>
                                </button>
                                <button class="btn rounded-circle ml-3 text-white border border-white "
                                    on:click={()=>{
                                        openCopyInviteTokenAlert(token.token, token.active, token.expire_date) 
                                    }}
                                >
                                    <span class="fa fa-clipboard"></span>
                                </button>
                            </div>
                        </td>

                        <td>
                            {date_format(token.expire_date)}
                        </td>
                        
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>

{#if bLoadingTokens}
    <div class="w-100 ">
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    </div>
{/if}
