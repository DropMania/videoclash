<script>
    import { fly } from 'svelte/transition';
    
    export let show = false;
</script>
            

{#if show}
  <nav transition:fly={{x: 250, opacity: 1}} class="bg-secondary d-flex flex-column">
    <button on:click={() => { show = false;}} class="bg-primary">About</button>
  </nav>
{/if}

<style>

    nav {
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        padding: 2rem 1rem 0.6rem;

        overflow-y: auto;
        width: 30rem;
    }
</style>