<script>
    import { user } from '../store'
</script>

{#if $user}
    <div>
        <a href="/#/create">
            <button type="button" class="btn btn-secondary btn-lg"
                >Create a Clash</button
            >
        </a>
    </div>
{:else}
    You need to log in to create a clash!
{/if}
