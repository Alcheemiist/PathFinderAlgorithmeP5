import React, {useState} from 'react';
import Sketch from "react-p5";
import p5Types from "p5";
import './Dashboard.css';
import { wait } from '@testing-library/user-event/dist/utils';

const   width = 1440;
const   height = 800;
const   Xb = width / 20;
const   Yb = height / 20;

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
  var     exp = false;
  var     sep = false;
  var     isFound = false;
  let     Board =  new Array(Xb * Yb).fill(0);

  // acces with Board[y * Xb + x]
  var state = {
    board:{
      Xb: Xb,
      Yb: Yb,
      Board: Board
    },
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
    p5.frameRate(1000);
		p5.background('#222222')

    for (let i = 0; i < 1400; i+=20) {
      p5.line(i, 0, i, 1400);
    }
    for (let i = 0; i < 680; i+=20) {
      p5.line(0, i, 1400, i);
    }

    state.board.Board = Board;
    state.board.Xb = Xb;
    state.board.Yb = Yb;
  }
  const infoBoard = (p5: p5Types) => {
    p5.fill("white");
    if (exp || sep)
      p5.rect(0, 0, 230, 200);
    else 
      p5.rect(0, 0, 230, 150);
    p5.fill("darkblue");
    p5.stroke("darkblue");
    p5.text("Xb : " + Xb + " , Yb :" + Yb , 130,20);
    p5.text("key pressed : [ " + p5.key + " ]", 20,20);
    p5.text("mouse presse : [" + p5.mouseIsPressed + "]", 20,40);
    p5.text("Press s : select first square", 20,60);
    p5.text("Press e : select second square", 20,80);
    p5.text("Press w : select wall square", 20,100);
    p5.text("Press p : Use Path Finder", 20,120);
    p5.text("Press r : Reset", 20,140);
    if (sep)
    {
      p5.text("Y : " + state.data.sepY + ", " + state.data.sepX, 20,170)
    }
    if (exp)
    {
      p5.text("X : " + state.data.expY + ", " + state.data.expX, 20,190)
    }
  }
  const drawBoardElements = (p5: p5Types ) => {
    for (let i = 0; i < Xb; i++) 
      for (let j = 0; j < Yb; j++) 
      {
        // white 0; red 2; green 3; brown 4; yellow 8;  black;
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
        else if (Board[j * Xb + i] === 8)
        {
          p5.fill("orange");
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
      p5.square(x, y, 20)
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
      let curr = 0
      while (curr < Board.length)
      {
        if (Board[curr] === 8)
          Board[curr] = 0;
          curr++
      }

    }
    if (p5.key === 'p' && exp === true && sep === true && isFound === false)
    {
      FindYourPath(state, p5);
      isFound = true;
    }
    if (p5.key === 'ñ')
    {
      // init default variables 
      var x = 13 * 20 - 20;
      var y = 10 * 20 - 20;
      var dx2 = 71 * 20 - 20 ;
      var dy2 = 39 * 20 - 20;
      p5.fill("orange");
      p5.square(x, y, 20);
      p5.fill("grey");
      p5.square(dx2, dy2, 20);
      // walls 
      for (var i = 0; i < 20; i++)
        Board[(10 + i) * Xb + 29] = 4;

      // BFS 
      // white 0; red 2; green 3; brown 4; yellow 8;  black;
      const unit = 20;
      const _board = Board
      var _visited = new Array(Xb * Yb).fill(false)
      var _queue = new Array()
      var _queue1 = new Array()
      var _path = new Array()
      var _parent = new Array(Xb * Yb).fill(-1)
      var _start = Math.round(y / unit) * Xb + Math.round(x / unit)
      var _end = Math.round(dy2 / unit) * Xb + Math.round(dx2 / unit)
      var _current = _start

      // set queue
      while (_queue.length > 0) _queue.pop()
      while (_queue1.length > 0) _queue1.pop()
      while (_path.length > 0) _path.pop()
      while (_parent.length > 0) _parent.pop()

      var dis = _end - _start
      var dir = dis > 0 ? 1 : -1
      dis = Math.abs(dis)
    
      _queue.push(_start)
      _visited[_start] = true


      BFS()


      // draw path
      while (_queue.length > 0)
      {
        var current = _queue[_queue.length - 1]
        // p5.fill("orange");
        // p5.square((current % Xb) * unit, Math.floor(current / Xb) * unit, unit);
        Board[current] = 8;
        _queue.pop()
      }
      // drawing squars
      p5.fill("green");
      p5.square(x, y, 20);
      p5.fill("grey");
      p5.square(dx2, dy2, 20);
    }
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
const FindYourPath = (X : Props, p5: p5Types) => {

  let x = X.data.expX;
  let y = X.data.expY;
  let x2 = X.data.sepX;
  let y2 = X.data.sepY;

  p5.line(x + 10, y + 10, x2 + 10, y2 + 10);
}

interface Point {
  i: number;
  j: number;
}

function BFS ()
{

  // var dx :   = {{1, 1, 1, 0, 0, -1, -1, -ç1}  //Arrays for up, down, right, left movement
  // var dy : number   = {-1, 0, 1, -1, 1, -1, 0, 1}

// public static void main(String[] args) {
//       int[][] traverse = {
//           {1,  2,  3,  4,  5},
//           {6,  7,  8,  9,  10},
//           {11, 12, 13, 14, 15},
//           {16, 17, 18, 19, 20},
//           {21, 22, 23, 24 ,25}
//       }; //The array to traverse

//       boolean[][] visited = new boolean[5][5]; //Visited boolean array
//       Queue<Point> q = new LinkedList<>();
//       q.add(new Point(2, 2));
//       visited[2][2] = true; //setting the start cell as visited
  var Point : Point = {i: 0, j: 0}
  var dx = [1, 0, -1, 0];
  var dy = [0, 1, 0, -1];
  const traverse = [
    [1,  2,  3, 4 , 5],
    [6,  7,  8,  9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24 ,25]
  ]

  var visited = new Array(5 * 5).fill(false)
  var q = new Array()

  Point.i = 0;
  Point.j = 0;
  q.push(Point)
  visited[0] = true
  

  // while (q.length > 0)
  // {
  //   let s = q.length
  //   for (let i = 0; i < s; i++)
  //   {
  //     Point = q.shift()
  //     console.log(traverse[Point.i][Point.j])
     
  //     for (let j = 0; j < 4; j++)
  //     {
  //       let newi = Point.i + dx[j]
  //       let newj = Point.j + dy[j]
        
  //       if (newi < 0 || newi >= traverse.length || newj < 0 || newj >= traverse[0].length) continue;
  //       if (visited[newi + newj]) continue;
        
  //       q.push({i: newi, j: newj})
  //       visited[newi + newj] = true
  //     }
  //     console.log(" , ")
  //   }
  // }
  // alert("End")
  // console.log(" End ")

  return (
    <h1>
      Hello  Worldasdasdasdaerluighalyejsbgrjkahsebfgjahsbefjh
    </h1>
  );
}