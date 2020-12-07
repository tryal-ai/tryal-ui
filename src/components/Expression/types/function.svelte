<script>
    export let symbol = "";
    export let expression = {};
</script>

<math-text>
    {symbol.toLowerCase()}
</math-text>
<math-o>(</math-o>
<svelte:component this={expression.component} {...expression.props}></svelte:component>
<math-o>)</math-o>
