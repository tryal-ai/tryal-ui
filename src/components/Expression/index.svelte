<script>
    import 'mathml-elements';
    import {getComponent} from './expression.js';
    
    export let expression = '';
    let lastValid = '';
    export let valid = expression == lastValid;

    $: valid = lastValid == expression;

    let comp = null;
    $: { 
        if (expression === '') comp = null;
        else {
            const expr = expression.replaceAll(' ', '');
            const component = getComponent(expr);
            if (component) {
                lastValid = expression;
                comp = component;
            } 
        }
    }
</script>

{#key comp}
<div>
    <math-ml>
        {#if comp}
            <svelte:component this={comp.component} {...comp.props}></svelte:component>
        {/if}
    </math-ml>
</div>
{/key}
<style>
    div {
        display: inline-block;
    }

</style>