import {writable} from 'svelte/store';



export const width = writable(0);

export const updateWidth = container => {
    const style = window.getComputedStyle(container, null);
    width.set(
        parseInt(
            style.width.slice(0, style.width.indexOf('.') ?
            style.width.indexOf('.')
            : style.width.length - 2)
        )
    );
}