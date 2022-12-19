<script>

    import VideoCard from "../../lib/t/VideoCard.svelte";
    import DropArea from "../../lib/t/DropArea.svelte";
    import { shortid } from "../../utils.js";
    export let params = {}

    let Ranks = [
        {
            name:'S',
            items:[],
            type:'ranking',
            id:'2ji4ntin'
        },
        {
            name:'A',
            items:[],
            type:'ranking',
            id:'90423jmji23iu'
        },
        {
            name:'B',
            items:[],
            type:'ranking',
            id:'0i35iir350kjj5'
        },
        {
            name:'C',
            items:[],
            type:'ranking',
            id:'9i746564z'
        },
        {
            name:'D',
            items:[],
            type:'ranking',
            id:'9i5uh654tk'
        },
        {
            name:'E',
            items:[],
            type:'ranking',
            id:'k842w5uz7'
        },
        {
            name:'F',
            items:[],
            type:'ranking',
            id:'7kj43426j2'
        },
        {
            name:'sehr sehr schlecht',
            items:[],
            type:'ranking',
            id:'j6534j653koi76'
        },
        {
            name:'',
            items:[
                {id:shortid()  ,video_title:'Ken Ashcorp - Touch Fluffy Tailwjihb fhwgbfhwbefh wehfhewbfghub wihbfghweb',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
                {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam igfbnwe wziufbe wfezb uh', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
                {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
                {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
                {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
                {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'},
                {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam', img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'}
            ],
            type:'openvideos',
            id:'erh45hj5u436255'
        }
    ];




</script>

<h2>The Tier-List topic - {params.id}</h2>
<div class="card border-primary mb-3 mt-1 overflow-hidden w-100 h-100 d-flex">

    <div class="list-group">
        {#each Ranks as rank}
            <DropArea rank_data={rank} bind:RanksObject={Ranks} ></DropArea>
        {/each}
    </div>
</div>

<button
    on:click={()=>{

        // Ranks[7].name = 'hahahaha'

        Ranks[8].items = [...Ranks[8].items, {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:'MrBartagam'+shortid(), img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'}]
        
        console.log(Ranks);
        
    }}
>test</button>

<style>


</style>