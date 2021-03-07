<script>
    export let components = [];
</script>

{#each components as c, i}
    <svelte:component this={c.component} {...c.props}></svelte:component>
    {#if i != components.length}
        <math-o>{@html '&#x00d7;'}</math-o>
    {/if}
{/each}