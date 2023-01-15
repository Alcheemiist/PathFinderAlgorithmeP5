import React, {useState} from 'react';
import Sketch from "react-p5";
import p5Types from "p5";
import './Dashboard.css';

export interface Props {
  data: {
    // name: string;
    expX: number;
    expY: number;
    sepX: number;
    sepY: number;
  }
}
export default function Dashboard()
{
  const   width = 1440;
	const   height = 800;
  const   Xb = width / 20;
  const   Yb = height / 20;
  var     exp = false;
  var     sep = false;
  var     isFound = false;
  let     Board =  new Array(Xb * Yb).fill(0);
  var state = {
    data :  {  
      expX: 0,
      expY: 0,
      sepX: 0,
      sepY: 0
    }
  }
  
  const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(width, height).parent(canvasParentRef);
    p5.stroke(50); // Set line drawing color to white
    p5.frameRate(30);
		p5.background('#222222')
    for (let i = 0; i < 1400; i+=20) {
      p5.line(i, 0, i, 1400);
    }
    for (let i = 0; i < 680; i+=20) {
      p5.line(0, i, 1400, i);
    }
    for (let i = 0; i < Xb; i++) 
    {
      for (let j = 0; j < Yb; j++) 
      {
        if (Board[j * Xb + i] === 0){
          p5.fill("white");
          p5.square(i * 20, j * 20, 20);
          p5.noFill();
        }
        else
        {
          p5.fill("black");
          p5.square(i * 20, j * 20, 20);
          p5.noFill();
        }
      }
    }
  }
  const infoBoard = (p5: p5Types) => {
    p5.fill("white");
    if (exp || sep)
      p5.rect(0, 0, 200, 200);
    else 
      p5.rect(0, 0, 200, 150);
    p5.fill("darkblue");
    p5.stroke("darkblue");
    p5.text("key pressed : [ " + p5.key + " ]", 20,20);
    p5.text("mouse presse : [" + p5.mouseIsPressed + "]", 20,40);
    p5.text("Press s : select first square", 20,60);
    p5.text("Press e : select second square", 20,80);
    p5.text("Press w : select wall square", 20,100);
    p5.text("Press p : Use Path Finder", 20,120);
    p5.text("Press r : Reset", 20,140);
    if (sep)
    {
      p5.text("X : " + state.data.sepY + ", " + state.data.sepX, 20,170)
    }
    if (exp)
    {
      p5.text("Y : " + state.data.expY + ", " + state.data.expX, 20,190)
    }
  }
  const drawBoardElements = (p5: p5Types ) => {
  
    p5.background('#222222')
    for (let i = 0; i < Xb; i++) 
      {
        for (let j = 0; j < Yb; j++) 
        {
          if (Board[j * Xb + i] === 0){
            p5.fill("white");
            p5.square(i * 20, j * 20, 20);
            p5.noFill();
          }
          else if (Board[j * Xb + i] === 2)
          {
            p5.fill("red");
            p5.square(i * 20, j * 20, 20);
            p5.text(" X ", i * 20 + 3, j * 20 + 16);
            p5.noFill();
          }
          else if (Board[j * Xb + i] === 3)
          {
            p5.fill("green");
            p5.square(i * 20, j * 20, 20);
            p5.text(" Y ", i * 20 + 3, j * 20 + 16);
            p5.noFill();
          }
          else if (Board[j * Xb + i] === 4)
          {
            p5.fill("brown");
            p5.square(i * 20, j * 20, 20);
            p5.noFill();
          }
          else
          {
            p5.fill("black");
            p5.square(i * 20, j * 20, 20);
            p5.noFill();
          }
        }
    }
    if (isFound)
    {
      p5.fill("black");
      FindYourPath(state, p5);
    }
    infoBoard(p5);
  }
  const handleAction = (p5: p5Types) => {
    if (p5.key === 's' && exp === false)
    {
      p5.fill("red");
      let x = Math.round(p5.mouseX / 20) * 20;
      let y = Math.round(p5.mouseY / 20) * 20;
      console.log("hello " , x, y);
      p5.square(x, y, 20);
      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT)
      {
        p5.fill("yellow");
        p5.square(x, y, 20);
        Board[Math.round(y / 20) * Xb + Math.round(x / 20)] = 2;
        exp = true;
        state.data.expX = x;
        state.data.expY = y;
        p5.text("X : " + x + ", " + y, 20,170);

        // setstate({
        //   data :  { 
        //     expX: state.data.expX,
        //     expY: state.data.expY,
        //     sepX: x,
        //     sepY: y,
        //   }})
      }
    }
    if (p5.key === 'e' && sep === false)
    {

      p5.fill("green");
      let x = Math.round(p5.mouseX / 20) * 20;
      let y = Math.round(p5.mouseY / 20) * 20;
      console.log("hello " , x, y);
      p5.square(x, y, 20);

      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT)
      {
        p5.fill("yellow");
        p5.square(x, y, 20);
        Board[Math.round(y / 20) * Xb + Math.round(x / 20)] = 3;
        sep = true;
        state.data.sepX = x;
        state.data.sepY = y;
        p5.text("Y : " + x + ", " + y, 20,190);

        // setstate({
        //   data :  {  
        //     expX: x,
        //     expY: y,
        //     sepX: state.data.sepX,
        //     sepY: state.data.sepY,
        //   }})
      }
    }
    if (p5.key === 'w')
    {
      p5.fill("brown");
      let x = Math.round(p5.mouseX / 20) * 20;
      let y = Math.round(p5.mouseY / 20) * 20;
      console.log("hello " , x, y);
      p5.square(x, y, 20);

      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT)
      {
        p5.fill("yellow");
        p5.square(x, y, 20);

        // if (Board[Math.round(y / 20) * Xb + Math.round(x / 20)] == 4)
        //   Board[Math.round(y / 20) * Xb + Math.round(x / 20)] = 0;
        // else
          Board[Math.round(y / 20) * Xb + Math.round(x / 20)] = 4;

          sep = true;
      }
   
    }
    if (p5.key === 'r')
    {
      exp = false;
      sep = false;
      isFound = false;

      for (let i = 0; i < Xb; i++) 
      {
        for (let j = 0; j < Yb; j++) 
          if (Board[j * Xb + i] === 2 || Board[j * Xb + i] === 3 || Board[j * Xb + i] === 4)
            Board[j * Xb + i] = 0;
      }
    }
    if (p5.key === 'p' && exp === true && sep === true && isFound === false)
    {
      FindYourPath(state, p5);
      isFound = true;
    }
  }
  const FindYourPath = (X : Props, p5: p5Types) => {
    // console.log("X = " + X[0] + ", " + X[1]);
    // console.log("Y = " + Y[0] + ", " + Y[1]);
    // alert("X = " + X[0] + ", " + X[1]);
    // alert("Y = " + Y[0] + ", " + Y[1]);
    
    let x = X.data.expX;
    let y = X.data.expY;
    let x2 = X.data.sepX;
    let y2 = X.data.sepY;

    p5.line(x + 10, y + 10, x2 + 10, y2 + 10);
    // alert("X "  + X.expX  + " " + X.expY + " \nY " + X.sepX + " " + X.sepY);

  }
	const draw = (p5: p5Types) => {
    drawBoardElements(p5)
    handleAction(p5)
	}
  return(
    <div className='board'>
      <Sketch setup={setup} draw={draw} />
      <VisualizeData data={state.data}/>
      {/* <div className='cordX'>X : {state.data.expX} , {state.data.expX}</div>
      <div className='cordY'>Y : {state.data.sepX} , {state.data.sepY}</div> */}
    </div>
  )
}

function VisualizeData(props: Props)
{
  return (
    <div className='board__info'>
        <div>Dashboard Infos</div>
        <div className='cordX'>X : {props.data.expX} , {props.data.expX}</div>
        <div className='cordY'>Y : {props.data.sepX} , {props.data.sepY}</div>
      </div>);
}


