

// --- Customization Section ---
const NUM_LETTERS = 150; // How many letters on screen? (More can impact performance)
const CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to use
const MOUSE_REPEL_DISTANCE = 80; // How close the mouse needs to be to affect letters
const MOUSE_REPEL_STRENGTH = 0.5; // How strongly letters are pushed by the mouse
const SCROLL_STRENGTH = 0.5; // How much scrolling affects the letters' movement
// --- End of Customization ---

let letters = [];
let scrollVelocityY = 0;

// This class defines each individual letter
class Letter {
  constructor() {
    this.char = random(CHARACTER_SET.split(''));
    this.x = random(width);
    this.y = random(height);
    this.size = random(10, 25);
    this.opacity = random(50, 200);
    // Initial random velocity for a slow drift
    this.vx = random(-0.2, 0.2);
    this.vy = random(-0.2, 0.2);
  }

  // Update the letter's position and handle interactions
  update() {
    // 1. Mouse Interaction: Push letters away from the mouse
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < MOUSE_REPEL_DISTANCE) {
      let forceX = this.x - mouseX;
      let forceY = this.y - mouseY;
      // Apply the push force
      this.x += (forceX / d) * MOUSE_REPEL_STRENGTH;
      this.y += (forceY / d) * MOUSE_REPEL_STRENGTH;
    }

    // 2. Apply base velocity and scroll velocity
    this.x += this.vx;
    this.y += this.vy + scrollVelocityY;

    // 3. Screen Wrap: If a letter goes off-screen, wrap it to the other side
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  // Draw the letter on the screen
  display() {
    noStroke();
    fill(255, this.opacity); // White with variable transparency
    textSize(this.size);
    text(this.char, this.x, this.y);
  }
}

// p5.js setup function: runs once at the start
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  // This is CRUCIAL: It tells the canvas to live inside the div we will create
  canvas.parent('dynamic-background');
  
  // This function will be called whenever the user scrolls
  canvas.mouseWheel(handleScroll);

  textAlign(CENTER, CENTER);
  
  // Create all the letter objects
  for (let i = 0; i < NUM_LETTERS; i++) {
    letters.push(new Letter());
  }
}

// p5.js draw function: runs continuously in a loop
function draw() {
  background(0); // Black background

  // Update and display every letter
  for (let letter of letters) {
    letter.update();
    letter.display();
  }
  
  // Slowly reduce the scroll velocity so the effect fades out
  scrollVelocityY *= 0.95;
}

// This function is triggered by the scroll event
function handleScroll(event) {
  // Add a burst of velocity based on scroll direction and strength
  if (event.deltaY > 0) {
    scrollVelocityY += SCROLL_STRENGTH; // Scrolling down
  } else {
    scrollVelocityY -= SCROLL_STRENGTH; // Scrolling up
  }
  // Prevents the page from actually scrolling if the mouse is over the canvas
  return false;
}

// Adjust canvas size if the browser window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
