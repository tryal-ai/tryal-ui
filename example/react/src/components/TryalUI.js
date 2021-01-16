import React from 'react';

import tryalui from 'tryal-ui';

import styles from './style.css';

class TryalUI extends React.Component {
    componentDidMount() {
        const element = document.getElementById("workings");
        const comp = new tryalui.Workings({
            target: element,
        });
    }
    
    render() {
        return <div id="workings"></div>;
    }
}


export default TryalUI;