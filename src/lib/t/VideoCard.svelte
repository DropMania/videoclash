<script>

    export let video_data = {};
    
    function handleDragStart(e,item){

        e.dataTransfer.setData('application/json', item);
        console.log('dragStart',video_data.video_title);
    }    
    function handleDragEnd(e){
        console.log('dragEnd',video_data.video_title);

    }    
    function handleTouchStart(e){
        console.log('toucestart',video_data.video_title);

    }    
    function handleTouchMove(e){
        console.log('touchmove',video_data.video_title);

    }    
    function handleTouchEnd(e){
        console.log('touceEnd',video_data.video_title);

    }    
</script>

<div class="card border border-secondary m-1 user-select-none" 
    draggable=true 
    on:dragstart={(e)=>{ handleDragStart(e,video_data) }}
    on:dragend={handleDragEnd}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    style="cursor: move; width:250px"
>
    <!-- <h5 class="card-header">{video_data.video_title}</h5> -->
    <div class="card-body d-flex flex-column">
        <div class="w-100 text-truncate">
            {video_data.video_title}
        </div>
        <div class="d-flex">
            <img
                class="small"
                src={video_data.img}
                alt={video_data.video_title}
                style="pointer-events: none;"
            />
            <div class="m-1">
                <span class="btn btn-secondary fa fa-expand"></span>
            </div>
        </div>
        <div class="d-flex ">
            <span class="card-subtitle text-muted text-truncate flex-grow-1"
                title={video_data.submitter_name}
            >
                {video_data.submitter_name}
            </span>
            
            <span class="badge rounded-pill bg-success">Approved</span>
     
        </div>
    </div>
</div>

<style>
    .small{
        /* height: 50%; */
        width: 50%;
    }

</style>