<script>
    export let formData = {}
</script>

<div class="form-group mt-3">
    <label for="topic" class="form-label mt-4"
        >Topic
        <input
            type="text"
            class="form-control"
            id="topic"
            bind:value={formData.topic}
        />
    </label>
</div>
<div class="form-group mt-3">
    <label for="videolen" class="form-label mt-4">Max. Users</label>
    <input
        type="number"
        class="form-control"
        id="videolen"
        bind:value={formData.max_user}
    />
</div>
