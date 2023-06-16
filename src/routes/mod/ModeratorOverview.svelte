<script>
    import supabase from "../../supabase.js";
    import { user } from "../../store.js";
    import { confirmDialog, alertDialog } from "../../utils.js";
    import { onMount } from "svelte";
    import { modStateTexts, modStates } from "../../enums/moderator.js";

    let bLoadingModerators=true,
        moderators = [];

    onMount(()=>{
        if(!$user){

        }else{
            loadModerators();
        }
    });

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
</script>

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