import React from 'react';
import { useReader } from '../contexts/ReaderContext';
import { FiType, FiMaximize, FiAlignLeft, FiDroplet, FiSun } from 'react-icons/fi';

function DyslexiaControls() {
  const { settings, updateSettings } = useReader();

  // Font family options
  const fontOptions = [
    { value: 'OpenDyslexic, sans-serif', label: 'OpenDyslexic' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
  ];

  // Color themes for dyslexia
  const colorThemes = [
    { bg: '#FFFAF0', text: '#000000', name: 'Cream' },
    { bg: '#F0FFF0', text: '#000000', name: 'Light Mint' },
    { bg: '#F5F5F5', text: '#000000', name: 'Light Grey' },
    { bg: '#2D2D2D', text: '#FFFFFF', name: 'Dark Mode' },
    { bg: '#FFF0F5', text: '#000000', name: 'Light Pink' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FiType className="mr-2" /> Reading Settings
      </h2>
      
      {/* Font Family */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Font</label>
        <select 
          value={settings.fontFamily}
          onChange={(e) => updateSettings({ fontFamily: e.target.value })}
          className="w-full p-2 border rounded"
        >
          {fontOptions.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Font Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 flex items-center">
          <FiMaximize className="mr-2" /> Font Size: {settings.fontSize}px
        </label>
        <input 
          type="range" 
          min="16" 
          max="32" 
          value={settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
      
      {/* Letter Spacing */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 flex items-center">
          <FiAlignLeft className="mr-2" /> Letter Spacing
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          value={settings.letterSpacing}
          onChange={(e) => updateSettings({ letterSpacing: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>
      
      {/* Line Height */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Line Height</label>
        <input 
          type="range" 
          min="1.2" 
          max="2.5" 
          step="0.1"
          value={settings.lineHeight}
          onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>
      
      {/* Color Themes */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 flex items-center">
          <FiDroplet className="mr-2" /> Color Theme
        </label>
        <div className="flex flex-wrap gap-2">
          {colorThemes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => updateSettings({ 
                backgroundColor: theme.bg, 
                textColor: theme.text 
              })}
              className={`w-8 h-8 rounded-full border-2 ${
                settings.backgroundColor === theme.bg ? 'border-blue-500' : 'border-gray-200'
              }`}
              style={{ backgroundColor: theme.bg }}
              title={theme.name}
            />
          ))}
        </div>
      </div>
      
      {/* Highlight Current Line */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.highlightCurrentLine}
            onChange={(e) => updateSettings({ highlightCurrentLine: e.target.checked })}
            className="mr-2"
          />
          <span>Highlight Current Line</span>
        </label>
      </div>
      
      {/* Reset Button */}
      <button
        onClick={() => updateSettings({
          fontFamily: 'OpenDyslexic, sans-serif',
          fontSize: 18,
          letterSpacing: 0.5,
          lineHeight: 1.8,
          paragraphSpacing: 2,
          textColor: '#000000',
          backgroundColor: '#FFFAF0',
          highlightCurrentLine: true,
        })}
        className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
      >
        Reset to Default
      </button>
    </div>
  );
}

export default DyslexiaControls;