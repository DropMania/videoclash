<script>
    import VideoCard from "../../lib/t/VideoCard.svelte";
    export let rank_data = {};

    let bHovering = false;
    function handleDragEnter(e){
        e.preventDefault();
        bHovering = true
        // console.log('dragEnter',rank_data.name);
    }
    function handleDragLeave(e){
        e.preventDefault();
        bHovering = false
        // console.log('dragLeave',rank_data.name);
    }
    function handleDragDrop(e){
        e.preventDefault();
        console.log('dragDrop',rank_data.name);
        console.log(e);
    }
</script>

<div class="list-group-item d-flex flex-row p-0 m-1 " style="height: 200px;">
    <div class="rank_area card border-success h-100 align-middle " style="width: 100px;">
        <span class="h-100 w-100 align-middle fw-bold">
            {rank_data.name}
        </span>
    </div>
    <div class="drop_area card flex-fill h-100 d-flex flex-row flex-wrap {bHovering? 'border-warning' : '' }"
        on:dragenter={handleDragEnter} 
        on:dragleave={handleDragLeave}  
        on:drop={handleDragDrop} 
        on:dragover={(e)=>{
            e.preventDefault();
            return false
        }}
    >
        {#each rank_data.items as item}
            <VideoCard video_data={item}></VideoCard>
        {/each}

    </div>
</div>


<style>

</style>