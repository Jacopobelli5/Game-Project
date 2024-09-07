/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
var jumpSound;
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft = false;
var isRight = false;
var isFalling = false;
var isPlummeting = false;
var collectable;
var trees_x;
var clouds;
var mountains;
var cameraPosx;
var limitWorldLeft; //Variable used to limit the world on the left side
var limitWorldRight; //Variable	used to	limit the world	on the right
var game_score;
var flagpole;
var lives;
var isDead = false;
var isComplete = false;
var numOfPlays; //Variable used to prevent a sound loop on game over behaviour
var platforms;

function preload() {
  soundFormats("mp3", "wav");
  jumpSound = loadSound("assets/jump.wav");
  coinSound = loadSound("assets/coin.wav");
  loseSound = loadSound("assets/lose.wav");
  jumpSound.setVolume(0.1);
  coinSound.setVolume(0.1);
  loseSound.setVolume(0.1);
}

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  lives = 3;
  startGame();
}

function draw() {
  ///////////DRAWING CODE//////////

  cameraPosx = gameChar_x - width / 2;

  // DRAW THE SKY
  background(200, 155, 255);

  // DRAW THE GROUND
  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height - floorPos_y);

  // CAMERA MOVEMENTS

  if (isRight && !isPlummeting && cameraPosx < limitWorldRight - width) {
    cameraPosx += 3;
  }

  if (isLeft && !isPlummeting && cameraPosx > limitWorldLeft) {
    cameraPosx -= 3;
  }

  // STRAT DRAWNG WORLD ELEMENTS
  push();
  translate(-cameraPosx, 0);

  // MOUNTAINS HERE //
  drawMountains();

  // TREES HERE //
  drawTrees();

  // CLOUDS HERE //
  drawClouds();

  // CANYONS HERE //
  for (i = 0; i < canyons.length; i++) {
    drawCanyon(canyons[i]);
    // FALLING INTO THE CANYON INTERACTION
    checkCanyon(canyons[i]);
  }

  // COLLECTABLES HERE //
  for (i = 0; i < collectables.length; i++) {
    // DRAW THE COLLECTABLE IF NOT FOUND
    if (!collectables[i].isFound) {
      drawCollectable(collectables[i]);
      // COLLECT COLLECTABLES
      checkCollectable(collectables[i]);
    }
  }
  // DRAW FLAGPOLE
  drawFlagpole();

  // PLATFORMS HERE
  for (i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }

  // DRAW CHARACTER
  drawGameCharacter();

  // DRAW ENEMY
  for (i = 0; i < enemies.length; i++) {
    enemies[i].drawEnemy();
    enemies[i].contact();
  }

  pop();

  // CHECK GAME OVER OR LEVEL COMPLETE
  if (flagpole.isReached == true) {
    push();
    strokeWeight(1);
    stroke(10);
    fill(20, 180, 20);
    textSize(20)
    text("Level complete! Press space to continue", 500, 100);
    pop();
  }
  if (lives < 1) {
    push();
    strokeWeight(1);
    stroke(2);
    fill(190, 30, 20);
    textSize(20);
    text("Game Over! Press space to continue", 500, 100);
    pop();
    isPlummeting = true;
  }

  //CHECK THE FLAGPOLE
  if (flagpole.isReached == false) {
    checkFlagpole();
  }

  //MINUS ONE LIFE
  checkPlayerDie();

  //SCORE COUNT TEXT
  fill(255);
  stroke(1);
  strokeWeight(3);
  text("Score: " + game_score, 20, 20);

  //LIVES COUNT TEXT
  fill(255);
  stroke(1);
  strokeWeight(3);
  textSize(15);
  text("Lives: " + lives, width - 80, 20);

  ///////////INTERACTION CODE//////////

  // JUMPING INTERACTION
  if (gameChar_y < floorPos_y) {
    var isContact = false;
    for (i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
        isContact = true;
        isFalling = false;
        break;
      }
    }
    if (isContact == false) {
      gameChar_y += 3;
      isFalling = true;
    }
  } else {
    console.log("hey");
    isFalling = false;
    isContact = true;
  }

  // PLUMMETING INTERACTION
  if (isPlummeting == true) {
    gameChar_y += 5;
    isFalling = true;
    if (gameChar_y > floorPos_y + 250) {
      isDead = true;
    }
  }
}

// Function to control the animation of the character when
// keys are pressed.
function keyPressed() {
  //flagpole check, if checked then palyer won't be able to move
  if (keyCode == 65) {
    isLeft = true;
  } else if (keyCode == 68) {
    isRight = true;
  } else if (keyCode == 32 && isFalling == false) {
    gameChar_y -= 130;
    jumpSound.play();
  }

  //RESET GAME AFTER GAME OVER OR WINNING
  if (
    (flagpole.isReached == true && keyCode == 32) ||
    (lives < 1 && keyCode == 32)
  ) {
    startGame();
    isPlummeting = false;
    lives = 3;
  }
}

function keyReleased() {
  // if statements to control the animation of the character when
  // keys are released.
  if (keyCode == 65) {
    isLeft = false;
  } else if (keyCode == 68) {
    isRight = false;
  }
}

function drawGameCharacter() {
  if (lives < 1) {
    //Game Over Character
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();

    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 3, gameChar_y - 54, 6, 5);

    fill(10, 10, 90);
    ellipse(gameChar_x + 16, gameChar_y - 54, 6, 5);

    // MOUTH
    fill(200, 50, 50);
    //New P5.js functin I found on the documentation
    arc(gameChar_x + 10, gameChar_y - 44, 10, 6, PI, PI * 2, CHORD);

    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 30);

    // FEET
    fill(10, 80, 200);
    beginShape();
    vertex(gameChar_x + 1, gameChar_y - 13);
    vertex(gameChar_x - 10, gameChar_y + 3);
    vertex(gameChar_x - 3, gameChar_y + 7);
    vertex(gameChar_x + 13, gameChar_y - 13);
    endShape();
    beginShape();
    vertex(gameChar_x + 20, gameChar_y - 13);
    vertex(gameChar_x + 30, gameChar_y + 3);
    vertex(gameChar_x + 23, gameChar_y + 7);
    vertex(gameChar_x + 7, gameChar_y - 13);
    endShape();
    return;
  }

  if (isComplete == true) {
    //Winning Character
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();

    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 3, gameChar_y - 54, 6, 5);

    fill(10, 10, 90);
    ellipse(gameChar_x + 16, gameChar_y - 54, 6, 5);

    // MOUTH
    fill(200, 50, 50);
    arc(gameChar_x + 10, gameChar_y - 48, 10, 6, 0, PI, CHORD);

    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 30);

    // FEET
    fill(10, 80, 200);
    beginShape();
    vertex(gameChar_x + 1, gameChar_y - 13);
    vertex(gameChar_x - 10, gameChar_y + 3);
    vertex(gameChar_x - 3, gameChar_y + 7);
    vertex(gameChar_x + 13, gameChar_y - 13);
    endShape();
    beginShape();
    vertex(gameChar_x + 20, gameChar_y - 13);
    vertex(gameChar_x + 30, gameChar_y + 3);
    vertex(gameChar_x + 23, gameChar_y + 7);
    vertex(gameChar_x + 7, gameChar_y - 13);
    endShape();
    return;
  }
  if (isLeft && isFalling) {
    // add your jumping-left code
    // HEAD
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();
    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 3, gameChar_y - 54, 6, 5);
    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 27);
    // FEET
    fill(10, 80, 200);
    beginShape();
    vertex(gameChar_x + 1, gameChar_y - 13);
    vertex(gameChar_x + 18, gameChar_y - 13);
    vertex(gameChar_x + 10, gameChar_y - 3);
    vertex(gameChar_x + 18, gameChar_y + 3);
    vertex(gameChar_x + 10, gameChar_y + 7);
    vertex(gameChar_x - 1, gameChar_y - 3);
    vertex(gameChar_x + 1, gameChar_y - 13);
    endShape();
    gameChar_x -= 3;
  } else if (isRight && isFalling) {
    // add your jumping-right code
    // HEAD
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();

    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 15, gameChar_y - 54, 6, 5);

    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 27);

    // FEET
    fill(10, 80, 200);
    beginShape();
    vertex(gameChar_x + 20, gameChar_y - 13);
    vertex(gameChar_x + 2, gameChar_y - 13);
    vertex(gameChar_x + 10, gameChar_y - 3);
    vertex(gameChar_x + 2, gameChar_y + 3);
    vertex(gameChar_x + 10, gameChar_y + 7);
    vertex(gameChar_x + 22, gameChar_y - 3);
    vertex(gameChar_x + 20, gameChar_y - 13);
    endShape();
    gameChar_x += 3;
  } else if (isLeft && gameChar_x > limitWorldLeft) {
    // add your walking left code
    // HEAD
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();
    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 3, gameChar_y - 54, 6, 5);
    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 27);
    // FEET
    fill(10, 80, 200);
    rect(gameChar_x + 3, gameChar_y - 13, 15, 13);
    gameChar_x -= 3;
  } else if (isRight && gameChar_x < limitWorldRight) {
    // add your walking right code
    // HEAD
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();

    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 15, gameChar_y - 54, 6, 5);

    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 27);

    // FEET
    fill(10, 80, 200);
    rect(gameChar_x + 3, gameChar_y - 13, 15, 13);
    gameChar_x += 3;
  } else if (isFalling || isPlummeting) {
    // add your jumping facing forwards code
    // HEAD
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();

    // EYE
    fill(10, 10, 90);
    ellipse(gameChar_x + 3, gameChar_y - 54, 6, 5);

    fill(10, 10, 90);
    ellipse(gameChar_x + 16, gameChar_y - 54, 6, 5);

    // MOUTH
    fill(200, 50, 50);
    arc(gameChar_x + 10, gameChar_y - 44, 10, 6, PI, PI * 2, CHORD);

    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 30);

    // FEET
    fill(10, 80, 200);
    beginShape();
    vertex(gameChar_x + 1, gameChar_y - 13);
    vertex(gameChar_x - 10, gameChar_y + 3);
    vertex(gameChar_x - 3, gameChar_y + 7);
    vertex(gameChar_x + 13, gameChar_y - 13);
    endShape();
    beginShape();
    vertex(gameChar_x + 20, gameChar_y - 13);
    vertex(gameChar_x + 30, gameChar_y + 3);
    vertex(gameChar_x + 23, gameChar_y + 7);
    vertex(gameChar_x + 7, gameChar_y - 13);
    endShape();
  } else {
    // add your standing front facing code
    // HEAD
    stroke(0);
    strokeWeight(1);
    fill(5, 10, 10);
    rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
    rect(gameChar_x, gameChar_y - 75, 20, 15);
    fill(155, 200, 100);
    rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
    noStroke();

    // EYES
    fill(10, 10, 90);
    ellipse(gameChar_x + 3, gameChar_y - 54, 6, 5);

    fill(10, 10, 90);
    ellipse(gameChar_x + 16, gameChar_y - 54, 6, 5);

    // MOUTH
    fill(200, 50, 50);
    //New P5.js function found on the documentation
    arc(gameChar_x + 10, gameChar_y - 48, 10, 6, 0, PI, CHORD);

    // BODY
    fill(200, 30, 50);
    rect(gameChar_x, gameChar_y - 40, 20, 27);

    // FEET;
    fill(10, 80, 200);
    rect(gameChar_x, gameChar_y - 14, 9, 14);
    rect(gameChar_x + 11, gameChar_y - 14, 9, 14);
  }
}

function drawClouds() {
  for (i = 0; i < clouds.length; i++) {
    fill(255, 255, 255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, 100, 50);
    ellipse(clouds[i].x_pos - 20, clouds[i].y_pos - 11, 68, 60);
    ellipse(clouds[i].x_pos, clouds[i].y_pos - 13, 60, 50);
  }
}

function drawTrees() {
  for (let i = 0; i < trees_x.length; i++) {
    fill(139, 69, 19);
    stroke(100, 50, 20);
    strokeWeight(2);
    quad(
      trees_x[i] - 15,
      treePos_y,
      trees_x[i] + 15,
      treePos_y,
      trees_x[i] + 25,
      treePos_y - 110,
      trees_x[i] - 25,
      treePos_y - 110
    );

    noStroke();
    fill(34, 139, 34);
    ellipse(trees_x[i], treePos_y - 130, 120, 120);
    ellipse(trees_x[i] - 30, treePos_y - 110, 100, 100);
    ellipse(trees_x[i] + 30, treePos_y - 110, 100, 100);

    fill(144, 238, 144, 150);
    ellipse(trees_x[i], treePos_y - 150, 60, 60);
  }
}

function drawMountains() {
  for (let i = 0; i < mountains.length; i++) {
    fill(120, 100, 80);
    triangle(
      mountains[i].x_pos,
      mountains[i].y_pos,
      mountains[i].x_pos + 180,
      mountains[i].y_pos - 350,
      mountains[i].x_pos + 360,
      mountains[i].y_pos
    );

    fill(160, 140, 120);
    triangle(
      mountains[i].x_pos + 90,
      mountains[i].y_pos,
      mountains[i].x_pos + 180,
      mountains[i].y_pos - 350,
      mountains[i].x_pos + 270,
      mountains[i].y_pos
    );
  }
}

function drawCanyon(t_canyon) {
  fill(200, 155, 255);
  rect(t_canyon.x_pos, 432, t_canyon.width, 800);
  fill(140, 90, 80);
  rect(t_canyon.x_pos - 20, 432, 20, 800);
  fill(140, 90, 80);
  rect(t_canyon.x_pos + t_canyon.width, 432, 20, 800);
}

function checkCanyon(t_canyon) {
  if (
    gameChar_x > t_canyon.x_pos &&
    gameChar_x < t_canyon.x_pos + (t_canyon.width - 10) &&
    isFalling == false
  ) {
    isPlummeting = true;
  }
}

function drawCollectable(t_collectable) {
  if (!collectables[i].isFound) {
    fill(255, 215, 0);
    stroke(184, 134, 11);
    strokeWeight(2);
    ellipse(collectables[i].x_pos, collectables[i].y_pos, collectables[i].size);

    noStroke();
    fill(255, 255, 255, 150);
    ellipse(
      collectables[i].x_pos - collectables[i].size * 0.2,
      collectables[i].y_pos - collectables[i].size * 0.2,
      collectables[i].size * 0.4,
      collectables[i].size * 0.4
    );

    fill(184, 134, 11);
    textSize(collectables[i].size * 0.5);
    textAlign(CENTER, CENTER);
    text("$", collectables[i].x_pos, collectables[i].y_pos);
  }
}

function checkCollectable(t_collectable) {
  if (
    dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <
    t_collectable.size
  ) {
    t_collectable.isFound = true;
    coinSound.play();
    game_score += 1;
    console.log("Got one!");
  }
}

function drawFlagpole() {
  push();
  strokeWeight(10);
  stroke(255);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);

  if (flagpole.isReached) {
    fill(55, 250, 50);
    stroke(255);
    strokeWeight(3);
    rect(flagpole.x_pos + 10, floorPos_y - 250, 50, 30);
  } else {
    fill(189, 0, 0);
    stroke(255);
    strokeWeight(3);
    rect(flagpole.x_pos + 10, floorPos_y - 50, 50, 30);
  }

  pop();
}

function checkFlagpole() {
  var d = abs(gameChar_x - flagpole.x_pos);
  if (d < 10) {
    flagpole.isReached = true;
    isComplete = true;
  }
}

function checkPlayerDie() {
  //I have implemented numOfPlays var to prevent a sound loop when game over
  if (isDead) {
    lives -= 1;
    if (lives > 0) {
      loseSound.play();
      isPlummeting = false;
      startGame();
    } else {
      //I found online this practical way of implementing if statements on one line
      if (numOfPlays < 1) {
        loseSound.play();
      }
      numOfPlays = 1;
      lives = 0;
    }
    isDead = false;
  }
}

function startGame() {
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  numOfPlays = 0;
  canyons = [
    { x_pos: -990, width: 800 },
    { x_pos: 590, width: 100 },
    { x_pos: 1370, width: 100 },
    { x_pos: 2070, width: 50 },
    { x_pos: 2150, width: 80 },
    { x_pos: 2770, width: 120 },
  ];
  collectables = [
    { x_pos: 980, y_pos: 410, size: 39, isFound: false },
    { x_pos: 1300, y_pos: 410, size: 39, isFound: false },
    { x_pos: 1870, y_pos: 240, size: 39, isFound: false },
    { x_pos: 100, y_pos: 410, size: 39, isFound: false },
    { x_pos: 3090, y_pos: 290, size: 39, isFound: false },
  ];
  trees_x = [-10,200, 390, 800, 1020, 1500, 1900, 2300, 2550, 2670];
  treePos_y = gameChar_y;
  clouds = [
    { x_pos: 600, y_pos: 120 },
    { x_pos: 200, y_pos: 100 },
    { x_pos: 800, y_pos: 80 },
    { x_pos: 1280, y_pos: 100 },
    { x_pos: 1500, y_pos: 90 },
    { x_pos: 1700, y_pos: 100 },
    { x_pos: 2200, y_pos: 90 },
    { x_pos: 2400, y_pos: 110 },
    { x_pos: 2900, y_pos: 90 },
    { x_pos: 3200, y_pos: 120 },
  ];
  mountains = [
    { x_pos: 160, y_pos: 432 },
    { x_pos: 780, y_pos: 432 },
    { x_pos: 980, y_pos: 432 },
    { x_pos: 1600, y_pos: 432 },
    { x_pos: 3180, y_pos: 432 },
  ];
  cameraPosx = 0;
  limitWorldRight = 3300;
  limitWorldLeft = 0;
  game_score = 0;
  isComplete = false;
  flagpole = { isReached: false, x_pos: 3100 };
  enemies = [];
  enemies.push(new Enemy(850, 419, 140));
  enemies.push(new Enemy(1550, 419, 340));
  enemies.push(new Enemy(2450, 419, 150));
  platforms = [];
  platforms.push(createPlatform(860, 360, 100));
  platforms.push(createPlatform(1580, 370, 150));
  platforms.push(createPlatform(1680, 290, 100));
  platforms.push(createPlatform(3000, 360, 60));

}

function Enemy(x, y, range) {
  this.x = x;
  this.y = y;
  this.range = range;
  this.currentX = x;
  this.inc = 2;

  this.move = function () {
    this.currentX += this.inc;
    if (this.currentX >= this.x + this.range) {
      this.inc = -2;
    } else if (this.currentX <= this.x) {
      this.inc = 2;
    }
  };

  this.drawEnemy = function () {
    this.move();
    fill(200, 20, 20);
    stroke(0);
    strokeWeight(1);
    ellipse(this.currentX, this.y, 30, 30);

    fill(0);
    ellipse(this.currentX - 7, this.y - 5, 6, 6);
    ellipse(this.currentX + 7, this.y - 5, 6, 6);
    stroke(0);
    strokeWeight(3);
    line(this.currentX - 12, this.y - 12, this.currentX - 3, this.y - 8);
    line(this.currentX + 12, this.y - 12, this.currentX + 3, this.y - 8);

    noFill();
    strokeWeight(2);
    //new p5.js function found in the documentation
    arc(this.currentX, this.y + 10, 15, 10, PI, 0);
    noStroke();
  };
  this.contact = function () {
    this.dist = dist(gameChar_x, gameChar_y, this.currentX, this.y);
    if (this.dist < 20) {
      isDead = true;
    }
  };
}

function createPlatform(x, y, length) {
  var p = {
    x: x,
    y: y,
    length: length,
    draw: function () {
      fill(170, 170, 170);
      stroke(120, 120, 120);
      strokeWeight(2);
      rect(this.x, this.y, this.length, 20);
      fill(140, 140, 140);
      rect(this.x, this.y + 20, this.length, 5);
    },
    checkContact: function (g_x, g_y) {
      if (g_x > (this.x - 15) && g_x < this.x + this.length) {
        var d = this.y + 2 - g_y;
        if (d >= 0 && d < 5) {
          return true;
        }
        return false;
      }
    },
  };
  return p;
}
