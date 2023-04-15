import { TextField } from "@mui/material"
import { useState } from "react";

export const JsonEditor = (props: {
    value: any,
    onChange: (newValue: any) => void,
}) => {
    const initialValue = getInitialValue(props.value);
    let intialText = JSON.stringify(initialValue, null, 2);
    if (intialText === '{}') intialText = `{\n  \n}`
    const [text, setText] = useState(intialText);
    const [error, setError] = useState(false);
    const handleTextChange = (e: any) => {
        console.log('jsonEditor: on text change')
        const val = e.target.value;
        setText(val);
    }
    const handleOnBlur = () => {
        try {
            const obj = JSON.parse(text);
            props.onChange(obj)
            setError(false);
        } catch (error) {
            console.error(error);
            setError(true);
        }
    }
    return <TextField
        fullWidth
        error={error}
        onBlur={handleOnBlur}
        multiline
        value={text}
        onChange={handleTextChange} />
}
const getInitialValue = (val: any) => {
    if (typeof val === 'object') {
        return val
    }
    if (typeof val === 'string') {
        return JSON.parse(val)
    }
    throw new Error('ridi, value must be only object on json string')
}