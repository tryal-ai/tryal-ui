<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import Line from './Line';
    export let text = false;
    
    let workings = [{
        value: '',
        valid: true,
    }];
    $: {
        workings = [...workings.filter(v => v.value !== ''), {
            value: '',
            valid: true
        }];
        dispatch('update', {
            valid: workings.every(v => v.valid || v.value === ''),
            workings: workings.filter(v => v.value !== '').map(v => v.value)
        });
    }

</script>

{#each workings as working}
    {#if text}
        <Line bind:value={working.value} bind:valid={working.valid} currentType={1} />
    {:else}
        <Line bind:value={working.value} bind:valid={working.valid} />
    {/if}
{/each}
