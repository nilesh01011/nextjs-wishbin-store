import React from 'react';
import styles from '../styles/loadingButton.module.css'

function LoadingButton() {
    return (
        <div className={styles.load}>
            <svg viewBox="20 20 40 40">
                <circle r="10" cy="40" cx="40"></circle>
            </svg>
        </div>
    )
}

export default LoadingButton