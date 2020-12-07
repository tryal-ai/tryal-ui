<script>
    export let coefficient = {};
    export let exponent = {};
</script>

<math-sup>
    <math-row>
        <svelte:component this={coefficient.component} {...coefficient.props}></svelte:component>
    </math-row>
    <math-row>
        <svelte:component this={exponent.component} {...exponent.props}></svelte:component>
    </math-row>
</math-sup>