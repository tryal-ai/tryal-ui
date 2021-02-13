import components from 'components';
import 'styles/global.sass';

window.sessionId = "blank";

document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    const display = document.getElementById('tryalui');
    if (!display) return null;
    display.appendChild(document.createElement("Tryal-Watermark"));
    const comps = Object.keys(components).reduce((prev, name) => {
        const elements = [...display.getElementsByTagName(`Tryal-${name}`)].map(elem => {
            const comp = new components[name]({
                target: display,
                anchor: elem,
                props: {
                    ...elem.dataset,
                    values: elem.dataset.values ? JSON.parse(elem.dataset.values) : null,
                    body: elem.dataset.question ? JSON.parse(elem.dataset.question) : elem.dataset.body,
                    question: null
                } 
            });
            elem.remove();
            return comp;
        });
        return {
            name: elements,
            ...prev,
        };
    }, {});
    window.tryalui = comps;
})
    
export default components    

