import styles from '../styles/Button.module.css';
import {useCallback, useState} from 'react';


function Button({text, className}) {
    const handleClick = useCallback(() => {
        setCount((prevCount) => prevCount + 1);
        alert('You clicked me!');
    }, []) ;

    return <button className={className} onClick={handleClick}>{text}</button>;
}

export default Button;
