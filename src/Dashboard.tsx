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

const     UnitGrid = 40
const   width = 1440
const   height = 800
const   Xb = width / UnitGrid
const   Yb = height / UnitGrid
var     StartPoint = new Node(0, 0, false, 0)
var     EndPoint = new Node(0, 0, false, 0)
var     exp = false;
var     sep = false;
var     walls = 0
//      eslint-disable-next-line
var     _queue = new Array()
var     isFound = false;

export interface Props {
  data: {
    expX: number
    expY: number
    sepX: number
    sepY: number
  }
}

export default function Dashboard()
{
  // Board Elemenets
  let     BoardElement =  [] as any;
  for (let i = 0; i < Yb; i++)  BoardElement[i] = new Array(Xb).fill(0);
  // Set Border Board
  for (let i = 0; i < Yb; i++)
    {
      for (let j = 0; j < Xb; j++)
      {
        if (i === 0 || i === Yb - 1 || j === 0 || j === Xb - 1) 
          BoardElement[i][j] = 1;
        else 
          BoardElement[i][j] = 0;
      }
  }
  // Board Functions
  const SetBoarder = (p5: p5Types) => {
    // Draw lines 
    for (let i = 0; i < width; i+=UnitGrid) {
      p5.line(i, 0, i, height);
    }
    for (let i = 0; i < height; i+=UnitGrid) {
      p5.line(0, i, width, i);
    }
  }
  const setup = (p5: p5Types, canvasParentRef: Element) => {
		// Init Board
    p5.createCanvas(width, height).parent(canvasParentRef);
    p5.stroke(50); 
    p5.frameRate(10);
		p5.background('#222222')
    SetBoarder(p5)
    drawBoardElements(p5)
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
      p5.text("Yponit : " + EndPoint.x+ ", " + EndPoint.x ,  20,190)
    if (exp)
      p5.text("Xpoint : " + StartPoint.x + " , " + StartPoint.y, 20,210)
    if (walls > 0)
      p5.text("N of walls : " + walls, 20,230)
  }
  const drawBoardElements = (p5: p5Types ) => {
    // Drawing Board
    for (let i = 0; i < Yb; i++)
    {
      for (let j = 0; j < Xb; j++)
      {
        if (BoardElement[i][j] === 3)
        {
          p5.fill("#33ba33");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (BoardElement[i][j] === 2)
        {
          p5.fill("#148ea4");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (BoardElement[i][j] === 1) 
        {
          p5.fill("black");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (BoardElement[i][j] === 4) 
        {
          p5.fill("brown");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (BoardElement[i][j] === 8) 
        {
          p5.fill("#a49fa4");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else if (BoardElement[i][j] === 9) 
        {
          p5.fill("#605461b8");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
        else
        {
          p5.fill("#e4dee4c5");
          p5.square(j * UnitGrid, i * UnitGrid, UnitGrid);
          p5.noFill();
        }
      }
    }
    if (isFound)
       BackTracePath(p5)
    // End Drawing Board
    infoBoard(p5)
    // ArrowSquares(p5, 10,10, 11, 10)
    // ArrowSquares(p5, 11,10, 11, 9)

  }
  const handleAction = (p5: p5Types) => {
    var ypoint = 0
    var xpoint = 0

    if (p5.key === 's' && exp === false)
    {
      p5.fill("#148ea4");
      let x = Math.round(p5.mouseX / UnitGrid) * UnitGrid;
      let y = Math.round(p5.mouseY / UnitGrid) * UnitGrid;
      // if ( BoardElement[Math.round(y / UnitGrid)][Math.round(x / UnitGrid)] === 0)
      p5.square(x, y, UnitGrid)
      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT  )
      {
        ypoint = Math.round(y / UnitGrid)
        xpoint = Math.round(x / UnitGrid)
        if (xpoint >= 0 && xpoint < Xb - 1 && ypoint >= 0 && ypoint < Yb - 1)
        {
          p5.fill("yellow");
          p5.square(x , y, UnitGrid)
          BoardElement[ypoint][xpoint] = 2
          StartPoint.x = Math.round(x / UnitGrid)
          StartPoint.y = Math.round(y / UnitGrid)
          exp = true;
        }
      }
    }
    if (p5.key === 'e' && sep === false)
    {
      
      p5.fill("green");
      let x = Math.round(p5.mouseX / UnitGrid) * UnitGrid;
      let y = Math.round(p5.mouseY / UnitGrid) * UnitGrid;
      // if ( BoardElement[Math.round(y / UnitGrid)][Math.round(x / UnitGrid)] === 0)
          p5.square(x, y, UnitGrid);
      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT )
      {
        ypoint = Math.round(y / UnitGrid)
        xpoint = Math.round(x / UnitGrid)
        if (xpoint >= 0 && xpoint < Xb - 1 && ypoint >= 0 && ypoint < Yb - 1)
        {
          p5.fill("yellow");
          p5.square(x, y, UnitGrid);
          BoardElement[ypoint][xpoint] = 3
          EndPoint.x = Math.round(x / UnitGrid)
          EndPoint.y = Math.round(y / UnitGrid)
          sep = true;
        }
      }
    }
    if (p5.key === 'w')
    {

      p5.fill("brown");
      let x = Math.round(p5.mouseX / UnitGrid) * UnitGrid;
      let y = Math.round(p5.mouseY / UnitGrid) * UnitGrid;
      if ( Math.round(y / UnitGrid) )


      p5.square(x, y, UnitGrid);
      if (p5.mouseIsPressed === true && p5.mouseButton === p5.LEFT )
      {
        ypoint = Math.round(y / UnitGrid)
        xpoint = Math.round(x / UnitGrid)
        if (xpoint >= 0 && xpoint < Xb - 1 && ypoint >= 0 && ypoint < Yb - 1)
        {
          p5.fill("yellow");
          p5.square(x, y, UnitGrid);
          BoardElement[ypoint][xpoint] = 4
          walls++
        }
      }
    }
    if (p5.key === 'r')
    {
      exp = false;
      sep = false;
      isFound = false;
      _queue = []

      for (let i = 0; i < Yb; i++)
        for (let j = 0; j < Xb; j++)
          if (BoardElement[i][j] === 2 || BoardElement[i][j] === 3 ||  BoardElement[i][j] === 9 || BoardElement[i][j] === 8)  
            BoardElement[i][j] = 0;
    }
    if (p5.key === 'p' && exp && sep && !isFound)
    {
      Algo(p5)
      isFound = true;
    }
    if (p5.key === 'q')
    {
      walls = 0;
      for (let i = 0; i < Yb; i++)
        for (let j = 0; j < Xb; j++)
          if (BoardElement[i][j] === 4)  
            BoardElement[i][j] = 0;
    }
    if (p5.key === 'ñ' || p5.key === ';')
    {
    }
  }
  const Algo = (p5 : p5Types) => {
    // white 0; bleu 2; green 3 ; black 1; brown 4; yellow 8;  StartPoint.x StartPoint.y   EndPoint.x EndPoint.y
    var BoardElementNodes = []
    for (let i = 0; i < Yb; i++)  BoardElementNodes[i] = new Array(Xb).fill( new Node(0, 0, false, 0)); 
    // Set Border Board
    for (let i = 0; i < Yb; i++)
      {
        for (let j = 0; j < Xb; j++)
        {
          if (BoardElement[i][j] !==  0) 
            BoardElementNodes[i][j] = new Node(j, i, true, BoardElement[i][j]);
          else 
            BoardElementNodes[i][j] = new Node(j, i, false,BoardElement[i][j]);
        }
    }
    isFound = false
    BoardElementNodes[StartPoint.y][StartPoint.x] = new Node(StartPoint.x, StartPoint.y, true, 2)
    BoardElementNodes[EndPoint.y][EndPoint.x]     = new Node(EndPoint.x, EndPoint.y, true, 3)
    var start   =   BoardElementNodes[StartPoint.y][StartPoint.x]
    var end     =   BoardElementNodes[EndPoint.y][EndPoint.x]
    start.parent = start
    // eslint-disable-next-line
    var Closed = new Array()
    // eslint-disable-next-line
    var Open = new Array()
    while (_queue.length > 0) _queue.pop()
    while (Closed.length > 0) Closed.pop()
    // step 1
    while (Open.length > 0) Open.pop()
    var current = start
    Open.push(current)
    // _queue.push(current)
    current.f = Distance(start.x, start.y, end.x, end.y) 
    var min  = current.f
    // console.log("Start Point : [" + current.x + " , " + current.y + " ] " + Math.round(current.f))
    while (!isFound)
    {
    // step 2
      if (Open.length <= 0 ) 
      {
        // alert("Y Square Not found")
        isFound = false
        break
      }
    // step 3
      var  index = 0
      min = Open[0].f 
      for (let i = 0; i < Open.length; i++)
      {
        if (Open[i].f < min &&  Open[i].index === 0)
        {
          if (current.x === end.x && current.y === end.y)
          {
            // alert("End Square Found")
            isFound = true
            break
          }
          min = Open[i].f
          index = i
        }
      }
      // Open[index].parent = _current
      current = Open[index]
      // console.log("Current Point : " + current.x + " " + current.y + " : " + Math.round(current.f))
      Closed.push(Open[index])
      Open.splice(index, 1)
      if (current.x === end.x && current.y === end.y)
      {
        // alert("End Square Found")
        isFound = true
        break
      }
      // step 4
      // eslint-disable-next-line
      var   Nq = new Array()
      let tmp, tmp1, tmp2, tmp3
      tmp  = BoardElementNodes[current.y  - 1][current.x    ] 
      tmp1 = BoardElementNodes[current.y  + 1][current.x    ]
      tmp2 = BoardElementNodes[current.y     ][current.x + 1]
      tmp3 = BoardElementNodes[current.y     ][current.x - 1]
      // if (current.x - 1 < 0 && current.x >= Xb)
      Nq.push(tmp)
      // if (current.x + 1 > Xb && current.x <= 0)
      Nq.push(tmp1)
      // if (current.y - 1 < 0 && current.y >= Yb)
      Nq.push(tmp2)
      // if (current.y + 1 > Yb && current.y <= 0)
      Nq.push(tmp3)
      if (Nq.length <= 0) alert("Not found")
      // step 5
      for (let i = 0; i < Nq.length; i++)
      {
        if (Nq[i].x === end.x &&  Nq[i].y === end.y)
        {
          // alert("End Square Found")
          isFound = true
          Open.push(Nq[i])
          // Closed.push(Nq[i])
          break
        }
        if (Nq[i] && Nq[i].visited === false && BoardElementNodes[Nq[i].y][Nq[i].x].index === 0)
        {
          var tmpG = Distance(Nq[i].x, Nq[i].y, start.x, start.y)
          var tmpH = Distance(Nq[i].x, Nq[i].y, end.x, end.y)
          var isTurn = true
          if ( (Nq[i].x === current.x &&  Nq[i].x === current.parent.x )||( Nq[i].y === current.y &&  Nq[i].y === current.parent.y))
            isTurn = false
          var sym = isTurn ? (2 * UnitGrid) : 0
          
          Nq[i].visited = true
          Nq[i].setG(tmpG + sym)
          Nq[i].setH(tmpH)
          Nq[i].f =  (tmpG + tmpH)
          Nq[i].parent = current
          Open.push(Nq[i])
        }
      }
    }
    // step 6
    for (let i = 0; i < Closed.length; i++)
      _queue.push(Closed[i])
    visualiziation(p5, _queue)
  }
  const ArrowSquares = (p5 : p5Types,x : number  , y : number, x1: number, y1 : number) => {
    p5.strokeWeight(4);
    p5.line(x * UnitGrid + UnitGrid / 2, y * UnitGrid + UnitGrid / 2, x1 * UnitGrid + UnitGrid / 2, y1 * UnitGrid + UnitGrid / 2)
    p5.strokeWeight(1);
  }

  const BackTracePath = (p5: p5Types) => {
    // PATH TRACING BY PARENTING
    var current 
    if (isFound)
    {
      current = _queue[_queue.length - 1]
      ArrowSquares(p5, current.x, current.y, EndPoint.x, EndPoint.y)

      var dis = 0
      for (let i = 0; dis < _queue.length ; i++)
      {
        dis++
        BoardElement[current.y][current.x] = 9;
        ArrowSquares(p5, current.x, current.y, current.parent.x, current.parent.y)
        current = current.parent
        if (current === undefined || (BoardElement[current.y][current.x] === 2 ))
          break
     
      }

      // eslint-disable-next-line 
      // alert("---- Target Found ----- \nPath distance : " + dis + " unit \n" +"Shortest dist  : " + Math.round(Distance(StartPoint.x, StartPoint.y, EndPoint.x , EndPoint.y)) + " unit " )
    } 
  }
  const visualiziation = (p5: p5Types, _queue : any) => {
  var current
  for (let i = 0; i < _queue.length ; i++)
  {
    current = _queue[i]
    if (BoardElement[current.y][current.x] !== 3 && BoardElement[current.y][current.x] !== 2 && BoardElement[current.y][current.x] !== 4 && BoardElement[current.y][current.x] !== 1)
    {
      BoardElement[current.y][current.x] = 8;
    }
  }
  // PATH TRACING BY PARENTING  
  BackTracePath(p5)   
  p5.fill("red");
  p5.square(EndPoint.x, EndPoint.y, UnitGrid);   


  
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
function  sqr(a : number) {
  return a*a;
}
function Distance(x1 : number , y1: number, x2: number, y2: number) {
  return Math.sqrt(sqr(y2 - y1) + sqr(x2 - x1));
}