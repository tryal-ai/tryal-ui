<script>
    export let components = [];
</script>
{#each components as c, i}
    <svelte:component this={c.component} {...c.props}></svelte:component>
{/each}