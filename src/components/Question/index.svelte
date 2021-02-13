<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import Text from 'components/Text.svelte';
    import Workings from 'components/Workings.svelte';
    import List from 'components/List.svelte';
    import Multichoice from 'components/Multichoice.svelte';
    import Image from 'components/Image.svelte';
    import Graph from 'components/Graph';
    
    export let body = [];

    let valid = true;
    let workings = {}

    $: valid = Object.keys(workings).includes('valid') ? workings['valid'] : Object.keys(workings).every(k => workings[k].valid)

    $: {
        if (Object.keys(workings).includes('workings')) {
            dispatch('update', workings);
        } else {
            dispatch('update', {
                valid,
                workings: Object.keys(workings).reduce((prev, curr) => {
                    prev[curr] = workings[curr].workings
                    return prev;
                }, {})
            });
        }
    }

    //temporary example question
    //export let body = [];
    let unsupported = false;

</script>

{#if !unsupported}
    {#each body as line}
        {#if typeof line == 'string'}
            <Text body={line} />
        {:else if line.type == 'numeric'}
            <Workings on:update={(event) => {
                if (Object.keys(line).includes('part')) {
                    workings[line['part']] = event.detail;
                } else {
                    workings = event.detail;
                }
            }} />
        {:else if line.type == 'list'}
            <List values={line.values} />
        {:else if line.type == 'multichoice'}
            <Multichoice values={line.values} on:update={(event) => {
                if (Object.keys(line).includes('part')) {
                    workings[line['part']] = event.detail;
                } else {
                    workings = event.detail;
                }
            }} />
        {:else if line.type == 'image'}
            <Image data={line.data} />
        {:else if line.type == 'text'}
            <Workings text={true} on:update={(event) => {
                if (Object.keys(line).includes('part')) {
                    workings[line['part']] = event.detail;
                } else {
                    workings = event.detail;
                }
            }} />
        {:else if line.type == 'graph'}
            <Graph noLogo={true} />
        {/if}
    {/each}
{:else}
    <p>This question contains an unsupported markup in Tryal UI. Tryal UI currently does not support tables</p>
{/if}