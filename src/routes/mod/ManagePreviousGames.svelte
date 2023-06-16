<script>
    import supabase from "../../supabase.js";
    import { user } from "../../store.js";
    import { onMount } from "svelte";
    import {alertDialog } from "../../utils.js";
    import ClashOverviewListElement from "../../lib/mod/ClashOverviewListElement.svelte";
    
    let clashes=[],
        nDefaultGameLimitAddition=5,
        nGamesOffset=0,
        nGameLimit=5,
        bLoadingClashes=true;

    onMount(()=>{
        if(!$user){
        }else{
            loadClashes()
        }
    });

    async function loadClashes() {
            const { data, error } = await supabase.rpc('get_all_moderatable_clashes_for_user',{
                i_start:nGamesOffset,
                i_limit:nGameLimit
            })
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

    async function loadMoreClashes(){

        nGameLimit = nGameLimit + nDefaultGameLimitAddition;
        const { data, error } = await supabase.rpc('get_all_moderatable_clashes_for_user',{
            i_start:nGamesOffset,
            i_limit:nGameLimit
        })
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

</script>

<div class="w-100 h-100 overflow-hidden d-flex flex-column">
    <div class="d-flex">
        <!-- <button class="btn btn-secondary ml-3"
            type="button"
            on:click={loadClashes}
            title="reload clashes"
        >
            <span class="fa fa-refresh"></span>
        </button> -->
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
                    <button
                        type="button"
                        class="btn btn-primary"
                        title="load more"
                        on:click={()=>{ loadMoreClashes() }}
                    >
                        <i class="fa fa-plus-circle"></i>
                    </button>
                </div>
            {/if}
       
    </div>
</div>