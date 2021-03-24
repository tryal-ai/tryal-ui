<script>
    import Expression from '../Expression';
    export let func = "SQRT(x)";
    export let value = "";
</script>

<button on:click={() => {
    value = func.replace('x', value);
}}>
    <Expression bind:expression={func}></Expression>
</button>

<style>
    button {
        vertical-align: middle;
    }
</style>