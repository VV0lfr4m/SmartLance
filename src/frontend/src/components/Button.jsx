import styles from '../styles/Button.module.css';
import {useCallback, useState} from 'react';


function Button({text}) {
    const handleClick = useCallback(() => {
        setCount((prevCount) => prevCount + 1);
        alert('You clicked me!');
    }, []) ;

    return <button className={styles.button} onClick={handleClick}>{text}</button>;
}

export default Button;
