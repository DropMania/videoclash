<script>
    import { user } from "../../store.js";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import HowItWorks from "./HowItWorks.svelte";
    import ModeratorOverview from "./ModeratorOverview.svelte";
    import ManagePreviousGames from "./ManagePreviousGames.svelte";
    import ManageInviteTokens  from "./ManageInviteTokens.svelte";


    export let params = {};

    onMount(()=>{
        if(!$user){
            push('/')
        }
    });

</script>

<div id="modal"></div>

<div class="d-flex">

    <div class="card border-primary overflow-hidden "
        style="height: 80vmin; width: 120vmin;">

        <div class="d-flex flex-column overflow-hidden ">
            <ul class="nav  nav-pills flex-row border-bottom border-1 border-primary ">
                <li class="nav-item border-end border-1 border-primary {params.option === 'howitworks' ? 'active' : ''}">
                  <a class="nav-link {params.option === 'howitworks' ? 'active' : ''}" href="#/mod/manage/howitworks">How it works</a>
                </li>
                <li class="nav-item border-end border-1 border-primary {params.option === 'moderators' ? 'active' : ''}">
                  <a class="nav-link {params.option === 'moderators' ? 'active' : ''}" href="#/mod/manage/moderators">Moderators</a>
                </li>
                <li class="nav-item border-end border-1 border-primary {params.option === 'games' ? 'active' : ''}">
                  <a class="nav-link {params.option === 'games' ? 'active' : ''}" href="#/mod/manage/games">Games</a>
                </li>
                <li class="nav-item border-end border-1 border-primary {params.option === 'invite' ? 'active' : ''}">
                  <a class="nav-link {params.option === 'invite' ? 'active' : ''}" href="#/mod/manage/invite">Invite-Tokens</a>
                </li>
            </ul>
    
            <div class="tab-content flex-fill overflow-hidden h-100">
                    <!-- how it works -->
                    <div class="tab-pane w-100 h-100 overflow-hidden {params.option === 'howitworks' ? 'active show' : ''}" id="howitworks">
                        <HowItWorks />
                    </div>

                    <!-- moderator-overview -->
                    <div class="tab-pane w-100 h-100 overflow-hidden {params.option === 'moderators' ? 'active show' : ''}" id="moderators">
                        <ModeratorOverview />
                    </div>
                    
                    <!-- previous games -->
                    <div class="tab-pane w-100  h-100 {params.option === 'games' ? 'active show' : ''}" id="games" >
                        <ManagePreviousGames />
                    </div>

                    <!-- invite-token -->
                    <div class="tab-pane w-100 h-100 overflow-hidden d-flex flex-column {params.option === 'invite' ? 'active show' : ''}" id="invite">
                        <ManageInviteTokens />
                    </div>

            </div>
        </div>

    </div>
</div>
