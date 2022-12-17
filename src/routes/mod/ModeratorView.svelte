<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import supabase from '../../supabase';
    import { chat_submissions, user } from '../../store.js';
    import { confirmDialog } from "../../utils.js";
    export let params = {};

    let clashData = {}
    let errorText = ''
    let loading = true
    let stateEnums = {
        NOT_STARTED: 1,
        SHOW_START: 2,
        RUNNING: 3,
        SHOW_RESULTS: 4
    }
    const battleStateEnums = {
        PICKED: 1,
        VOTING: 2,
        ENDED: 3,
        FINSISH: 4
    }
    let gameState = {
        state: stateEnums.NOT_STARTED,
        submissions: [],
        winners: [],
        video1: null,
        video2: null,
        vote1: 0,
        vote2: 0,
        voted: []
    }
    let approvalState={
        NOT_APPROVED:0,
        APPROVED:1,
        DISAPROVE:2
    }
    let approvalTexts=[
        'Not-Approved',
        'Approved',
        'Disapproved'
    ];

    onMount(()=>{

        if(!$user){
            push('/')
        }else{
            loadClash().then(() => {
                chat_submissions.loadSubmissions(clashData.id)
                chat_submissions.subscribeToClash(clashData.id)
                loading = false
            })
        }
    });

    async function loadClash() {
        let { data, error } = await supabase
            .from('Clash')
            .select('*')
            .eq('id', params.id)
            .single()
        if (error) {
            errorText = 'Clash does not exist!'
        } else {
            clashData = data
        }
    }

    async function deleteSubmission(submission) {
        let { error, data } = await supabase
            .from('ClashVideo')
            .delete()
            .eq('id', submission.id)

        if (error) {
            errorText = error.message
        }
    }

    async function  updateApporveStatusOfSubmission(submission, approvalStatusCode){

        if(approvalStatusCode === undefined || approvalStatusCode === null) return;

        let { error, data } = await supabase
            .from('ClashVideo')
            .update({approval: approvalStatusCode})
            .eq('id', submission.id)
        if (error) {
            errorText = error.message
        }
    }


    function openRemoveSubmittedVideoDialog(submission){
        confirmDialog(
            document.querySelector('#modal'), 
            'Confirm?',
            'Do you really want to remove this video?', 
            ()=>{}, 
            ()=>{deleteSubmission(submission)}
        )
    }
    function openChangeApprovalStatusDialog(submission, approvalState){
        confirmDialog(
            document.querySelector('#modal'), 
            'Confirm?',
            'Do you really want to change the status of this video?', 
            ()=>{}, 
            ()=>{updateApporveStatusOfSubmission(submission,approvalState)}
        )
    }

    let bDropDownBtn = false
</script>
<div id="modal"></div>
<h4>Moderator Overview</h4>
<div
    class="card border-primary mb-3 mt-1 overflow-hidden"
    style="height: 80vmin;"
>
    <div class="card-body h-100 d-flex flex-column">
        <h4 class="card-title">
            Submissions ({$chat_submissions.length}/{clashData.video_count ? clashData.video_count : 0 })
        </h4>
        <p class="card-text">below you can see all the submissions</p>
        <div class="overflow-auto flex-fill">
            <table class="table table-hover h-100 mt-3 ">
                <thead>
                    <tr>
                        <th scope="col" />
                        <th scope="col" />
                        <th scope="col">Title</th>
                        <th scope="col">Submitted By</th>
                        <th scope="col" />
                    </tr>
                </thead>
                <tbody>
                    <!-- {#each submissions as submission, i} -->
                    {#each $chat_submissions as submission, i}
                        <tr>
                            <td>{i + 1}</td>
                            <td>
                                <iframe
                                    width="460"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${submission.videoData.id}`}
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                    title="video1"
                                    class="video"
                                />
                            </td>
                            <td>
                                <div>
                                    {submission.videoData.snippet.title}
                                    <h4 class="mt-3">
                                        <span class="badge rounded-pill {submission.approval === 0 ? 'bg-danger' : submission.approval === 1 ? 'bg-success' : 'bg-warning'  } ">{approvalTexts[submission.approval]}</span>
                                    </h4>
                                </div>
                            </td>
                            <td>
                                {submission.name}
                            </td>
                            <td>
                                <div class="">
                                    <button
                                    type="button"
                                    class="btn btn-danger w-100"
                                    on:click={() => {
                                        openRemoveSubmittedVideoDialog(submission)
                                    }}>
                                        Remove
                                    </button>
    
                                    {#if submission.approval === 0}
                                        <button
                                            type="button"
                                            class="btn btn-success w-100 mt-3 approvalBtn"
                                            disabled={submission.approval}
                                            on:click={()=>{openChangeApprovalStatusDialog(submission,approvalState.APPROVED )}}
                                        >
                                            Approve
                                        </button>
                                    {:else if submission.approval === 1}
                                        <button
                                            type="button"
                                            class="btn btn-warning w-100 mt-3 approvalBtn"
                                            on:click={()=>{openChangeApprovalStatusDialog(submission, approvalState.DISAPROVE )}}
                                        >
                                            Disapprove
                                        </button>
                                        
                                    {:else if submission.approval === 2}
                                        <button
                                            type="button"
                                            class="btn btn-warning w-100 mt-3 approvalBtn"
                                            on:click={()=>{openChangeApprovalStatusDialog(submission, approvalState.APPROVED )}}
                                        >
                                            Approve again
                                        </button>
                                        
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>


<style>
    .approvalBtn {
        min-width: 130px;
    }
</style>