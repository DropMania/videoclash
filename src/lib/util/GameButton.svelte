<script>
    export let gm = {
        name:'',
        path:'',
        icon:'',
        iconType:'',
        disable:false
    };
</script>


<a href="{gm.path}" class="btn btn-secondary m-1 " style="height: 150px; width: 250px;">
    {#if gm.iconType == 'fontawesome'}
        <div class="{gm.icon}  fa-5x"></div>
    {:else}
        <div style="height: 80px;widht:80px; overflow:hidden">
            <img
                style="width: 80px; height:80px;"
                src="{gm.icon}"
                alt="gamemode icon"
            >
        </div>
    {/if}
    <h5>{gm.name}</h5>
</a>