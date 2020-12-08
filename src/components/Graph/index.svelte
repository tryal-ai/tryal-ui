<script>
    import {onMount} from 'svelte';
    import {width, pollWidth} from './local';
    import {render} from './renderer';

    let canvas = null;
    let container = null;
    onMount(() => {
        const stop = pollWidth(container);
    });

    width.subscribe(v => {
        render(canvas, {}, v, 600);
    })


</script>
<div bind:this={container}>
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    div {
        width: 100%;
    }
</style>