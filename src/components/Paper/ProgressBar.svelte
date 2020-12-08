<script>
    import { tweened } from 'svelte/motion';
    
    export let steps = [];
    export let stage = 0;

    const width = tweened(0, {
        duration: 300
    });

    $: $width = stage < steps.length - 1 ? (stage / (steps.length - 1)) * 100 : 100;

</script>
<div class="main">
    <div class="fill" style="width: {$width}%;"></div>
    <p>{steps[stage]}</p>
</div>

<style>
    .main {
        width: 100%;
        height: 20px;
        text-align: center;
        border: 1px solid #000;
        margin-bottom: 20px;
    }
    .fill {
        position: absolute;
        height: 20px;
        background-color: green;
    }
    p {
        margin-top: 2px;
        margin-bottom: 2px;
        font-size: 16px;
    }
</style>