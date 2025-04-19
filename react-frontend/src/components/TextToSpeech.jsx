import React, { useState } from 'react';
import { useReader } from '../contexts/ReaderContext';

function TextToSpeech({ text }) {
    const name = "World";
    const element = <h1>Hello, {name}!</h1>; // Renders "Hello, World!"
}

export default TextToSpeech;