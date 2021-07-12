//drop speed
const GAME_SPEED = 1000;

//field size
const FIELD_COL = 10;
const FIELD_ROW = 20;

//block size
const BLOCK_SIZE = 30;

//canvas size
const SCREEN_W = 640;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

//tetromino size
const TETRO_SIZE = 4;


let can = document.getElementById("can");
let con = can.getContext("2d");


can.width = SCREEN_W;
can.height = SCREEN_H;
can.style.border = "4px solid #555";
const TETRO_COLORS = [
  "#fff",
  "#92B4D1",
  "#ACE2D0",
  "#EBAF54",
  "#F4A3BE",
  "#A97BB0",
  "#F8B48D",
  "#806761"
];


//tetromino body
const TETRO_TYPES = [
  [], //empty
    [ //I
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [ //L
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ //J
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ //T
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [ //O
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ //Z
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ //S
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ]
  ];

//sound and image
let bgimage;
bgimage = new Image();
bgimage.src ="background.png";


//initial position
const START_X = FIELD_COL/2 - TETRO_SIZE/2;
const START_Y = 0;

let tetro;

//tetromino map
let tetro_x = START_X;
let tetro_y = START_Y;

//tetromino shapes
let tetro_t;

//tetro next
let tetro_n;

//field
let field = [];

//game over
let over = false;
//deleted line count
let lines = 0;
//score
let score = 0;

//position of game field
const OFFSET_X = -340; //(640-300)/2;
const OFFSET_Y = 20;


init();
//drawAll();
//setInterval(dropTetro, GAME_SPEED)

//initialize
function init(){
  //clear field
  for(let y=0; y<FIELD_ROW ; y++ ){
    field[y] = [];
    for(let x=0; x<FIELD_COL ; x++ ){
      field[y][x]=0;
    }
  }
  //Test:To check field is working -> field[5][0]=1;

  tetro_n = Math.floor(Math.random() * (TETRO_TYPES.length-1))+1;

  setTetro();
  drawAll();
  setInterval(dropTetro, GAME_SPEED);

}

function setTetro(){
  tetro_t = tetro_n;
  tetro = TETRO_TYPES[tetro_t];
  tetro_n = Math.floor(Math.random() * (TETRO_TYPES.length-1))+1;

  //initialize position
  tetro_x = START_X;
  tetro_y = START_Y;
}

function drawBlock(x, y, c){
  let px = x * BLOCK_SIZE;
  let py = y * BLOCK_SIZE;
  
  //con.drawImage(blimage,
    //c*BLOCK_SIZE, 0, BLOCK_SIZE,BLOCK_SIZE,
    //px,py,           BLOCK_SIZE,BLOCK_SIZE );
  con.fillStyle= TETRO_COLORS[c];
  con.fillRect(px, py,  BLOCK_SIZE, BLOCK_SIZE);
  con.strokeStyle = "#fff";
  con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

//show field
function drawAll(){
  //background image
  con.drawImage(bgimage, -100, -100);
  //field frame
  con.strokeStyle = "rgba(80, 160, 255, 0.1)";
  con.strokeRect(OFFSET_X-6, OFFSET_Y-6, SCREEN_W+12, SCREEN_H+12);
  con.strokeStyle = "rgba(80, 160, 255, 0.5)";
  con.strokeRect(OFFSET_X-2, OFFSET_Y-2, SCREEN_W+4, SCREEN_H+4);
  con.fillStyle = "rgba(0, 0, 0, 0.15)";
  con.fillRect(OFFSET_X, OFFSET_Y, SCREEN_W, SCREEN_H);



  //con.clearRect(0,0, SCREEN_W, SCREEN_H)
  for (let y=0; y<FIELD_ROW ; y++ ){
    for (let x=0; x<FIELD_COL ; x++ ){
      if ( field[y][x] ){
        drawBlock(x, y, field[y][x]);
      }
    }
  }

  //drop position
  let plus = 0;
  while(checkMove(0, plus+1)) plus++;

//show tetromino
  for (let y=0; y<TETRO_SIZE ; y++ ){
    for (let x=0; x<TETRO_SIZE ; x++ ){
      if ( tetro[y][x] ){
        //drop point
        drawBlock(tetro_x+x, tetro_y+y+plus, 0);
        //tetromino
        drawBlock(tetro_x+x, tetro_y+y, tetro_t);
      }
      //next tetromino
      if(TETRO_TYPES[tetro_n][x][y]){
        drawBlock(13+x, 4+y, tetro_n);
      }
    }
  }
  drawInfo();
}

//game info
function drawInfo() {
  let w;
  con.fillStyle = "black";
  con.font = "20px 'ＭＳ　ゴシック";
  let s = "NEXT";
  con.fillText(s, 370, 100);

  s = "SCORE";
  con.fillText(s, 370, 300);
  s = "" + score;
  w = con.measureText(s).width;
  con.fillText(s, 420 - w, 340);

  s = "LINES";
  w = con.measureText(s).width;
  con.fillText(s, 370, 400);
  s = "" + lines;
  w = con.fillText(s, 470 - w, 440);


  if (over) {
    let s = "GAME OVER";
    con.font = "40px 'ＭＳ　ゴシック";
    let w = con.measureText(s).width;
    let x = SCREEN_W / 2 - w / 2;
    let y = SCREEN_H / 2 - 20;
    con.lineWidth = 4;
    con.fillStyle = "white";
    con.fillText(s, x, y);
  }
}




//tetromino collision to the wall and other block
function checkMove(mx, my, ntetro){
  if(ntetro == undefined) ntetro = tetro;
  for(let y=0; y<TETRO_SIZE ; y++){
    for(let x=0; x<TETRO_SIZE ; x++){
      if( ntetro[y][x]){
        let nx = tetro_x + mx + x;
        let ny = tetro_y + my + y;
        if(ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx] ) 
        return false;
      }
    }
  }
  return true;
}


//rotation of tetromino
function rotate(){
  let ntetro = [];
  for(let y=0; y<TETRO_SIZE ; y++){
    ntetro[y]=[];
    for(let x=0; x<TETRO_SIZE ; x++){
      ntetro[y][x] = tetro[TETRO_SIZE-x-1][y];
    }
  }
  return ntetro;
}

//fix position at the bottom
function fixTetro(){
  for(let y=0; y<TETRO_SIZE ; y++){
    for(let x=0; x<TETRO_SIZE ; x++){
      if(tetro[y][x]){
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
    }
  }
}


function checkLine(){
  let linec = 0;
  for (let y=0; y<FIELD_ROW ; y++){
    let flag = true;
    for(let x=0; x<FIELD_COL ; x++){
      if(!field[y][x]){
        flag = false;
        break;
      }
    }
    if(flag){
      linec++;
      for(let ny = y; ny>0 ; ny--){
        for(let nx=0; nx<FIELD_COL ; nx++){
          field[ny][nx] = field[ny-1][nx];
        }
      }
    }
  }
  if(linec){
    lines += linec;
    score+=100*(2**(linec-1));
    if(speed<GAME_SPEED-10)speed+=10;
  }
}

function dropTetro(){
  if(over)return;
  if(checkMove(0, 1))tetro_y++;
  else{
    fixTetro();
    checkLine();

    tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1))+1;
    tetro = TETRO_TYPES[tetro_t];
    tetro_x = START_X;
    tetro_y = START_Y;

    if(!checkMove(0,0)){
      over = true;
    }
  }
  drawAll();
}

document.onkeydown = function(e) {
  if(over)return;
  switch(e. keyCode ){
    case 37: if(checkMove(-1, 0))tetro_x--; break; 
    //ase 38: if(checkMove(0, -1))tetro_y--; break; 
    case 39: if(checkMove(1, 0))tetro_x++; break; 
    case 40: while(checkMove(0, 1))tetro_y++; break; 
    case 32: let ntetro = rotate(); 
    if(checkMove(0,0,ntetro)){
      tetro = ntetro;  
    } 
    break; 
  }
  drawAll();
}