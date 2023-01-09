<script>
    import { push } from 'svelte-spa-router'
    import Sidebar from '../lib/util/Sidebar.svelte'
    import { user } from '../store'
    import supabase from '../supabase.js'

    let gameIdSearchValue = '',
        searchIsValid = true

    async function onSearchGameIdBtn() {
        searchForGameId(gameIdSearchValue)
    }
    async function onKeyPressSearchGameId(e) {
        if (e.key !== 'Enter') return
        searchForGameId(gameIdSearchValue)
    }

    async function searchForGameId(game_id) {
        if (await isGameIdExsitsting(game_id)) {
            push(`/c/submit/${game_id}`)
        } else {
            searchIsValid = false
        }
    }

    async function isGameIdExsitsting(game_id) {
        let { data, error } = await supabase
            .from('Clash')
            .select('*')
            .eq('id', game_id)
        if (error) {
            return false
        } else {
            if (data.length > 0) {
                return true
            } else {
                return false
            }
        }
    }
</script>

{#if $user}
    <div class="d-flex flex-column">
        <h1>Choose a Gamemode!</h1>
        <a href="/#/c/create">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                Tournament</button
            >
        </a>
        <a href="/#/wip">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                The Best Video (WIP)</button
            >
        </a>
        <a href="/#/wip">
            <button type="button" class="btn btn-secondary btn-lg mt-5">
                Tier-List (WIP)
            </button>
        </a>
    </div>
    <!-- <Sidebar bind:show={sidebar_show} /> -->
{:else}
    You need to log in to create a clash!
{/if}
