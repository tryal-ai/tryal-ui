<script>
    import Line from './Line';
    export let text = false;
    let workings = [''];
    $: {
        workings = [...workings.filter(v => v !== ''), ''];
    }
</script>

{#each workings as working}
    {#if text}
        <Line bind:value={working} currentType={1} />
    {:else}
        <Line bind:value={working} />
    {/if}
{/each}
