<script>
    import { onMount } from 'svelte'
    import { Client } from 'tmi.js'
    import { user } from '../store'
    import { callBot } from '../utils'
    export let gameState = {}
    let finaleNumber = gameState.submissions.length
    let roundNumber = 0
    let rounds = gameState.submissions.length / 2
    const finaleNames = {
        8: 'Quarter Finals',
        4: 'Semi Finals',
        2: 'Finals'
    }
    const battleStateEnums = {
        PICKED: 1,
        VOTING: 2,
        ENDED: 3,
        FINSISH: 4
    }
    const maxVotingTime = 45
    let votingTime = 45
    let interval
    let client = new Client({
        channels: [$user.user_metadata.name]
    })
    client.connect()
    let voted = []
    // @ts-ignore
    client.on('message', (channel, tags, message, self) => {
        if (gameState.battleState === battleStateEnums.VOTING) {
            if (!voted.includes(tags.username)) {
                if (message === '1') {
                    gameState.vote1++
                }
                if (message === '2') {
                    gameState.vote2++
                }
                voted.push(tags.username)
            }
        }
    })
    onMount(() => {
        pickVideos()
    })
    function pickVideos() {
        votingTime = maxVotingTime
        stopTimer()
        if (gameState.submissions.length) {
            gameState.video1 = gameState.submissions[0]
            gameState.video2 = gameState.submissions[1]
            gameState.submissions = gameState.submissions.slice(2)
            gameState.battleState = battleStateEnums.PICKED
            gameState.vote1 = 0
            gameState.vote2 = 0
            roundNumber++
        } else {
            if (gameState.winners.length === 1) {
                gameState.battleState = battleStateEnums.FINSISH
                console.log('finish', gameState.winners)
            } else {
                gameState.submissions = gameState.winners
                finaleNumber = gameState.submissions.length
                gameState.winners = []
                roundNumber = 0
                rounds = gameState.submissions.length / 2
                pickVideos()
            }
        }
    }
    function startVoting() {
        votingTime = maxVotingTime
        gameState.battleState = battleStateEnums.VOTING
        voted = []
        callBot('start_vote', { channel: $user.user_metadata.name })
        startTimer()
    }
    function resetVoting() {
        gameState.battleState = battleStateEnums.PICKED
        gameState.vote1 = 0
        gameState.vote2 = 0
        votingTime = maxVotingTime
        stopTimer()
    }
    function pick(video) {
        if (video === 1) {
            gameState.winners = gameState.winners.concat(gameState.video1)
        } else {
            gameState.winners = gameState.winners.concat(gameState.video2)
        }
        pickVideos()
    }

    function startTimer() {
        interval = setInterval(() => {
            if (gameState.battleState === battleStateEnums.VOTING) {
                votingTime--
                if (votingTime === 0) {
                    gameState.battleState = battleStateEnums.ENDED
                    callBot('end_vote', { channel: $user.user_metadata.name })
                }
            }
        }, 1000)
    }
    function stopTimer() {
        clearInterval(interval)
    }
</script>

{#if gameState.battleState && gameState.battleState != battleStateEnums.FINSISH}
    {finaleNames[finaleNumber]
        ? finaleNames[finaleNumber]
        : `round of ${finaleNumber}`} ({roundNumber}/{rounds})
    <div class="d-flex justify-content-between align-items-center w-100">
        <div>
            <h1>Video 1</h1>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${gameState.video1.youtubeId}`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title="video1"
                class="video"
            />
            <h3 class="mt-3">{gameState.video1.name}</h3>

            <h3 class="mt-3">Votes: {gameState.vote1}</h3>
            <button class="btn btn-secondary btn-lg" on:click={() => pick(1)}
                >Pick</button
            >
        </div>
        <div class="m-5">
            {#if gameState.battleState === battleStateEnums.PICKED}
                <button class="btn btn-secondary btn-lg" on:click={startVoting}
                    >Start Voting</button
                >
            {:else if gameState.battleState === battleStateEnums.VOTING}
                <h3>Voting has started!</h3>
                <h5>type 1 or 2 in Chat to vote!</h5>
                <button class="btn btn-outline-primary" on:click={resetVoting}
                    >Reset Voting</button
                >
            {:else if gameState.battleState === battleStateEnums.ENDED}
                <h3>Voting has ended!</h3>
                <button class="btn btn-outline-primary" on:click={resetVoting}
                    >Reset Voting</button
                >
            {/if}
        </div>
        <div>
            <h1>Video 2</h1>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${gameState.video2.youtubeId}`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title="Video 2"
                class="video"
            />
            <h3 class="mt-3">{gameState.video2.name}</h3>
            <h3 class="mt-3">Votes: {gameState.vote2}</h3>
            <button
                class="btn btn-secondary btn-lg mt-2"
                on:click={() => pick(2)}>Pick</button
            >
        </div>
    </div>
    <div class="progress w-100 mt-5 ">
        <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            style="width: {Math.floor((votingTime / maxVotingTime) * 100)}%"
        />
    </div>
{:else if gameState.battleState === battleStateEnums.FINSISH}
    <h1>Winner is {gameState.winners[0].name}</h1>
    <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${gameState.winners[0].youtubeId}`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="Video 2"
    />
{/if}

<style>
    .video {
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }
</style>
