import {writable, readable} from 'svelte/store';

export const paper = writable(null);

export const tryalUIWidth = readable(null, set => {
    const style = window.getComputedStyle(document.getElementById("tryalui"), null);
    
    const interval = setInterval(() => {
        set(document.getElementById("tryalui").style.width);
    }, 300);
    return () => clearInterval(interval);
});