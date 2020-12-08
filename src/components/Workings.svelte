<script>
    import Line from './Line';
    let workings = [''];
    $: {
        workings = [...workings.filter(v => v !== ''), ''];
    }
</script>

{#each workings as working}
    <Line bind:value={working} />
{/each}
