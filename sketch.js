let img;
let rows = 10;
let cols = 10;
let squares = [];
let imgPositions = [];
let saveCounter = 0;
let canvas;

function setup() {
  // Create a canvas with default size that will be resized when image is loaded
  canvas = createCanvas(400, 400);
  imageMode(CORNER);
  noStroke();
  noSmooth(); // Disable anti-aliasing for cleaner edges
  pixelDensity(1); // Ensure consistent pixel density
  
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
  // Resize canvas to match image dimensions
  resizeCanvas(img.width, img.height);
  
  // Reset positions and squares
  imgPositions = [];
  squares = [];
  
  let squareWidth = width / cols;
  let squareHeight = height / rows;

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
  background(255);
  if (img) {
    for (let s of squares) {
      s.display();
    }
  } else {
    // Display instructions when no image is loaded
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text('Upload an image to begin', width/2, height/2);
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
    
    // Draw the image section with a slight overlap
    image(squareImg, this.pos.x, this.pos.y, this.w + 0.5, this.h + 0.5);
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
  let squareWidth = width / cols;
  let squareHeight = height / rows;
  
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
    saveCanvas('shuffled_image_' + saveCounter, 'png');
    saveCounter++;
  }
} 