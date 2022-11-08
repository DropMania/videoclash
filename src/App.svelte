<script>
    import Router from 'svelte-spa-router'
    import routes from './routes'
    import supabase from './supabase'
    import { user } from './store'
    async function signInWithTwitch() {
        const { user, session, error } = await supabase.auth.signIn(
            {
                provider: 'twitch'
            },
            {
                scopes: 'chat:read chat:edit channel:manage:redemptions',
                redirectTo: location.origin
            }
        )
    }
    async function signout() {
        const { error } = await supabase.auth.signOut()
        localStorage.removeItem('twitch_refresh_token')
    }
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            $user = { ...session.user, access_token: session.provider_token }
            if (session.provider_refresh_token) {
                localStorage.setItem(
                    'twitch_refresh_token',
                    session.provider_refresh_token
                )
            }
        } else {
            $user = null
        }
    })
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky">
    <div class="container-fluid">
        <a class="navbar-brand" href="/#/">VideoClash</a>

        {#if $user}
            <h4>
                Hello, {$user.user_metadata.nickname}
                <img
                    style="border-radius: 0.25rem;"
                    width="32"
                    height="32"
                    src={$user.user_metadata.picture}
                    alt="avatar"
                />
            </h4>
            <div class="btn btn-secondary my-2 my-sm-0" on:click={signout}>
                Logout
            </div>
        {:else}
            <button
                class="btn btn-secondary my-2 my-sm-0"
                on:click={signInWithTwitch}>Login with Twitch</button
            >
        {/if}
    </div>
</nav>
<div class="container text-center mt-5 d-flex flex-column align-items-center">
    <Router {routes} />
</div>

<style>
    .sticky {
        position: sticky;
        top: 0;
        z-index: 1;
    }
</style>
