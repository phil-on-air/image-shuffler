let img;
let rows = 10;
let cols = 10;
let squares = [];
let imgPositions = [];
let saveCounter = 0;
let canvas;
let displayScale = 1;

function setup() {
  // Create a canvas that fits the window
  canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  imageMode(CORNER);
  noStroke();
  noSmooth();
  pixelDensity(1);
  
  // Set up file input listener
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', handleFileSelect);
  
  // Set up drag and drop
  const dropZone = document.getElementById('drop-zone');
  
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });
  
  // Highlight drop zone when dragging over it
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });
  
  // Handle dropped files
  dropZone.addEventListener('drop', handleDrop, false);
}

function windowResized() {
  // Resize canvas when window is resized
  resizeCanvas(windowWidth * 0.8, windowHeight * 0.8);
  if (img) {
    calculateDisplayScale();
    reshuffleSquares();
  }
}

function calculateDisplayScale() {
  // Calculate scale to fit the image within the canvas
  let scaleX = width / img.width;
  let scaleY = height / img.height;
  displayScale = min(scaleX, scaleY);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  document.getElementById('drop-zone').classList.add('dragover');
}

function unhighlight(e) {
  document.getElementById('drop-zone').classList.remove('dragover');
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  if (files.length > 0) {
    handleFileSelect({ target: { files: files } });
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.match('image.*')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img = loadImage(e.target.result, imageLoaded);
    }
    reader.readAsDataURL(file);
  }
}

function imageLoaded() {
  calculateDisplayScale();
  
  // Reset positions and squares
  imgPositions = [];
  squares = [];
  
  let squareWidth = img.width / cols;
  let squareHeight = img.height / rows;

  // Create initial positions
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * squareWidth;
      let y = i * squareHeight;
      imgPositions.push(createVector(x, y));
    }
  }

  reshuffleSquares();
}

function draw() {
  // Always use dark background
  background('#1a1a1a');
  
  if (img) {
    for (let s of squares) {
      s.display();
    }
  }
}

class Square {
  constructor(x, y, w, h, imgPos) {
    this.pos = createVector(x, y);
    this.imgPos = imgPos;
    this.w = w;
    this.h = h;
  }

  display() {
    // Get the image section with a slight overlap to prevent gaps
    let squareImg = img.get(
      this.imgPos.x,
      this.imgPos.y,
      this.w + 0.5,
      this.h + 0.5
    );
    
    // Calculate display position and size
    let displayX = (this.pos.x * displayScale) + (width - img.width * displayScale) / 2;
    let displayY = (this.pos.y * displayScale) + (height - img.height * displayScale) / 2;
    let displayW = (this.w + 0.5) * displayScale;
    let displayH = (this.h + 0.5) * displayScale;
    
    // Draw the image section with scaling
    image(squareImg, displayX, displayY, displayW, displayH);
  }
}

function reshuffleSquares() {
  squares = [];
  
  // Shuffle the positions array
  for (let i = imgPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imgPositions[i], imgPositions[j]] = [imgPositions[j], imgPositions[i]];
  }

  let idx = 0;
  let squareWidth = img.width / cols;
  let squareHeight = img.height / rows;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * squareWidth;
      let y = i * squareHeight;
      squares.push(new Square(x, y, squareWidth, squareHeight, imgPositions[idx]));
      idx++;
    }
  }
}

function mousePressed() {
  if (img && mouseButton === LEFT) {
    reshuffleSquares();
  } else if (img && mouseButton === RIGHT) {
    // Create a temporary canvas for saving the full-size image
    let saveCanvas = createGraphics(img.width, img.height);
    saveCanvas.imageMode(CORNER);
    saveCanvas.noSmooth();
    
    // Draw all squares at their original size
    for (let s of squares) {
      let squareImg = img.get(s.imgPos.x, s.imgPos.y, s.w + 0.5, s.h + 0.5);
      saveCanvas.image(squareImg, s.pos.x, s.pos.y, s.w + 0.5, s.h + 0.5);
    }
    
    // Save the full-size image
    saveCanvas.save('shuffled_image_' + saveCounter + '.png');
    saveCounter++;
  }
} 