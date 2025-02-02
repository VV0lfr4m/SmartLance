import styles from '../styles/Button.module.css';
import {useCallback, useState} from 'react';


function Button({text}) {
    const handleClick = useCallback(() => {
        setCount((prevCount) => prevCount + 1);
        alert('You clicked me!');
    }, []) ;

    const [count, setCount] = useState(0);
    return <button className={styles.button} onClick={handleClick}>{text} and you have clicked {count} times</button>;
}

export default Button;
