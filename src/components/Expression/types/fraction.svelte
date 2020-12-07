<script>
    export let numerator = {};
    export let denominator = {};
</script>
<math-frac>
    <math-row>
        <svelte:component this={numerator.component} {...numerator.props}></svelte:component>
    </math-row>
    <math-row>
        <svelte:component this={denominator.component} {...denominator.props}></svelte:component>
    </math-row>
</math-frac>

