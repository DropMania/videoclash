<script>

    import VideoCard from "../../lib/t/VideoCard.svelte";
    import DropArea from "../../lib/t/DropArea.svelte";
    export let params = {}

    let Ranks = [
        {
            name:'S',
            items:[]
        },
        {
            name:'A',
            items:[]
        },
        {
            name:'B',
            items:[]
        },
        {
            name:'C',
            items:[]
        },
        {
            name:'D',
            items:[]
        },
        {
            name:'E',
            items:[]
        },
        {
            name:'F',
            items:[]
        },
        {
            name:'sehr sehr schlecht',
            items:[]
        }
    ];

    let Videos = [
        {video_title:'Ken Ashcorp - Touch Fluffy Tailwjihb fhwgbfhwbefh wehfhewbfghub wihbfghweb',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
        {video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam igfbnwe wziufbe wfezb uh', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
        {video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
        {video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
        {video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
        {video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
        {video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'}
    ]


</script>

<h2>The Tier-List topic - {params.id}</h2>
<div class="card border-primary mb-3 mt-1 overflow-hidden w-100 h-100 d-flex">

    <div class="list-group">

        {#each Ranks as rank}
            <DropArea rank_data={rank}></DropArea>
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