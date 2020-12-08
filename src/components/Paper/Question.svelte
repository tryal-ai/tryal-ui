<script>
    import Workings from 'components/Workings.svelte';

    export let question = {};
    export let number = "1";
</script>
{#each question.images as image}
    <img src={`data:image/png;base64,${image}`} alt="question" />
    <Workings />
{/each}

<p style="text-align: right;">
    ({question.marks} marks)
</p>
<style>
    img {
        width: 100%;
    }
</style>