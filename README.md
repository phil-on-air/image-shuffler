# Image Shuffler

An interactive web application that allows you to shuffle an image into blocks. Upload any image and watch it get divided into a grid of blocks that you can shuffle with a click.

![Image Shuffler Demo](demo.gif)

## Features

- 🖼️ Drag and drop image upload
- 🎲 Click to shuffle blocks
- 💾 Right-click to save the current state
- 🌙 Dark mode interface
- 🔲 Seamless block transitions
- 📱 Responsive design

## How to Use

1. Upload an image by either:
   - Dragging and dropping an image file onto the drop zone
   - Clicking the "Choose File" button to select an image
2. Left-click anywhere on the image to shuffle the blocks
3. Right-click to save the current state as a PNG file

## Technical Details

The application uses:
- p5.js for image processing and canvas manipulation
- HTML5 and CSS3 for the user interface
- JavaScript for interactivity
- Modern web APIs for drag and drop functionality

### Block Shuffling Algorithm
- Images are divided into a 10x10 grid by default
- Each block maintains its original image data
- Shuffling is done by randomly rearranging block positions
- Seamless transitions between blocks are achieved through precise pixel calculations

## Live Demo

[View the live demo here](https://phil-on-air.github.io/image-shuffler/)

## Development

To run this project locally:
1. Clone the repository
2. Open `index.html` in your web browser
3. Start shuffling!

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues and enhancement requests! 