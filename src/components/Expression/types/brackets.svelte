<script>
    export let inner = {};
</script>

<math-o>(</math-o>
    <svelte:component this={inner.component} {...inner.props}></svelte:component>
<math-o>)</math-o>