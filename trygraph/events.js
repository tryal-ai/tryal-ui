
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