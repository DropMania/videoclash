<script>
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
            items:[],
            type:'openvideos',
            id:'erh45hj5u436255'
        }
    ];



    for(let i = 0; i< 10; i++){
        Ranks[Ranks.length-1].items = [...Ranks[Ranks.length-1].items, {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:shortid(), img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'}]
    }


</script>

<h2>The Tier-List topic - {params.id}</h2>
<div class="card border-primary mb-3 mt-1 overflow-hidden w-100 h-100 d-flex">

    <div class="list-group">
        {#each Ranks as rank, rank_index}
            <DropArea rank_data={rank} bind:RanksObject={Ranks} rank_index={rank_index} ></DropArea>
        {/each}
    </div>
</div>

<button
    on:click={()=>{

        Ranks[8].items = [...Ranks[8].items, {id:shortid(),video_title:'Ken Ashcorp - Touch Fluffy Tail',submitter_name:shortid(), img:'https://i.ytimg.com/vi/4nyHPIcbn88/default.jpg'}]
        
        console.log(Ranks);
        
    }}
>test</button>

<style>


</style>