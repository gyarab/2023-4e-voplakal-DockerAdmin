<template>
    <form :action="sendForm">
        <div id="recaptcha_div"></div>
        <br>
        <input type="submit" value="getResponse">
    </form>
</template>

<script setup>

import { onBeforeMount, defineExpose } from 'vue';

onBeforeMount(() => {
    const script = document.createElement('script');
    script.src = "https://www.google.com/recaptcha/api.js?onload=onloadCallbackCaptcha&render=explicit";
    script.async = true;
    console.log(document.head.appendChild(script));
});

// const token = defineModel('token', { default: null })

let token;
let verifyCallback = function (response) {
    console.log(response);
    if (!response) throw Error("Token from Captcha API is missing")
    // token.value = response;
    token = response;
};

let widget2;
window.onloadCallbackCaptcha = function () {
    widget2 = grecaptcha.render("recaptcha_div", {
        sitekey: "6Lca5YApAAAAANSnfw7Oymu0mxeZW3ceN9JE6lqA",
        callback: verifyCallback,
        // theme: "dark",
    });
};


// console.log(grecaptcha.getResponse(widget2));

// should be called outside of the component
function getToken() {
    grecaptcha.reset(widget2);
    return token;
}

defineExpose({
    getToken
})

</script>                
