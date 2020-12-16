<script>
    export let functions = [{}];
</script>

<div>
    <p>Menu</p>
    {#each functions as f}
        <button on:click={f.action}>
            <img src={f.image} alt="icon"/>
            <p>
                {f.text ? f.text : ''}
            </p>
        </button>
    {/each}
</div>

<style>
    p {
        text-align: center;
        color: #fff;
    }
    div {
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, #5200c8, #db1190);
        padding: 5px;
        border-radius: 0 0 10px 0;
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

    button:hover {
        filter: drop-shadow(3px 3px 2px #fff);
    }
    img {
        width: 60px;
    }
</style>