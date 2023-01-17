import React, {useState} from 'react';
import Sketch from "react-p5";
import p5Types from "p5";
import './Dashboard.css';

class Node {
  x: number;
  y : number;
  visited : boolean;
  f : number;
  g : number;
  h : number;
  index: number;
  // _parent: Node;
  
  constructor(_x : number, _y : number, _visited : boolean, _index : number) {
    this.x = _x;
    this.y = _y;
    this.visited = _visited;
    this.index = _index;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    // this._parent = new Node(0, 0, false, 0);
;  }
  setX(x : number) { this.x = x;  }
  setY(y : number) { this.y = y;  }
  setF(f : number) {  this.f = f; }
  setf() {  this.f = Math.abs(this.g * this.h) }
  setG(g : number) {  this.g = g; }
  setH(h : number) {  this.h = h; }
  setVisited(visited : boolean) {  this.visited = visited; }
  // setParent(parent : Node) {  this._parent = parent; }

  getX() { return this.x; }
  getY() { return this.y; }
  getF() { return this.f; }
  getG() { return this.g; }
  getH() { return this.h; }
  getVisited() { return this.visited; }
  // getParent() { return this._parent; }

}

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

// 
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
//
  const setWalls = (p5: p5Types) => {
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
  }
  const visualiziation = (p5: p5Types, _queue : any) => {
    // _queue is the path
    var x = 13 * 20 - 20;
    var y = 10 * 20 - 20;
    var dx2 = 71 * 20 - 20 ;
    var dy2 = 39 * 20 - 20;

    // draw path
    while (_queue.length > 0)
    {
      var current = _queue[_queue.length - 1].index
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
//
  const Algo = (p5 : p5Types) => {
    
    // white 0; red 2; green 3; brown 4; yellow 8;  black;
    // init default variables
      setWalls(p5)
      var x = 13 * 20 - 20;
      var y = 10 * 20 - 20;
      var dx2 = 71 * 20 - 20 ;
      var dy2 = 39 * 20 - 20;
      //
      const unit = 20;
      // 
      var Nodes = new Array(Xb * Yb).fill(Node)
      var _queue = new Array()
      var _start = Math.round(y / unit) * Xb + Math.round(x / unit)
      var _end  = Math.round(dy2 / unit) * Xb + Math.round(dx2 / unit)
      
      // BFS 
      var Closed = new Array()
      var Open = new Array()
      var _visited = new Array(Xb * Yb).fill(false)
      var _current = _start
      
    // set queue
      while (_queue.length > 0) _queue.pop()
      while (Closed.length > 0) Closed.pop()
 
    // step 1
      while (Open.length > 0) Open.pop()
      Nodes[_start]  = new Node(y,x,true, _start)
      Nodes[_start].g = 1
      Nodes[_start].h = _end - _start
      Nodes[_start].f = Nodes[_start].g * Nodes[_start].h
      Open.push(Nodes[_start ])
      _queue.push(Nodes[_start])

      var Step = 0
      while (Open.length > 0 && !isFound)
      {
        if (Step >= 3)
        {
          isFound = true
          break
        }

        console.log("Step : " , Step)
        console.log("Actual Open : " )
        console.table (Open)

        // step 2
        if (Open.length <= 0 ) alert("Open is Empty")
      // step 3
        var min     = Open[0].f,index = 0
        for (let i = 0; i < Open.length; i++)
        {
          if (Open[i].f < min)
          {
            min = Open[i].f
            index = i
          }
        }
        // remove the smallest element from the open list to the closed list
        _current = Open[index].index
        Closed.push(Open[index])
        Open.slice(index, 1)
        console.log("min: " , min , "\ncurrent: " , _current, " ")
        console.log("After Open: " )
        console.table(Open)

        // for (let i = 0; i < Open.length; i++)
        // if node is goal then alert found 
        if (_current === _end)
        {
          alert("Found")
          isFound = true
        }
      // step 4
        // find the neighbors of the current node
        var  Nq = new Array()
        let  tmp = new Node(_current - Xb,_current - Xb,false,_current - Xb)
        let  tmp1 = new Node(_current + 1,_current + 1,false, _current + 1)
        let  tmp2 = new Node(_current + 1,_current + 1,false, _current + Xb)
        let  tmp3 = new Node(_current - 1,_current - 1,false, _current - 1)
        Nq.push(tmp)
        Nq.push(tmp1)
        Nq.push(tmp2)
        Nq.push(tmp3)
      // step 5
        for (let i = 0; i < Nq.length; i++)
        {
          if (Nq[i].index === _end)
            alert("END FOUND")
          if (Nq[i].index >= 0 && Nq[i].index < Xb * Yb && Board[Nq[i].index] !== 4 &&  _visited[Nq[i].index] === false)
          {
            var tmpNode = new Node(Nq[i].y, Nq[i].x, true, Nq[i].index)
            tmpNode.setG((_start - Nq[i].index))
            tmpNode.setH((_end - Nq[i].index))
            tmpNode.setf()
            Open.push(tmpNode)
            _visited[Nq[i].index] = true
          }
        }
        Step++
        console.table("Closed", Closed)
        console.table("---------------------")
      }
      // step 6
      for (let i = 0; i < Closed.length; i++)
        _queue.push(Closed[i])
      visualiziation(p5, _queue)
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
    if (p5.key === 'ñ' || p5.key === ';')
    {
      Algo(p5)
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