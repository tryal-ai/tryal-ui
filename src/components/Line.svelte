<script>
    import 'mathml-elements';
    import Expression from './Expression';

    export let value = '';
</script>
<div>
    <Expression bind:expression={value} />
    <input bind:value type="text" />
</div>
<!--
    <math-ml>
    <math-row>
        <math-sup>
        <math-i>x</math-i><math-n>2</math-n>
        </math-sup>
        <math-sup>
        <math-i>y</math-i><math-n>2</math-n>
        </math-sup>
    </math-row>
    </math-ml>
-->

<style>
    input {
        outline: none;
        border: none;
        border-bottom: 1px solid #000;
        width: 100%;
        font-size: 20px;
        margin-top: 5px;
    }
    div {
        width: 100%;
        margin-top: 15px;
        margin-bottom: 15px;
    }
</style>