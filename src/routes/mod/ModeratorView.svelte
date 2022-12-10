<script>
    import { createEventDispatcher } from 'svelte'
    import { onMount } from "svelte";
    import supabase from '../../supabase';
    import { getVideoData, validateLink, getTwitchToken } from '../../utils'
    import keys from '../../keys'
    import { element } from 'svelte/internal';
    export let params = {};

    let clashData = {}
    let errorText = ''
    let loading = true
    let submissions = []
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
        APPROVED:1
    }
    let approvalTexts=[
        'Not-Approved',
        'Approved'
    ];
    const dispatch = createEventDispatcher()
    onMount(()=>{

        loadClash().then(() => {
            loadSubmissions()
            supabase
                .from('ClashVideo')
                .on('*', async (payload) => {
                    console.log(payload);
                    if (payload.eventType === 'INSERT') {
                        if (payload.new.clash_id !== clashData.id) return
                        let id = ''
                        if (payload.new.link.includes('youtu.be')) {
                            id = payload.new.link.split('youtu.be/')[1]
                        } else {
                            let params = new URLSearchParams(
                                new URL(payload.new.link).search
                            )
                            id = params.get('v')
                        }
                        let videoData = await getVideoData(id)
                        submissions = submissions.concat({
                            ...payload.new,
                            videoData,
                            youtubeId: id
                        })
                    }
                    if (payload.eventType === 'DELETE') {
                        submissions = submissions.filter(
                            (submission) => submission.id !== payload.old.id
                        )
                    }
                    if(payload.eventType === 'UPDATE'){
/* 
    doesnt update the view... why tho?
*/
                        let submission = submissions.find((element)=>{  return element.id === payload.old.id;  })
                        submission.approval = payload.new.approval;
                        console.log(submissions);
                        // console.log(test);
                    }
                })
                .subscribe()
            loading = false
        })


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
    async function loadSubmissions() {
        let { error, data } = await supabase
            .from('ClashVideo')
            .select('*')
            .eq('clash_id', clashData.id)

        submissions = await Promise.all(
            data.map(async (d) => {
                let id = ''
                if (d.link.includes('youtu.be')) {
                    id = d.link.split('youtu.be/')[1]
                } else {
                    let params = new URLSearchParams(new URL(d.link).search)
                    id = params.get('v')
                }
                let videoData = await getVideoData(id)
                return {
                    ...d,
                    videoData,
                    youtubeId: id
                }
            })
        )
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

    async function  apporveSubmission(submission){

        let { error, data } = await supabase
            .from('ClashVideo')
            .update({approval: 1})
            .eq('id', submission.id)
        if (error) {
            errorText = error.message
        }
    }

</script>
<h4>Moderator Overview</h4>
<div
    class="card border-primary mb-3 mt-5 overflow-auto"
    style="height: 80vmin;"
>
    <div class="card-body h-100">
        <h4 class="card-title">
            Submissions ({submissions.length}/{clashData.video_count})
        </h4>
        <p class="card-text">below you can see all the submissions</p>
        <table class="table table-hover h-100 mt-3">
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
                {#each submissions as submission, i}
                    <tr>
                        <td>{i + 1}</td>
                        <td>
                            <iframe
                                width="560"
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
                                <br/>
                                <h4>
                                    <span class="badge rounded-pill {submission.approval ? 'bg-success' : 'bg-danger'} ">{approvalTexts[submission.approval]}</span>
                                </h4>
                                
                            </div>    
                        
                        </td>
                        <td>
                            {submission.name}
                        </td>
                        <td>
                            <div>
                                <button
                                type="button"
                                class="btn btn-danger"
                                on:click={() => {deleteSubmission(submission)}}>
                                    Remove
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-success"
                                    disabled={submission.approval}
                                    on:click={()=>{apporveSubmission(submission)}}
                                >
                                    Approve
                                </button>

                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>