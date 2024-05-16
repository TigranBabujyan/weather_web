import React, { useState } from 'react';
import './index.css'

interface ToggleProps {
    initial?: boolean;
    onChange?: (state: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ initial = false, onChange }) => {
    const [state, setState] = useState(initial);

    const toggle = () => {
        setState(!state);
        if (onChange) {
            onChange(!state);
        }
    };

    return (
        <div>
            <input id="switch" type="checkbox" checked={state} onChange={toggle} />
            <label htmlFor="switch">{state ? 'On' : 'Off'}</label>
        </div>
    );
};

export default ToggleSwitch;
