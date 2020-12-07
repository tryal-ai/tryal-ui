<script>
    export let constant = null;
    export let variable = "";
    
</script>

<math-row>
    {#if constant}
        <svelte:component this={constant.component} {...constant.props}></svelte:component>
    {/if}
    <math-i>{variable}</math-i>
</math-row>