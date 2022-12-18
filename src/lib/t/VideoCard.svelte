<script>

    export let video_data = {};
    
    function handleDragStart(e){
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
on:dragstart={handleDragStart}
on:dragend={handleDragEnd}
on:touchstart={handleTouchStart}
on:touchmove={handleTouchMove}
on:touchend={handleTouchEnd}
style="cursor: move;"
>
    <h3 class="card-header">{video_data.video_title}</h3>
    <div class="card-body">
        <div style="width: 200px; height:80px;" class="border border-danger p-1">
            the video thumbnail goes here
        </div>
        <h6 class="card-subtitle text-muted">{video_data.submitter_name}</h6>
    </div>
</div>