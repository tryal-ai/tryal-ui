<script>
    import 'mathml-elements';
    import { fade } from 'svelte/transition';
    import {getComponent} from './expression.js';
    
    export let expression = '';
    let lastValid = '';
    let comp = null;
    $: { 
        if (expression === '') comp = null;
        else {
            const component = getComponent(expression.replace(' ', ''));
            if (component) {
                lastValid = expression;
                comp = component;
            } 
        }
    }
</script>

{#key comp}
<div in:fade>
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