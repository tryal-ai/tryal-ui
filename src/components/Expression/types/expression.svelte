<script>
    export let lhs = {};
    export let rhs = {};
    export let symbol = "f";
    export let brackets = false;
</script>

{#if brackets}
    <math-o>(</math-o>
{/if}
<svelte:component this={lhs.component} {...lhs.props}></svelte:component>
{#if symbol !== 'x' && symbol !== '*'}
    <math-o>{symbol}</math-o>
{:else if symbol === '*'}
    <math-o>{@html '&#x00d7;'}</math-o>
{/if}
<svelte:component this={rhs.component} {...rhs.props}></svelte:component>
{#if brackets}
    <math-o>)</math-o>
{/if}