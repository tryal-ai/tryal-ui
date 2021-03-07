<script>
    export let components = [];
</script>
<math-o>(</math-o>
{#each components as c, i}
    <svelte:component this={c.component} {...c.props}></svelte:component>
    {#if i != components.length - 1}
        <math-o>,</math-o>
    {/if}
{/each}
<math-o>)</math-o>