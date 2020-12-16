<script>
    export let min = 0;
    export let max = 100;
    export let valueChanged = (v) => {};
    export let value = 0;
    $: valueChanged(value);
</script>

<div>
  <input bind:value type="range" min={min} max={max}>
</div>
<style>
    div {
        position: absolute;
        bottom: 0;
        margin: 20px 0;
        padding: 0 50px;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
    }
    input {
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        border-radius: 5px;  
        background: #d3d3d3;
        outline: none;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }
    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%; 
        background: linear-gradient(90deg, #5200c8, #db1190);
        cursor: pointer;
    }

    input::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: linear-gradient(90deg, #5200c8, #db1190);
        cursor: pointer;
    }
</style>