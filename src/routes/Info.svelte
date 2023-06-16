<script>
    import keys from '../keys.js'
    import Tos from './TOS.svelte'
</script>

<div class="d-flex flex-row justify-content-between w-100">
    <div class="d-flex flex-column">
        <a
            href="https://github.com/DropMania/videoclash"
            target="_blank"
            title="Checkout GitHub"
        >
            <i class="fa fa-github fa-5x" />
        </a>
        GitHub
    </div>

    <div class="d-flex flex-column">
        <a
            href="https://twitter.com/VideoClashApp"
            target="_blank"
            title="Follow us on Twitter"
        >
            <i class="fa fa-twitter fa-5x" />
        </a>
        Follow us on Twitter
    </div>

    <div class="d-flex flex-column">
        <a
            class=" "
            href={keys.discordLink}
            target="_blank"
            title="Join the Discord"
        >
            <img
                src="assets/img/discord.png"
                alt=""
                style="height: 80px;"
                title="Join Discord"
            />
        </a>
        Join our Discord
    </div>
</div>

<div class="pt-5">
    <Tos />
</div>
