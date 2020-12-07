<script>
    export let base = 2;
    export let term = {};
</script>
<math-root>
    <math-row>
        <svelte:component this={term.component} {...term.props}></svelte:component>
    </math-row>
    {#if base}
        <math-n>
            {base}
        </math-n>
    {/if}
</math-root>