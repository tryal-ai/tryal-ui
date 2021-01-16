<script>
    import Text from 'components/Text.svelte';
    import Workings from 'components/Workings.svelte';
    import List from 'components/List.svelte';
    import Multichoice from 'components/Multichoice.svelte';
    import Image from 'components/Image.svelte';
    import Graph from 'components/Graph';
    import body from './question.js';

    //temporary example question
    //export let body = [];
    let unsupported = false;

</script>

{#if !unsupported}
    {#each body as line}
        {#if typeof line == 'string'}
            <Text body={line} />
        {:else if line.type == 'numeric'}
            <Workings />
        {:else if line.type == 'list'}
            <List values={line.values} />
        {:else if line.type == 'multichoice'}
            <Multichoice values={line.values} />
        {:else if line.type == 'image'}
            <Image data={line.data} />
        {:else if line.type == 'text'}
            <Workings text={true} />
        {:else if line.type == 'graph'}
            <Graph noLogo={true} />
        {/if}
    {/each}
{:else}
    <p>This question contains an unsupported markup in Tryal UI. Tryal UI currently does not support tables</p>
{/if}