import React from 'react';
import styles from '../styles/loading.module.css'

function Loading() {
    return (
        <>
            <div className='w-full h-screen flex items-center justify-center'>
                <div className={styles.lds_spinner}>
                    {/* one dive */}
                    <div></div>
                    {/* two dive */}
                    <div></div>
                    {/* three dive */}
                    <div></div>
                    {/* four dive */}
                    <div></div>
                    {/* five dive */}
                    <div></div>
                    {/* six dive */}
                    <div></div>
                    {/* seven dive */}
                    <div></div>
                    {/* eight dive */}
                    <div></div>
                    {/* nine dive */}
                    <div></div>
                    {/* ten dive */}
                    <div></div>
                    {/* eleven dive */}
                    <div></div>
                    {/* twelve */}
                    <div></div>
                </div>
                {/* Loading... */}
            </div>
        </>
    )
}

export default Loading