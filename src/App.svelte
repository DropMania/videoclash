<script>
    import Router from 'svelte-spa-router'
    import routes from './routes'
    import supabase from './supabase'
    import { user, twitch_token } from './store'
    import { getHoursDiff } from './utils.js'
    import keys from './keys'
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
            $user = { ...session.user }
            if (session.provider_refresh_token) {
                localStorage.setItem(
                    'twitch_refresh_token',
                    session.provider_refresh_token
                )
            }

            /* sync user data for public.users table - update or insert handled by update_or_insert_user_data supabase function */
            let last_user_data_sync = localStorage.getItem(
                'last_user_data_sync'
            )
            if (
                $user &&
                (last_user_data_sync === null ||
                    getHoursDiff(last_user_data_sync, new Date()) > 24)
            ) {
                supabase
                    .rpc('update_or_insert_user_data', {
                        i_avatar_url: session.user.user_metadata.avatar_url,
                        i_name: session.user.user_metadata.name,
                        i_nickname: session.user.user_metadata.nickname,
                        i_description:
                            session.user.user_metadata.custom_claims
                                .description,
                        i_user_data: session.user.user_metadata
                    })
                    .then((data, error) => {
                        if (error) {
                            console.log('Something went wrong.. hmmm :/')
                        } else {
                            // console.log('synced user data');
                            localStorage.setItem(
                                'last_user_data_sync',
                                String(new Date())
                            )
                        }
                    })
            } else {
                // console.log('skiped user sync');
            }
        } else {
            $user = null
        }
    })
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky">
    <div class="container-fluid">
        <a class="navbar-brand" href="/#/"
            ><img src="logo_6.svg" alt="logo" class="logo" />
            <span class="title">VIDEOCLASH</span></a
        >

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
            <div>
                <a class="btn btn-secondary " href="/#/mod/manage/moderators"
                    >Moderators</a
                >
                <div class="btn btn-secondary my-2 my-sm-0" on:click={signout}>
                    Logout
                </div>
                <a class="btn btn-secondary " href="/#/info"
                    ><i class="fa fa-info" /></a
                >
                <a class="btn btn-secondary " href={keys.discordLink}>
                    <img
                        src="./src/assets/img/discord.png"
                        alt=""
                        style="height: 16px;"
                        title="Join Discord"
                    />
                </a>
            </div>
        {:else}
            <div>
                <button
                    class="btn btn-secondary my-2 my-sm-0"
                    on:click={signInWithTwitch}>Login with Twitch</button
                >
                <a class="btn btn-secondary " href="/#/info"
                    ><i class="fa fa-info" /></a
                >
                <a class="btn btn-secondary " href={keys.discordLink}>
                    <img
                        src="./src/assets/img/discord.png"
                        alt=""
                        style="height: 16px;"
                        title="Join Discord"
                    />
                </a>
            </div>
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
    .logo {
        width: 32px;
        height: 32px;
    }
    .title {
        font-size: 1.5rem;
        font-weight: 400;
        margin-left: 0.5rem;
        font-family: Montserrat;
    }
    .navbar-brand {
        display: flex;
        align-items: center;
    }
</style>
