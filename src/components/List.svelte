<script>
    export let values = [];
</script>

<div>
    {#each values as element}
        <p>
            {element}
        </p>
    {/each}
</div>

<style>
    div {
        text-align: center;
    }
    p {
        display: inline-block;
        margin-left: 20px;
        margin-right: 20px;
    }
</style>