<script>
    import Text from './Text.svelte';
    export let values = [];
</script>

<div>
    {#each values as element}
        <Text body={element}></Text>
    {/each}
</div>

<style>
    div {
        text-align: center;
    }
</style>