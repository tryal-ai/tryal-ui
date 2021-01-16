<script>
    import { onMount } from 'svelte';
    import { width, updateWidth } from './width.js';
    import TryGraph from 'trygraph';
    
    import logo from 'assets/logo_icon.png';
    import tryGraphLogo from 'assets/trygraph_logo.png';

    export let noLogo = false;

    let container = null;
    let canvas = null;
    let tryGraph = null;
    let overlay = null;

    onMount(() => {
        updateWidth(container);
        window.addEventListener('resize', () => updateWidth(container));
        tryGraph = new TryGraph(canvas, container, width, {});
    });
</script>

{#if !noLogo}
    <div class="header">
        <img src={tryGraphLogo} alt="TryGraph Logo" />
        <p>
            TryGraph by 
        </p> 
        <img src={logo} alt="Tryal.AI Logo" /> 
        <p>
            Tryal.AI
        </p>
    </div>
{/if}
<div bind:this={container}>
    <canvas 
        width={$width}
        height={$width}
        bind:this={canvas}></canvas>
</div>

<style>
    div {
        max-width: 800px;
        margin: 0 auto;
        position: relative;
    }
    canvas {
        border: 1px solid #000;
    }
    .header {
        height: 100px;
        vertical-align: middle;
        margin-bottom: 20px;
        color: #000;
    }
    .header > p {
        display: inline-block;
        vertical-align: middle;
        margin: 0;
        font-size: 40px;
    }
    img {
        height: 100%;
        vertical-align: middle;

    }
</style>