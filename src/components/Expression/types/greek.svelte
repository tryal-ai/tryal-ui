<script>
    export let value = 0;

    let symbols = {
        "PI": "&#960;",
        "EPSILON": "&#x3b5;",
        "THETA": "&#x3b8;"
    }
</script>

<math-i>{@html symbols[value.toUpperCase()] ? symbols[value.toUpperCase()] : "&#x039e;"}</math-i>