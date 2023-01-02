<script>
    import VideoCard from "../../lib/t/VideoCard.svelte";
    export let rank_data = {};
    export let rank_index;
    export let RanksObject;

    let bHovering = false;
    let bClickedToEdit=false;

    function handleDragEnter(e){
        e.preventDefault();
        bHovering = true;
    }
    function handleDragLeave(e){
        e.preventDefault();
        bHovering = false;
    }
    function handleDragDrop(e){
        e.preventDefault();
        bHovering = false
        let drop_data = JSON.parse(e.dataTransfer.getData('application/json'));

        if(drop_data.rank.id === rank_data.id){
            /* disable drop on the same DropArea */
            return;
        }else{
            /* add the new element */
            RanksObject[rank_index].items = [...RanksObject[rank_index].items, drop_data.video_data];
    
            /* remove the old element */
            RanksObject[drop_data.rank_index].items = drop_data.rank.items.filter((element)=>{
                return element.id !== drop_data.video_data.id
            })
        }

    }
</script>

<div class="list-group-item d-flex flex-row align-items-stretch p-0 m-1" style="min-height: 180px;">

        {#if rank_data.type === 'ranking'}
            <div class="card border-success" style="width: 100px; min-width:100px;">
                {#if bClickedToEdit}
                    <textare class="h-100 w-100">
                        {rank_data.name}
                    </textare>
                {:else}
                    <div class="h-100 w-100">
                        {rank_data.name}
                    </div>
                {/if}
            </div>
        {/if}
        <div class="card flex-fill d-flex flex-row flex-wrap overflow-auto p-1 {bHovering && rank_data.type === 'ranking' ? 'border-warning' : '' }"
            on:dragenter={handleDragEnter} 
            on:dragleave={handleDragLeave}  
            on:drop={handleDragDrop} 
            on:dragover={(e)=>{
                e.preventDefault();
                return false
            }}
        >
            {#each rank_data.items as item}
                <VideoCard video_data={item} rank={rank_data} rank_index={rank_index}></VideoCard>
            {/each}

        </div>

</div>