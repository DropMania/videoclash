<script>
    import { user } from "../../store";;
    import { onMount } from "svelte";
    import supabase from "../../supabase";
    // import sevenTV from "../../factories/7tv.js";
    export let params = {};

    let oData={
        success:false,
        msg: "Nothing yet happend",
        code: "1111"
    };


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

    async function add_moderator_to_streamer_with_token() {
        const { data, error } = await supabase.rpc('add_moderator_to_streamer_with_token',{
            i_token:params.token,
            user_metadata:$user.user_metadata
        })
        if (error) {
            console.log('Somekinda error happend here Hmmmm...');
            console.log(error);
        } else {
            // @ts-ignore
            oData = JSON.parse(data);
            console.log(oData);
        }
    }

    onMount(()=>{

        if(!$user){
            // console.log('in not loggedin');
        }else{
            if(params.token === ""){
                oData = {
                    success: false,
                    msg:'url-parameter for token is missing',
                    code:'6666'
                }
            }else{
                add_moderator_to_streamer_with_token()
            }
        }


    });

</script>

<div>
    {#if $user}
        <h2>
            You have been invited to join as a Moderator
        </h2>
        <h3>
            {oData.msg}
        </h3>

        {#if oData.code === "1111"}<!-- default-->
            <img src="https://cdn.7tv.app/emote/62162fc778f6e57762f9bbf2/4x.webp" alt="LICKA" />
        {:else if oData.code === "1234"}<!-- already mod -->
            <img src="https://cdn.7tv.app/emote/617ee705b0bfad942897009c/4x.webp" alt="CuteDoggo" />
        {:else if oData.code === "6969"}<!-- YOU ARE STREAMER -->
            <img src="https://cdn.7tv.app/emote/6108a4bd569a3002abab0043/4x.webp" alt="AAAA" />
        {:else if oData.code === "7777"}<!-- Token invalid -->
            <img src="https://cdn.7tv.app/emote/61cb78395fa851bfdf0f1c75/4x.webp" alt="TITS" />
        {:else if oData.code === "200"}<!-- success everything -->
            <img src="https://cdn.7tv.app/emote/60bd94a262260c4a29e7bf5e/4x.webp" alt="dogArrive" />
        {:else if oData.code === "6666"}<!-- something i dont know happen went wrong -->
           <img src="https://cdn.7tv.app/emote/62424b22c6ac5ea23a7f4c0d/4x.webp" alt="thisIsFine" />
           {/if}
           {:else}
           You need to be logged in to use this invite link!
           Login here and try again :)
           <br/>
           <button
           class="btn btn-secondary my-2 my-sm-0"
           on:click={signInWithTwitch}>
           Login with Twitch
        </button>
        <img src="https://cdn.7tv.app/emote/60ae387cb2ecb0150505e235/4x.webp" alt="thisIsFine" />
    {/if}

</div>
<style>
    img {
        width: 100%;
        max-width: 400px;
        margin-top: 30px;
    }
</style>