<script>
    import { onMount } from 'svelte';
    export let body = "";
    
    function getBodyArrayFromString(str) {
        let latexRe = /\$(.*?)\$/g;
        const matches = [...str.matchAll(latexRe)];
        if (matches.length == 0) return [str];
        let start = 0;
        const spans = matches.map(v => {
            const result = [[start, v['index'], false], [v['index'], v['index'] + v[0].length, true]]
            start = v['index'] + v[0].length;
            return result;
        }).flat();
        const body = spans.map(v => {
            if (!v[2]) return str.slice(v[0], v[1]);
            else {
                return {
                    expression: str.slice(v[0] + 1, v[1] - 1),
                }
            }
        })
        if (spans.length > 0) body.push(str.slice(spans[spans.length - 1][1]));

        return body;
    }
    
    $: parsed = getBodyArrayFromString(body);
</script>

<svelte:head>
    <script type="module" src="https://unpkg.com/@navsnpm/katex-expression/dist/katex-expression/katex-expression.esm.js"></script>
    <script nomodule="" src="https://unpkg.com/@navsnpm/katex-expression/dist/katex-expression/katex-expression.js"></script>
</svelte:head>

<div>
    {#each parsed as part}
        {#if typeof part == 'string'}
            <p>{part}</p>
        {:else}
            <katex-expression expression={part.expression}></katex-expression>
        {/if}
    {/each}
</div>

<style>
    p {
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;

    }
    div {
        display: inline-block;
    }
</style>

