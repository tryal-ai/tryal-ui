<script>
    export let functions = [{}];
    let focused = null;
</script>

<div>
    <p>Menu</p>
    {#each functions as f}
        {#if focused}
            {#if focused == f.text}
                <button disabled={true} on:click={f.action}>
                    <img src={f.image} alt="icon"/>
                    <p>
                        {f.text ? f.text : ''}
                    </p>
                </button>
            {/if}
        {:else}
            <button on:click={() => {
                focused = f.text;
                f.action(() => focused = null);
            }}>
                <img src={f.image} alt="icon"/>
                <p>
                    {f.text ? f.text : ''}
                </p>
            </button>
        {/if}
    {/each}
    {#if focused}
        <p>Press ESC to Stop</p>
    {/if}
</div>

<style>
    p {
        text-align: center;
        color: #fff;
        width: 60px;
        display: inline-block
    }
    div {
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, #5200c8, #db1190);
        padding: 5px;
        border-radius: 0 0 10px 0;
        text-align: center;
    }
    button {
        display: block;
        margin: 5px;
        font-size: 16px;
        background: transparent;
        border: none;
        outline: none;
        color: #ffffff;
        cursor: pointer;
    }

    button > p {
        display: block;
    }

    button:hover, button:disabled {
        filter: drop-shadow(3px 3px 2px #fff);
    }
    img {
        width: 60px;
    }
</style>