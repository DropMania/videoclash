<script>
    import { user } from '../../store'
</script>

{#if $user}
    <div class="d-flex flex-column">
        <h1>Choose a Gamemode!</h1>
        <a href="/#/c/create">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                Tournament</button
            >
        </a>
        <a href="/#/b/create">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                The Best Song</button
            >
        </a>
    </div>
{:else}
    You need to log in to create a clash!
{/if}
