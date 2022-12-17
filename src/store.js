import { writable } from 'svelte/store'
import supabase from './supabase'
import { getVideoData } from './utils'

export let user = writable(null)
export let twitch_token = writable(null)

function createChatSubmissionsStore(){
    const { subscribe, set, update } = writable([]);

    const loadSubmissions = async function(clash_id=""){  
        let query = supabase
            .from('ClashVideo')
            .select('*')
            .eq('clash_id', clash_id);
    
        const { error, data } = await query

        let submissions = await Promise.all(
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

        update( n=> submissions )
    }


    function subscribeToClash(clash_id=""){
        supabase
        .from('ClashVideo')
        .on('*', async (payload) => {
            if (payload.eventType === 'INSERT') {
                if (payload.new.clash_id !== clash_id) return
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
                update(submissions=>submissions.concat({
                    ...payload.new,
                    videoData,
                    youtubeId: id
                }))
            }
            if (payload.eventType === 'DELETE') {
                update(submissions=>submissions = submissions.filter(
                    (submission) => submission.id !== payload.old.id
                ))
            }
            if(payload.eventType === 'UPDATE'){
                update(submissions=>{
                    let submission = submissions.find((element)=>{  return element.id === payload.old.id;  })
                    submission.approval = payload.new.approval;
                    return submissions
                })
            }
        })
        .subscribe()
    }

    return {
        subscribe,
        loadSubmissions,
        update,
        subscribeToClash
    }


}

export let chat_submissions = createChatSubmissionsStore()