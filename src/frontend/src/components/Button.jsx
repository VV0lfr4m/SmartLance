import styles from '../styles/Button.module.css';
import {useCallback, useState} from 'react';


function Button({text, className, onClick}) {
    return <button className={className} onClick={onClick}>{text}</button>;
}

export default Button;
