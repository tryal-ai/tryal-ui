
export const ondrag = (obj, handler) => {
    const wrapper = event => {
        if (!event.stopped) {
            event.stopPropagation();
            obj.on('mousemove', handler);
            obj.on('mouseup', () => {
                obj.removeListener('mousemove', handler);
            });
            obj.on('mouseout', () => {
                obj.removeListener('mousemove', handler);
            });
        }
    }
    obj.on('mousedown', wrapper);
    return () => obj.removeListener('mousedown', wrapper);
}

export const onhold = (obj, down, up) => {
    obj.on('mousedown', down);
    obj.on('mouseup', up);
    obj.on('mouseout', up);
}

export const oncursor = (obj, on, off) => {
    obj.on('mouseover', on);
    obj.on('mouseout', off);
}

export const onhover = (obj, on) => {
    obj.on('mouseover', () => {
        obj.on('mousemove', on);
        obj.on('mouseout', () => obj.removeListener('mousemove', on));
    });
}