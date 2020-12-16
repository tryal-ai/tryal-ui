//Alternatively you can import the components directly
import {Graph, Session} from 'tryalui';



//And instantiate them yourself
const graph = new Graph({
    //Telling them what HTML element to nest inside
    target: document.body,
})



//With session, rather than placing the token in window.tryalsession (which is what you'd do
//on HTML only embedding)

//You can instantiate the token directly by doing
const token = "A tryal UI token you get from your server (by requesting to our API) using your own REST logic"

const session = new Session({
    //put the session in the body HTML element
    target: document.body,
    props: {
        token
    }
});

//In react, what you're best to do is define your react component, use it, 
//then wait for onMount and run these Tryal UI calls against the HTML in that component
//Because Svelte has precompiled the HTML into javascript, it will surgically insert
//the necessary DOM inside your now rendered react components