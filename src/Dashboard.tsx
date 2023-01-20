import React, {useState} from 'react';
import Sketch from "react-p5";
import p5Types from "p5";
import './Dashboard.css';
import { isJSDocReturnTag } from 'typescript';

class Node {
  x: number;
  y : number;
  visited : boolean;
  f : number;
  g : number;
  h : number;
  index: number;
  parent: any
  constructor(_x : number, _y : number, _visited : boolean, _index : number) {
    this.x = _x;
    this.y = _y;
    this.visited = _visited;
    this.index = _index;
    this.f = 0;
    this.g = 0;
    this.h = 0;
;  }
  setF(f : number) {  this.f = f; }
  setf() {  this.f = Math.abs(this.g + this.h) }
  setG(g : number) {  this.g = g; }
  setH(h : number) {  this.h = h; }
  setVisited(visited : boolean) {  this.visited = visited; }
}
// Board Data
const UnitGrid = 40
const   width = 1440
const   height = 800
const   Xb = width / UnitGrid
const   Yb = height / UnitGrid

var Xpointx = 0
var Xpointy = 0
var Ypointy = 0
var Ypointx = 0
export interface Props {
  data: {
    expX: number
    expY: number
    sepX: number
    sepY: number
  }
}
var _queue = new Array()

export default function Dashboard()
{
  var     exp = false;
  var     sep = false;
  var     isFound = false;
  let     Board =  new Array(Xb * Yb).fill(0);
  var     Step = 0
  // acces with Board[y * Xb + x]
  var      state = {
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
    },
  }
  const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(width, height).parent(canvasParentRef);
    p5.stroke(50); // Set line drawing color to white
    p5.frameRate(10);
		p5.background('#222222')

    for (let i = 0; i < 1400; i+=UnitGrid) {
      p5.line(i, 0, i, 1400);
    }
    for (let i = 0; i < 680; i+=UnitGrid) {
      p5.line(0, i, 1400, i);
    }

    state.board.Board = Board;
    state.board.Xb = Xb;
    state.board.Yb = Yb;
    for (let i = 0; i < Xb * Yb; i++) {
      if (i % Xb == 0 || i < Xb || i > Xb * (Yb - 1) || i % Xb == Xb - 1)
        Board[i] = 1;
    }
  }
  const infoBoard = (p5: p5Types) => {
    p5.fill("white");
    p5.rect(0, 0, 200, 240);

    p5.fill("darkblue");
    p5.stroke("darkblue");
    p5.text("Press r : Reset", 20,140);
    p5.text("mouse presse : [" + p5.mouseIsPressed + "]", 20,40);
    p5.text("/ Xb : " + Xb , 145,20);
    p5.text("/ Yb : " + Yb , 145, 40)
    p5.text("key pressed : [ " + p5.key + " ]", 20,20);
    p5.text("Press s : select first square", 20,60);
    p5.text("Press e : select second square", 20,80);
    p5.text("Press w : select wall square", 20,100);
    p5.text("Press p : Use Path Finder", 20,120);
    p5.text("Press Q : Remove Walls", 20,160);
    if (sep)
    {
      p5.text("Ygreen : " + state.data.sepY + ", " + state.data.sepX, 20,190)
    }
    if (exp)
    {
      p5.text("Xred   : " + state.data.expY + ", " + state.data.expX, 20,210)
    }
  }
  const drawBoardElements = (p5: p5Types ) => {
    for (let i = 0; i < Xb * Yb; i++) {
      if (i % Xb == 0 || i < Xb || i > Xb * (Yb - 1) || i % Xb == Xb - 1)
        Board[i] = 1;
    }
    for (let i = 0; i < Xb; i++) 
      for (let j = 0; j < Yb; j++) 
      {
        // white 0; red 2; green 3; brown 4; yellow 8;  black;
        if (Board[j * Xb + i] === 0){
          p5.fill("white");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 1){
          p5.fill("black");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 2)
        {
          p5.fill("red");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.text(" X ", i * UnitGrid+ 3, j * UnitGrid+ 16);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 3)
        {
          p5.fill("green");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.text(" Y ", i * UnitGrid+ 3, j * UnitGrid+ 16);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 4)
        {
          p5.fill("brown");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 5)
        {
          p5.fill("#0c9d0e20");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 8)
        {
          p5.fill("#d4a6747c");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (Board[j * Xb + i] === 9)
        {
          p5.fill("#750f8520");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else
        {
          p5.fill("black");
          p5.square(i * UnitGrid, j * UnitGrid, UnitGrid);
          p5.noFill();
        }
      }
    if (isFound)
    {
      p5.fill("black");
    }
    infoBoard(p5);
  }
  const visualiziation = (p5: p5Types, _queue : any, path : any) => {
    // trace path

    var chemin = _queue
    var begin = chemin[1].index
    var last = chemin[chemin.length - 1].index
      
      var _point = chemin[1].index
      Board[_point] = 9

      console.log("first child index ", chemin[1].index , " , ", _point + 1)

      var save = 2
      for (let j = 0; j < 1 ; j++)
      {
        if (_point === last)
          break
        var parent_number = 0
        for (let i = 2; i < chemin.length ; i++)
        {
          // console.log(" child " , i, " :", chemin[i].index, " point :",  _point + 1 , " " , _point - 1 , " " ,_point - Xb, " " , _point + Xb)
          if (chemin[i].index === _point + 1 || chemin[i].index === _point - 1 || chemin[i].index === _point + Xb || chemin[i].index === _point - Xb)
          {
            Board[chemin[i].index] = 9
            _point = chemin[i].index
            chemin.splice(i, 1)
            save = i
            parent_number++
            console.log("found parent",  parent_number," index ", chemin[i].index )
            // break
          }
          // if (parent_number >= 1)
          //   break


        }
        console.log("number of child found = " , parent_number)
      }

      //   while ()
      //   {
      //     if ()
      //     console.log(" child 2 :", _point, " : ",  _point + 1 , " " , _point - 1 , " " ,_point - Xb, " " , _point + Xb)
          
      //     for (let i = 2; i < _queue.length ; i++)
      //     {
      //       console.log(" index :", _queue[i].index, " point :",  _point + 1 , " " , _point - 1 , " " ,_point - Xb, " " , _point + Xb)
      //       if (_queue[i].index === _point + 1 || _queue[i].index === _point - 1 || _queue[i].index === _point + Xb || _queue[i].index === _point - Xb)
      //       {
      //         Board[_queue[i].index] = 9
      //         console.log("found parent index ", _queue[i].index )
      //         break
      //       }
      //     }
      // }




    // draw path
    alert("visualiziation  Q : " + _queue.length + " P : " + path.length);
    for (let i = 0; i < _queue.length ; i++)
    {
      var current = _queue[i].index
      // p5.fill("orange");
      // p5.square((current % Xb) * unit, Math.floor(current / Xb) * unit, unit);
      if (Board[current] !== 9 && Board[current] !== 3 && Board[current] !== 2 && Board[current] !== 4 && Board[current] !== 1)
          Board[current] = 8;
    }
    // for (let i = 0; i < path.length ; i++)
    // {
    //   var current = path[i].index
    //   if (Board[current] !== 3 && Board[current] !== 2 && Board[current] !== 4 &&  Board[current] !== 1)
    //       Board[current] = 9;
    // }
    p5.fill("green");
    p5.square(Ypointx, Ypointy, UnitGrid);
    p5.fill("red");
    p5.square(Xpointx, Xpointy, UnitGrid);    
  }
//
  const Algo = (p5 : p5Types) => {
    // white 0; red 2; green 3; brown 4; yellow 8;  black;
      // 
      var Nodes = new Array(Xb * Yb).fill(Node)
      var _start = Math.round(Xpointy / UnitGrid) * Xb + Math.round(Xpointx / UnitGrid)
      var _end  = Math.round(Ypointy / UnitGrid) * Xb + Math.round(Ypointx / UnitGrid)
      
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
      Nodes[_start]  = new Node(Xpointy,Xpointx,true, _start)
      Nodes[_start].g = 1
      Nodes[_start].h = _end - _start
      Nodes[_start].f = Nodes[_start].g + Nodes[_start].h
      Open.push(Nodes[_start ])
      _queue.push(Nodes[_start])

      while (Open.length > 0 && !isFound)
      {
      // step 2
        if (Open.length <= 0 ) alert("Not found")
      // step 3
        var min     = Open[0].f , index = 0
        for (let i = 0; i < Open.length; i++)
        {
          if (Open[i].f < min)
          {
            min = Open[i].f
            index = i
          }
        }
        // remove the smallest element from the open list to the closed list
        _visited[_current] = true
        Open[index].parent = _current
        _current = Open[index].index
        Closed.push(Open[index])
        Open.splice(index, 1)
        // if node is goal then alert found 
        if (_current === _end)
        {
          alert("found")
          isFound = true
          break
        }
      // step 4
        // find the neighbors of the current node
        var  Nq = new Array()
        let  tmp = new Node(_current - Xb,_current - Xb,false,_current - Xb)
        let  tmp1 = new Node(_current + 1,_current + 1,false, _current + 1)
        let  tmp2 = new Node(_current +  Xb,_current + 1,false, _current + Xb)
        let  tmp3 = new Node(_current - 1,_current - 1,false, _current - 1)

        if (!(_current % Xb === 0))
          Nq.push(tmp3)
        if (!((_current % Xb === 0) && ((_current - 1) % Xb === 0)))
          Nq.push(tmp1)
        if (_current > Xb - 1 && _current - Xb > 0) 
          Nq.push(tmp)
        if (_current < Yb * (Xb - 1))
          Nq.push(tmp2)
        if (Nq.length <= 0) alert("Not found")
      // step 5
        var selecteN = new Array()
        for (let i = 0; i < Nq.length; i++)
        {
          if (Nq[i].index === _end)
          {
            alert("found")
            isFound = true
            break
          }
          if (Nq[i].index >= 0 && Nq[i].index < Xb * Yb && Board[Nq[i].index] !== 4 && Board[Nq[i].index] !== 1 &&  _visited[Nq[i].index] === false)
          {
            var tmpNode = new Node(Nq[i].y, Nq[i].x, true, Nq[i].index)
            const IndexO = Nq[i].index
            //- 
            var height_start = _start / Xb // 0 - Xb
            var height_end = _end / Xb // 0 - Xb
            var heightIndexO = IndexO / Xb // 0 - Xb
            // 
            var width_start = _start % Xb  // 0 - Yb
            var width_end = _end % Xb  // 0 - Yb
            var widthIndexO = IndexO % Xb  // 0 - Yb
            //  
            var DirH = Math.abs(widthIndexO - width_end)
            var DirV = Math.abs(heightIndexO - height_end)
            // 
            var Dh = Math.abs(widthIndexO - width_start)
            var Dv = Math.abs(heightIndexO - height_start)
            //
            var tmpG = Math.abs(IndexO - _start) * 1
            var tmpH = Math.abs(_end - IndexO) * 1

            tmpG = DirH +  Dh 
            tmpH = DirV +  Dv 

            tmpNode.setG(tmpG)
            tmpNode.setH(tmpH)
            tmpNode.setf()
            selecteN.push(tmpNode)
            Open.push(tmpNode)

          }
          _visited[Nq[i].index] = true
        }
        if (selecteN.length >= 0)
          continue
        var minf =  selecteN[0].f
        var minidex = 0
        for (let i = 0 ; i < selecteN.length; i++)
        {
          if (minf > selecteN[i].f )
           {
            minf =  selecteN[i].f 
            minidex = i
           } 
        }

        Step++
      }
      // step 6
      for (let i = 0; i < Closed.length; i++)
        _queue.push(Closed[i])
      alert("Queu Lenght " + _queue.length )
      // // trace Path
      var path = new Array()
      for (let i = 0; i < 20; i++)
        path.push(Closed[i])
      visualiziation(p5, _queue, path)
  }
  const handleAction = (p5: p5Types) => {
    if (p5.key === 's' && exp === false)
    {
      p5.fill("red");
      let x = Math.round(p5.mouseX / UnitGrid) * UnitGrid;
      let y = Math.round(p5.mouseY / UnitGrid) * UnitGrid;
      if (Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] !== 1)
        p5.square(x, y, UnitGrid)

      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT && Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] !== 1)
      {
        p5.fill("yellow");
        p5.square(x, y, UnitGrid);
        Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] = 2;
        exp = true;
        state.data.expX = x;
        state.data.expY = y;
        p5.text("X : " + x + ", " + y, UnitGrid,170);
        Xpointx = x
        Xpointy = y
      }
    }
    if (p5.key === 'e' && sep === false)
    {
      p5.fill("green");
      let x = Math.round(p5.mouseX / UnitGrid) * UnitGrid;
      let y = Math.round(p5.mouseY / UnitGrid) * UnitGrid;
      if (Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] !== 1)
          p5.square(x, y, UnitGrid);
      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT && Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] !== 1)
      {
        p5.fill("yellow");
        p5.square(x, y, UnitGrid);
        Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] = 3;
        sep = true;
        state.data.sepX = x;
        state.data.sepY = y;
        p5.text("Y : " + x + ", " + y, UnitGrid,190);
        Ypointx = x
        Ypointy = y
      }
    }
    if (p5.key === 'w')
    {
      p5.fill("brown");
      let x = Math.round(p5.mouseX / UnitGrid) * UnitGrid;
      let y = Math.round(p5.mouseY / UnitGrid) * UnitGrid;
      if (Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] !== 1)
        p5.square(x, y, UnitGrid);
      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT && Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] !== 1)
      {
        p5.fill("yellow");
        p5.square(x, y, UnitGrid);
        Board[Math.round(y / UnitGrid) * Xb + Math.round(x / UnitGrid)] = 4;
        sep = true;
      }
   
    }
    if (p5.key === 'r')
    {
      exp = false;
      sep = false;
      isFound = false;
      _queue = []
      let curr = 0
      while (curr < Board.length)
      {
        if (Board[curr] === 8 || Board[curr] === 9 || Board[curr] === 2 || Board[curr] === 3)
          Board[curr] = 0;
          curr++
      }
    }
    if (p5.key === 'p' && exp && sep && !isFound)
    {
      Algo(p5)
      isFound = true;
    }
    if (p5.key === 'q')
    {
      let curr = 0
      while (curr < Board.length)
      {
        if (Board[curr] === 4)
          Board[curr] = 0;
          curr++
      }
    }
    if (p5.key === 'ñ' || p5.key === ';')
    {
    }
  }
  const draw = (p5: p5Types) => {
    drawBoardElements(p5)
    handleAction(p5)
	}
  return(
    <div className='board'>
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}