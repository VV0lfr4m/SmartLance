import styles from '../styles/Button.module.css';
import {useCallback, useState} from 'react';


function Button({text, className, onClick, disabled}) {
    return <button className={className} onClick={onClick} disabled={disabled}>{text}</button>;
}

export default Button;
