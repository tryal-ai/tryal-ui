<script>
    export let value = 0;

    let symbols = {
        "PI": "&#x03a0;"
    }
</script>

<math-i>{@html symbols[value] ? symbols[value] : "&#x039e;"}</math-i>