<script>
    import { push } from 'svelte-spa-router'
    import GameButton from '../lib/util/GameButton.svelte';
    import { user } from '../store'
    import supabase from '../supabase.js'
    import keys from '../keys.js';

    let gameModes = 
    [
        {
            path: '/#/c/create',
            name: 'Tournament',
            icon: 'fa fa-futbol-o',
            iconType: 'fontawesome',
            disable: false
        },{
            path:'/#/wip',
            name: 'The Best Video (WIP)',
            icon: 'fa fa-bomb',
            iconType: 'fontawesome',
            disable: false
        },{
            path: '/#/wip',
            name: 'Tier-List (WIP)',
            icon: 'fa fa-list-ol',
            iconType: 'fontawesome',
            disable: false
        }
    ];

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
<div class="overflow-hidden w-100 h-100" style="overflow: hidden;">
    {#if $user}
        <h1>Choose a Gamemode!</h1>
        <div class="w-100" style="overflow: hidden;">
    
        </div>
        <div class="d-flex flex-wrap justify-content-center">
            {#each gameModes as gm}
                <GameButton gm={gm}/>
            {/each}
        </div>
    
    {:else}
        You need to log in to create a clash!
    {/if}

</div>

<!-- socials footer with buttons -->
<div class="position-absolute bottom-0 start-50 translate-middle-x w-100">
    <div class=" p-2 bg-info bg-opacity-10 border border-info border-start-0 rounded-end">
        <div class="d-flex flex-row w-100">
            <div class="d-flex flex-column me-2">
                <a
                    href="https://github.com/DropMania/videoclash"
                    target="_blank"
                    title="Checkout GitHub"
                >
                    <i class="fa fa-github fa-3x" />
                </a>
            </div>
            <div class="d-flex flex-column me-2">
                <a
                    href="https://twitter.com/VideoClashApp"
                    target="_blank"
                    title="Follow us on Twitter"
                >
                    <i class="fa fa-twitter fa-3x" />
                </a>
            </div>
            <div class="d-flex flex-column me-2">
                <a
                    class=" "
                    href={keys.discordLink}
                    target="_blank"
                    title="Join the Discord"
                >
                    <img
                        src="assets/img/discord.png"
                        alt=""
                        style="height: 42px;"
                        title="Join Discord"
                    />
                </a>
            </div>
        </div>
    </div>
</div>