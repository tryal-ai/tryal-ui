<script>
    import Research from './Research.svelte';
    import Start from './Start.svelte';
    import Paper from './Paper';
    let sessionId = window.sessionId;
    let currentView = 0;   
</script>

{#if sessionId}
    {#if currentView === 0}
        <Research />
    {:else if currentView === 1}
        <Start />
    {:else}
        <Paper bind:sessionId />
    {/if}
    {#if currentView < 2}
        <div>
            <button on:click={() => {
                currentView += 1;
            }}>Next</button>
        </div>
    {/if}
{:else}
    <h2>No Session ID was provided</h2>
    <p>No session ID was provided for this Tryal.AI session. A session ID is required in order to continue</p>
{/if}

<style>
    div {
        text-align: center;
    }
    button {
        font-size: 20px;
    }
</style>