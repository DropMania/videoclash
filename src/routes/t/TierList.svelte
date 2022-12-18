<script>

    import VideoCard from "../../lib/t/VideoCard.svelte";
    import DropArea from "../../lib/t/DropArea.svelte";
    export let params = {}

    let Ranks = ['S','A','B','C','D','E','F','sehr sehr schlecht']
    let Videos = [
        {video_title:'The best video ever',submitter_name:'Chatter123'},
        {video_title:'The best video ever',submitter_name:'Chatter123'},
        {video_title:'The best video ever',submitter_name:'Chatter123'},
        {video_title:'The best video ever',submitter_name:'Chatter123'},
        {video_title:'The best video ever',submitter_name:'Chatter123'},
        {video_title:'The best video ever',submitter_name:'Chatter123'},
        {video_title:'The best video ever',submitter_name:'Chatter123'}
    ]


</script>

<h2>The Tier-List topic - {params.id}</h2>
<div class="card border-primary mb-3 mt-1 overflow-hidden w-100 h-100 d-flex">

    <div class="list-group">

        {#each Ranks as rank}
            <DropArea dropRankText={rank}></DropArea>
        {/each}


        <div class="list-group-item d-flex flex-row mt-5" >
            <div class=" d-flex flex-row flex-wrap" >
                {#each Videos as video}
                    <VideoCard video_data={video}></VideoCard>
                {/each}
            </div>
        </div>
    </div>

</div>

<style>


</style>