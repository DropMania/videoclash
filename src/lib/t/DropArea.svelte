<script>
    export let dropRankText = "";

    let bHovering = false;
    function handleDragEnter(e){
        e.preventDefault();
        bHovering = true
        console.log('dragEnter',dropRankText);
    }
    function handleDragLeave(e){
        e.preventDefault();
        bHovering = false
        console.log('dragLeave',dropRankText);
    }
    function handleDragDrop(e){
        e.preventDefault();
        console.log('dragDrop',dropRankText);
    }
</script>

<div class="list-group-item d-flex flex-row p-0 m-1 " style="height: 150px;">
    <div class="rank_area card border-success h-100 align-middle " style="width: 100px;">
        <span class="h-100 w-100 align-middle fw-bold">
            {dropRankText}
        </span>
    </div>
    <div class="drop_area card flex-fill h-100 d-flex flex-row flex-wrap {bHovering? 'border-warning' : '' }"
    on:dragenter={handleDragEnter} 
	on:dragleave={handleDragLeave}  
	on:drop={handleDragDrop} 
	on:dragover={()=>{return false}}
    >

    </div>
<!--     <div>
        <i class="fa fa-cogs"></i>
    </div> -->
</div>


<style>

</style>