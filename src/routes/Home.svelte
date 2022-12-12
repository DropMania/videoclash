<script>
    import Sidebar from '../lib/util/Sidebar.svelte';
    import { user } from '../store'
    
    export let sidebar_show;
</script>

{#if $user}
    <div class="d-flex flex-column">
        <!-- <button on:click={()=>{ sidebar_show = !sidebar_show }} class="btn btn-secondary" >Sidebar</button> -->
        <h1>Choose a Gamemode!</h1>
        <a href="/#/c/create">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                Tournament</button
            >
        </a>
        <a href="/#/b/create">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                The Best Video</button
            >
        </a>
    </div>
    <!-- <Sidebar bind:show={sidebar_show} /> -->
{:else}
    You need to log in to create a clash!
{/if}
