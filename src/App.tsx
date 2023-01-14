import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense


function App() {
  let x = 50;
	const y = 50;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(800, 800).parent(canvasParentRef);
	};

	const draw = (p5: p5Types) => {
		p5.background(100);
		p5.ellipse(x, y, 90, 90);
		x++;
	};
  const ssetup = (p5: any, canvasParentRef : Element) => {
    cnv = p5.createCanvas(x, y).parent(canvasParentRef)
    cnv.mousePressed((event) => {
      console.log("Clicked on the canvas. Event:", event)
    })
  }
  
  return (
    <div className="App">
      
      <Sketch setup={setup} draw={draw} />;

    </div>
  );
}

export default App;
