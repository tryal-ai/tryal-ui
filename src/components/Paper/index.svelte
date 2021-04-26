<script>
    import {paper} from '../../lib/store';
    import {getPaper} from '../../lib/session';
    
    import ProgressBar from './ProgressBar.svelte';
    import Question from './Question.svelte';
    
    export let sessionId = "";

    if (!$paper) {
        console.log(sessionId);
        getPaper().then(p => {
            $paper = p;
        })
    }
    
    export let currentQuestion = 0;
</script>

{#if !$paper}
    <h3>Loading paper...</h3>
{:else}
    <ProgressBar steps={$paper.map((v, i) => `Question ${i + 1}`)} bind:stage={currentQuestion} />
    <Question question={$paper[currentQuestion]} />
    <div>
        <button on:click={() => {
            if (currentQuestion > 0) currentQuestion -= 1;
        }}>Prev</button>
        <button on:click={() => {
            if (currentQuestion < $paper.length - 1) currentQuestion += 1;
        }}>Next</button>
    </div>
{/if}

<style>
    div {
        text-align: center;
    }
    button {
        font-size: 20px;
    }
</style>