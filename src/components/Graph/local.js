import {writable} from 'svelte/store';

export const width = writable(0);

export const pollWidth = (container) => {
    const setWidth = () => {
        const style = window.getComputedStyle(container, null);
        width.set(style.width.slice(0, style.width.indexOf('.') ? style.width.indexOf('.') : style.width.length - 2));
    }
    setWidth();
    const interval = setInterval(setWidth, 300);
    return () => clearInterval(interval);
}