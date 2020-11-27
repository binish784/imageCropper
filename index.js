let fileInput = document.getElementById("filePicker")

var canvasHeight = 500;
var canvasWidth = 500;

var canvas = document.createElement("canvas");
canvas.height = canvasHeight;
canvas.width = canvasWidth;

canvas.onmousedown=function(e){
    handleMouseDown(e);
};
canvas.onmouseup  = function(e){
    handleMouseUp(e);
}
canvas.onmousemove= function(e){
    handleMouseMove(e);
}
canvas.onmouseout=function(e){
    handleMouseLeave(e);
}

canvas.ontouchstart = function(e){
    handleMouseDown(e);
}
canvas.ontouchend = function(e){
    handleMouseLeave(e);
}

canvas.ontouchmove = function(e){
    handleMouseMove(e);
}


document.body.appendChild(canvas);

// var canvas  = document.getElementsByTagName("canvas")[0];
        
var ctx = canvas.getContext("2d");

var dragging = false;

var imageObj =null;
var imageX= 0;
var imageY= 0;

var imageHeight;
var imageWidth;

var mouseStartX=0;
var mouseStartY=0;

function saveImage(){
    let image = canvas.toDataURL("image/png");
    let download = document.createElement("a");
    download.setAttribute("href",image);
    download.setAttribute('download',"downloadFIle.png");
    download.click();
}

function handleCanvasHeight(e){
    canvas.height = e.target.value;
    rePositionCanvas();
}

function handleCanvasWidth(e){
    canvas.width = e.target.value;
    rePositionCanvas();
}

// 1:1 width == height
// 2:1 width double  ( width = height *2);
function applyRatio(e){
    let widthRatio = document.getElementById("ratioWidth").value;
    let heightRatio  = document.getElementById("ratioHeight").value;
    let scale = document.getElementById("ratioScale").value;

    let minDia;
    if(imageObj.width < imageObj.height){
        minDia = imageObj.width;
    }else{
        minDia = imageObj.height;
    }
    
    let tempHeight= minDia/widthRatio * scale/100;
    let tempWidth = minDia/heightRatio * scale/100; 

    canvas.height = tempHeight;
    canvas.width = tempWidth;
    
    rePositionCanvas();
}

function handleAspectHeight(e){
    
    rePositionCanvas();
}

function handleAspectWidth(e){
    rePositionCanvas();
}

function rePositionCanvas(){
    drawImage(imageObj,imageX,imageY);
}

function handleSelectFile(e){

    let inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.click();
    inputFile.onchange=function(e){
        handleChange(e);
    }
}

function handleChange(e){

    let reader = new FileReader();

    let targetImage = e.target.files[0];

    reader.readAsDataURL(targetImage);

    reader.onloadend = ()=>{

        imageObj = new Image();
        imageX= 0;
        imageY= 0;
        imageObj.onload = function(){
            imageHeight = imageObj.height;
            imageWidth = imageObj.width;
            drawImage(this,imageX,imageY);
        };
        imageObj.src = reader.result;
    }
}

function drawImage(image,x,y){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(image!=null){
        ctx.drawImage(image, x, y); 
    }
}

function handleMouseDown(e){
    dragging=true;
    startMouseX = e.offsetX;
    startMouseY = e.offsetY;
}

function handleMouseUp(e){
    dragging=false;
}

function handleMouseLeave(e){
    dragging=false;
}

function handleMouseMove(e){
    if(dragging==true){
    
        let dx = startMouseX - e.offsetX;
        let dy = startMouseY - e.offsetY;
        
        imageX -=dx;
        imageY -=dy;
        if((imageX < -(imageObj.width -canvas.width)) || (imageX > 0)){
            imageX +=dx;
        }

        if(( imageY >0) || (imageY < -(imageObj.height-canvas.height))){
            imageY +=dy;
        }
    
        startMouseX = e.offsetX;
        startMouseY = e.offsetY;
    
        drawImage(imageObj,imageX,imageY);
    }    
}
