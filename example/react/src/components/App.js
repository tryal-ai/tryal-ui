import React from 'react';
import TryalUI from './TryalUI';
import styles from './style.css';

const App = () => {
    return (
        <div className={styles.gutter}>
            <h1>Tryal UI React Demo</h1>
            <TryalUI />
        </div>  
    );
};

export default App;