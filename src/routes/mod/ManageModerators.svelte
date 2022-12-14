<script>
    import supabase from "../../supabase.js";
    import { user } from "../../store.js";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { shortid, confirmDialog, alertDialog , date_format } from "../../utils.js";
    import { modStateTexts, modStates } from "../../enums/moderator.js";
    import ClashOverviewListElement from "../../lib/mod/ClashOverviewListElement.svelte";

    export let params = {};

    let errorText="",
        moderators = [],
        invite_tokens = [],
        clashes=[];

    let bLoadingModerators=true,
        bLoadingTokens=true,
        bLoadingClashes=true;


    async function loadModerators() {
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .select(`created_at,moderator_id,active,
                users (
                    avatar_url,name,nickname
                )
            `)
            .eq('streamer_id', $user.id)
            .order('created_at', { ascending: false })
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went wrong loading the moderator list!',
                ()=>{}
            )
        } else {
            moderators = data
        }
        bLoadingModerators=false;
    }
    async function loadInviteTokens() {
        let { data, error } = await supabase
            .from('moderator_invite_tokens')
            .select('*')
            .eq('streamer_id', $user.id)
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
    async function loadClashes() {
        const { data, error } = await supabase.rpc('get_all_moderatable_clashes_for_user')
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went wrong loading the clash list!',
                ()=>{}
            )
        } else {
            clashes = data
        }
        bLoadingClashes=false;
    }

    async function updateModeratorStatus(modData, bStatus=false){
        /* update moderator status active/disabled */
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .update({active:bStatus})
            .eq('streamer_id', $user.id)
            .eq('moderator_id', modData.moderator_id)
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went updating the moderator status!',
                ()=>{}
            )
        } else {
            /* reload moderator list */
            loadModerators()
        }
    }

    async function removeModerator(mod){
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .delete()
            .eq('streamer_id', $user.id)
            .eq('moderator_id', mod.moderator_id);
        if (error) {
            alertDialog(
                document.querySelector('#modal'),
                'Error',
                'Something went wrong while trying to remove a moderator!',
                ()=>{}
            )
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

    onMount(()=>{
        if(!$user){
            push('/')
        }else{
            loadModerators();
            loadClashes()
            loadInviteTokens();
        }
    });

    function openChangeModStatusDialog(mod, status){
        confirmDialog( 
            document.querySelector('#modal'), 
            'Confirm?',
            'Do you really want to change the status of this moderator?', 
            ()=>{}, 
            ()=>{updateModeratorStatus(mod,status)}
        )
    }

    function openRemoveDialog(mod){
        confirmDialog(
            document.querySelector('#modal'), 
            'Confirm?',
            'Do you really want to remove this moderator?', 
            ()=>{}, 
            ()=>{removeModerator(mod)}
        )
    }

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


</script>

<div id="modal"></div>

<div class="d-flex">

    <div class="card border-primary overflow-hidden "
        style="height: 80vmin; width: 120vmin;">

        <div class="d-flex flex-row overflow-hidden">
            <ul class="nav nav-pills flex-column">
                <li class="nav-item">
                  <a class="nav-link {params.option === 'moderators' ? 'active' : ''}" href="#/mod/manage/moderators">Moderators</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link {params.option === 'games' ? 'active' : ''}" href="#/mod/manage/games">Games</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link {params.option === 'invite' ? 'active' : ''}" href="#/mod/manage/invite">Invite-Tokens</a>
                </li>
            </ul>
    
            <div class="tab-content flex-fill overflow-hidden h-100">
                    <!-- moderator-overview -->
                    <div class="tab-pane w-100 h-100 overflow-hidden {params.option === 'moderators' ? 'active show' : ''}" id="moderators">
                        <div class="overflow-auto" >
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
                                <tbody  >
                                    {#if !bLoadingModerators}
                    
                                        {#each moderators as mod, i}
                                            <tr>
                                                <td style="width: 50px;">
                                                    <button
                                                        class="btn btn-danger rounded-circle"
                                                        on:click={()=>{
                                                            openRemoveDialog(mod)
                                                        }}
                                                    >
                                                        <i class="fa fa-times"></i>
                                                    </button>
                                                </td>
                                                <td style="width: 50px;">
                                                    {#if mod.users}
                                                        <img
                                                            style="border-radius: 0.25rem;"
                                                            width="32"
                                                            height="32"
                                                            src={mod.users.avatar_url}
                                                            alt="avatar"
                                                            title={mod.users.nickname}
                                                        />
                                                    {:else}
                                                        <span>IMG-missing</span>
                                                    {/if}
                                                </td>
                                                <td>
                                                    {mod.users.nickname}
                                                </td>
                                                <td style="width: 150px;">
                                                    <h4 >
                                                        <span class="badge rounded-pill text-black {mod.active ? 'bg-success' : 'bg-danger'} w-100 ">
                                                            {mod.active ? modStateTexts[modStates.ACTIVE] : modStateTexts[modStates.DISABLED]}
                                                        </span>
                                                    </h4>
                                                </td>
                                                <td style="width: 100px; overflow:hidden;">
                                                    {#if mod.active}
                                                        <button
                                                            type="button"
                                                            class="btn btn-danger w-100"
                                                            on:click={()=>{
                                                                openChangeModStatusDialog(mod, false)
                                                            }}
                                                        >
                                                            Disable
                                                        </button>
                                                    {:else}
                                                        <button
                                                            type="button"
                                                            class="btn btn-warning w-100"
                                                            on:click={()=>{
                                                                openChangeModStatusDialog(mod, true)
                                                            }}
                                                        >
                                                            Activate
                                                        </button>
                    
                                                    {/if}
                                                </td>
                                            </tr>
                                        {/each}
                                    {/if}
                    
                                </tbody>
                            </table>


                        </div>

                        {#if bLoadingModerators}
                            <div class="w-100 h-100">
                                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                            </div>
                        {/if}
                    </div>
                    
                    <!-- previous games -->
                    <div class="tab-pane w-100  h-100 {params.option === 'games' ? 'active show' : ''}" id="games" >
                        <div class="w-100 h-100 overflow-hidden d-flex flex-column">
                            <div class="d-flex">
                                <button class="btn btn-secondary ml-3"
                                    type="button"
                                    on:click={loadClashes}
                                    title="reload clashes"
                                >
                                    <span class="fa fa-refresh"></span>
                                </button>
                                <div class="text-center w-100">Previous/Running Clashes</div>
                            </div>

                            <div class="overflow-auto">
                             
                                    {#if bLoadingClashes}
                                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    {:else}
                                        <div class="list-group">
                                            {#each clashes as clash, q}
                                                <ClashOverviewListElement clashInfo={clash} />
                                            {/each}
                                        </div>
                                    {/if}
                               
                            </div>
                        </div>
    
                    </div>

                    <!-- invite-token -->
                    <div class="tab-pane w-100 h-100 overflow-hidden d-flex flex-column {params.option === 'invite' ? 'active show' : ''}" id="invite">

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
                        
                    </div>

            </div>
        </div>

    </div>
</div>
