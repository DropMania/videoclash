<script>
    import supabase from "../../supabase.js";
    import { user } from "../../store.js";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { copyLinkToClipboard, shortid } from "../../utils.js";
    import { modStateTexts, modStates } from "../../enums/moderator.js";




    let error="",
        errorText="",
        moderators = [],
        invite_tokens = [],
        clashes=[];


    async function loadModerators() {
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .select('*')
            .eq('streamer_id', $user.id)
        if (error) {
            errorText = 'Something went wrong! '
        } else {
            moderators = data
        }
    }
    async function loadInviteTokens() {
        let { data, error } = await supabase
            .from('moderator_invite_tokens')
            .select('*')
            .eq('streamer_id', $user.id)
            .order('created_at', { ascending: false })
        if (error) {
            errorText = 'Something went wrong! '
        } else {
            invite_tokens = data
        }
    }
    async function loadClashes() {
        /* let { data, error } = await supabase
            .from('Clash')
            .select('*')
            .eq('created_by', $user.id)
            .order('created_at', { ascending: false }) */

        const { data, error } = await supabase.rpc('get_all_moderatable_clashes_for_user')

        if (error) {
            console.log('Cannt load Clashes');
        } else {
            clashes = data
        }
    }

    function copyModeratorLinkToClipBoard(token,token_status,expire_date){
        let alertText = "Invite-link copied to clipboard. \nOnly share this link only with moderators you want to invite";
        if(token !== "" && token_status && isDateInFuture(expire_date) ){
            let url = `${location.origin}/#/mod/invite/${token}`;
                copyLinkToClipboard(url,alertText)
        }else{
            alert("Cannot copy invite-link to clipboard")
        }
    }

    async function updateModeratorStatus(modData, bStatus=false){
        /* update moderator status active/disabled */
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .update({active:bStatus})
            .eq('streamer_id', $user.id)
            .eq('moderator_id', modData.moderator_id)
        if (error) {
            errorText = 'Something went wrong! '
        } else {
            /* reload moderator list */
            loadModerators()
        }
    }

    async function removeModerator(mod){
        console.log(mod);
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .delete()
            .eq('streamer_id', $user.id)
            .eq('moderator_id', mod.moderator_id);
        if (error) {
            errorText = 'Something went wrong! '
        } else {
            /* reload moderator list */
            loadModerators()
        }
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
            errorText = 'Token could not be generated'
        } else {
            console.log(data);
            loadInviteTokens();
        }
    }

    async function deleteInviteToken(sToken){
        let { data, error } = await supabase
            .from('moderator_invite_tokens')
            .delete()
            .eq('token',sToken)
        if (error) {
            errorText = 'Token could not be deleted'
        } else {
            loadInviteTokens();
        }
    }


    function date_format(sDate="",scope="full"){
        switch (scope) {
            case 'full':
                return new Date(sDate).toLocaleString();
                break;
            case 'date':
                return new Date(sDate).toLocaleDateString();
                break;
            case 'time':
                return new Date(sDate).toLocaleTimeString();
                break;
        
            default:
                break;
        }
        
    }

    function isDateInFuture(sDate=""){
        return new Date(sDate) > new Date();
    }


    onMount(()=>{

        if(!$user){
            console.log('in not loggedin');
            push('/')
        }

        loadModerators();
        loadClashes()
        loadInviteTokens();
    });

</script>

    <h4>Manage your Moderators here</h4>
    {#if errorText !== ""}
        {errorText}
    {/if}
<div class="d-flex">
    <div class="card border-primary mb-3 mt-1 overflow-hidden"
        style="height: 80vmin; width: 40vmin;">
        <div class="d-flex p-1">
            <button class="btn btn-secondary ml-3"
                type="button"
                on:click={loadClashes}
            >
                <span class="fa fa-refresh"></span>
            </button>
            <div class="text-center  w-100">Previous/Running Clashes</div>
        </div>
        <div class="overflow-auto h-100">

            <table class="table table-hover  mt-3">
                <thead>
                    <tr>
                        <th scope="col">Creator</th>
                        <th scope="col">Topic</th>
                        <th scope="col">Created on</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
    
                    {#each clashes as clash, q}
                        <tr>
                            <td>
                                <img
                                    style="border-radius: 0.25rem;"
                                    width="32"
                                    height="32"
                                    src={clash.avatar_url}
                                    alt={clash.nickname}
                                    title={clash.nickname}
                                />
                            </td>
                            <td>
                                <div class="text-truncate">
                                    {clash.topic}
                                </div>
                            </td>
                            <td>
                                {date_format(clash.created_at,'date')}
                            </td>
                            <td>
                                <div>
                                    <button class="btn btn-secondary"
                                    style="width: 36px;height:36px"
                                        on:click={()=>{ window.open(`${location.origin}/#/c/clash/${clash.id}`,'_blank' ) }}
                                    >
                                        C
                                    </button>
                                    <button class="btn btn-primary" 
                                        style="width: 36px;height:36px"
                                        on:click={()=>{ window.open(`${location.origin}/#/mod/clash/${clash.id}`,'_blank' ) }}
                                    >
                                        M
                                    </button>
                                </div>
                            </td>
                            
                        </tr>
                    {/each}
                </tbody>
    
            </table>
        </div>
    </div>

    <div class="card border-primary mb-3 mt-1 overflow-auto"
        style="height: 80vmin; width: 80vmin;">

        <table class="table table-hover  mt-3">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {#each moderators as mod, i}
                    <tr>
                        <td>
                            <div>
                                <button
                                    class="btn btn-danger rounded-circle"
                                    on:click={()=>{removeModerator(mod)}}
                                >
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </td>
                        <td>
                            {#if mod.profile_data}
                                <img
                                    style="border-radius: 0.25rem;"
                                    width="32"
                                    height="32"
                                    src={mod.profile_data.picture}
                                    alt="avatar"
                                />
                            {:else}
                                <span>IMG-missing</span>
                            {/if}
                        </td>
                        <td>
                            {mod.profile_data.nickname}
                        </td>
                        <td>
                            <h4>
                                <span class="badge rounded-pill text-black {mod.active ? 'bg-success' : 'bg-danger'} ">
                                    {mod.active ? modStateTexts[modStates.ACTIVE] : modStateTexts[modStates.DISABLED]}
                                </span>
                            </h4>
                        </td>
                        <td>
                            {#if mod.active}
                                <button
                                    type="button"
                                    class="btn btn-danger w-100"
                                    on:click={()=>{updateModeratorStatus(mod, false )}}
                                >
                                    Disable
                                </button>
                            {:else}
                                <button
                                    type="button"
                                    class="btn btn-warning w-100"
                                    on:click={()=>{updateModeratorStatus(mod, true )}}
                                >
                                    Activate
                                </button>

                            {/if}
                        </td>
                    </tr>
                {/each}


            </tbody>
        </table>

    </div>
    <div class="card border-primary mb-3 mt-1 overflow-auto"
    style="height: 80vmin; width: 30vmin;">
        Invite Tokens:
        <div>
            <button
                type="button"
                class="btn btn-success text-black rounded"
                on:click={generateNewInviteToken}
            >new Token</button>
        </div>
        <table class="table table-hover  mt-3">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Token</th>
                    <th scope="col">Expire date</th>
                </tr>
            </thead>
            <tbody>
                {#each invite_tokens as token}
                    <tr class={token.active && isDateInFuture(token.expire_date) ? 'bg-primary' : 'bg-secondary'}>
                        <td>
                            <div class="d-flex">
                                <button class="btn rounded-circle text-white border border-white"
                                    on:click={()=>{deleteInviteToken(token.token)}}
                                >
                                    <span class="fa fa-times"></span>
                                </button>
                                <button class="btn rounded-circle ml-3 text-white border border-white "
                                    on:click={()=>{copyModeratorLinkToClipBoard(token.token, token.active, token.expire_date) }}
                                >
                                    <span class="fa fa-clipboard"></span>
                                </button>
                            </div>
                        </td>
                        <td>*****</td>
                        <td>
                            {date_format(token.expire_date)}
                        </td>
                        
                    </tr>
                {/each}
                
            </tbody>
        </table>
    </div>
</div>
