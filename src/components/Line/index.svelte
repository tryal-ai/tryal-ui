<script>
    import 'mathml-elements';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import Expression from '../Expression';
    import Button from './Button';
    export let value = '';
    export let valid = true;

    export let types = ["numerical", "text"];
    export let currentType = 0;

    export let type = types[currentType];

    $: valid = currentType == 1 || valid;

    $: {
        dispatch('update', {
            valid,
            workings: [value]
        });
    }
</script>
<div>
    {#if type === "numerical"}
        <Expression bind:expression={value} bind:valid />
    {/if}
    <div class="line"  class:invalid={!valid}>
        <button on:click={() => {
            currentType = (currentType + 1) % types.length;
            type = types[currentType];
        }}>{type}</button>
        <input bind:value type="text" />
    </div>
    {#if type === "numerical"}
        <div>
            <Button func="SQRT(x)" bind:value />
            <Button func="ROOT3(x)" bind:value />
            <Button func="SIN(x)" bind:value />
            <Button func="COS(x)" bind:value />
            <Button func="TAN(x)" bind:value />
        </div>
    {/if}
</div>

<style>
    button {
        display: inline-block;
        outline: none;
        border: 1px solid #7dbeed;
        color: #7dbeed;
        background: none;
        cursor: pointer;
        margin: 10px 0;
        border-radius: 5px;
        width: 10%;
    }

    .line {
        border-bottom: 1px solid #000;
    }

    input {
        outline: none;
        border: none;
        font-size: 20px;
        margin-top: 5px;
        width: 85%;
    }
    div {
        width: 100%;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .invalid {
        border-bottom: 1px solid #f00;
    }
</style>