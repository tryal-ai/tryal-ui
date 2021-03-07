<script>
    export let components = [];
</script>

{#each components as c}
    <svelte:component this={c.component} {...c.props}></svelte:component>
{/each}