import React, { useEffect, useState } from 'react';
import { useCanvasStore } from '../../state/UserAndGameState';



const ColorPalette = () => {

  const colors = [
    "#000000", // Black
  "#FF0000", // Red
  "#FF9900", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#00FFFF", // Cyan
  "#0000FF", // Blue
  "#9900FF", // Purple
  "#FF00FF", // Magenta
  "#C0C0C0", // Gray
];


  const {setStrokeColor} = useCanvasStore()

  return (
    <div className="flex flex-row">
      {
        colors.map((color) => (
          <button key={color} className='w-fit h-fit' onClick={() => setStrokeColor(color)}>
          <div className={`w-10 h-10 mx-2 rounded-full cursor-hover`} style={{backgroundColor: color}}/>
          </button>
        ))
      }

    </div>
  );
};

export default ColorPalette;