<script>
    import VideoCard from "../../lib/t/VideoCard.svelte";
    export let rank_data = {};
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

        /* disable drop on the same DropArea */
        if(drop_data.rank.id === rank_data.id)return;

        /* add the new element */
        for(let i = 0; i < RanksObject.length; i++){
            if(RanksObject[i].id === rank_data.id){
                RanksObject[i].items = [...RanksObject[i].items, drop_data.video_data];
                break;
            }              
        }

        /* remove the old element */
        for(let x = 0; x < RanksObject.length; x++){
            if(RanksObject[x].id === drop_data.rank.id){
                RanksObject[x].items = drop_data.rank.items.filter((element)=>{
                    return element.id !== drop_data.video_data.id
                })
                break;
            }              
        }
    }
</script>

<div class="list-group-item d-flex flex-row align-items-stretch p-0 m-1 " style="min-height: 180px;">

        {#if rank_data.type === 'ranking'}
            <div class="card border-success" style="width: 100px; min-width:100px;">
                {rank_data.name}
            </div>
        {/if}
        <div class="card flex-fill d-flex flex-row flex-wrap overflow-auto   {bHovering? 'border-warning' : '' }"
            on:dragenter={handleDragEnter} 
            on:dragleave={handleDragLeave}  
            on:drop={handleDragDrop} 
            on:dragover={(e)=>{
                e.preventDefault();
                return false
            }}
        >
            {#each rank_data.items as item}
                <VideoCard video_data={item} rank={rank_data}></VideoCard>
            {/each}

        </div>

</div>


<style>

</style>