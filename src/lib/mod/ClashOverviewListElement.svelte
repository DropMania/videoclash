<script>
    import { date_format } from "../../utils.js";
    import { fly, fade, slide } from 'svelte/transition';
    import { transition_in } from "svelte/internal";
    export let clashInfo={};

    let bToggleExtraInfo = false;

</script>

<span  class="list-group-item flex-column align-items-start  border border-light m-1">
    <div class="d-flex w-100 flex-row user-select-none">
        <div class="flex-fill d-flex flex-row"
            style="cursor: pointer; "
            on:click={()=>{ bToggleExtraInfo = !bToggleExtraInfo }} 
        >
            <img
                style="border-radius: 0.25rem;"
                class="mr-3"
                width="32"
                height="32"
                src={clashInfo.avatar_url}
                alt={clashInfo.nickname}
                title={clashInfo.nickname}
            />
            <div class="flex-fill p-1">
                <h5 class="text-truncate text-start" style="max-width: 170px;" title={clashInfo.topic} >
                    {clashInfo.topic}
                </h5>
            </div>
        </div>
        <div class="align-items-stretch">
            <button
                type="button"
                class="btn btn-primary"
                title="Clash-View"
                on:click={()=>{ window.open(`${location.origin}/#/c/clash/${clashInfo.id}`,'_blank' ) }}
            >
                <i class="fa fa-gamepad"></i>
            </button>
            <button
                type="button"
                class="btn  btn-primary"
                title="Moderation-View"
                on:click={()=>{ window.open(`${location.origin}/#/mod/clash/${clashInfo.id}`,'_blank' ) }}
            >
                <i class="fa fa-check-circle-o"></i>
            </button>

        </div>
    </div>
    {#if bToggleExtraInfo}
        <div class="text-start overflow-hidden" transition:slide={{ duration: 400}}>
            <div>
                Created by: {clashInfo.nickname}
            </div>
            <div>
                Created at: { date_format(clashInfo.created_at)}
            </div>
            <div>
                Game-Type: Clash
            </div>
            <div>
                Max-Videos: {clashInfo.video_count} / Submitted: {clashInfo.video_count_submitted}
            </div>
            <div>
                Game-ID: {clashInfo.id}
            </div>
        </div>
    {/if}
</span>
<style>

</style>