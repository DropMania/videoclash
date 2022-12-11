<script>
    import supabase from "../../supabase.js";
    import { user } from "../../store.js";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";

    let moderatorStates = {
        DISABLED:0,
        ACTIVE:1
    },
    moderatorStateTexts = [
        'Disabled',
        'Active'
    ]



    let error="",
        errorText="",
        moderators = [];


    async function loadModerators() {
        let { data, error } = await supabase
            .from('moderator_to_streamer')
            .select('*')
        if (error) {
            errorText = 'Something went wrong! '
        } else {
            console.log(data);
            moderators = data
        }
    }

    function copyModeratorLinkToClipBoard(){
        /* todo
            check if an invite link already exists
            YES -> delete old invite link

            create new invite link
        */
    }

    function updateModeratorStatus(modData, statusCode){
        /* update moderator status active/disabled */


        /* reload moderator list */
    }


    onMount(()=>{

        if(!$user){
            console.log('in not loggedin');
            push('/')
        }

        loadModerators()
    });

</script>

    <h4>Manage your Moderators here</h4>
    <div class="d-flex">
        <h3>To add moderators send the invite linkt after pressing on this button ==></h3>
        <button class="btn btn-primary"
            on:click={copyModeratorLinkToClipBoard}>
            Add Moderator
        </button>
    </div>
    <div class="card border-primary mb-3 mt-1 overflow-auto"
        style="height: 80vmin; width: 80vmin;">

        <table class="table table-hover  mt-3">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Profile-Pic</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {#each moderators as mod, i}
                    <tr>
                        <td>{i+1}</td>
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
                        <td>{mod.moderator_id}</td>
                        <td>
                            <h4>
                                <span class="badge rounded-pill text-black {mod.active ? 'bg-success' : 'bg-danger'  } "> {mod.active ? 'Activ' : 'Disabled'  }  </span>
                            </h4>
                        </td>
                        <td>
                            {#if mod.active}
                                <button
                                    type="button"
                                    class="btn btn-danger w-100"
                                    on:click={()=>{updateModeratorStatus(mod, moderatorStates.DISABLED )}}
                                >
                                    Disable
                                </button>
                            {:else}
                                <button
                                    type="button"
                                    class="btn btn-warning w-100"
                                    on:click={()=>{updateModeratorStatus(mod, moderatorStates.ACTIVE )}}
                                >
                                    Reactivate
                                </button>

                            {/if}
                        </td>
                    </tr>
                {/each}


            </tbody>
        </table>

    </div>
