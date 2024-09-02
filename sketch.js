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

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup() {
    createCanvas(1024, 576);
    floorPos_y = (height * 3) / 4;
    lives = 3;
    startGame();
}


function draw() {
    ///////////DRAWING CODE//////////

    cameraPosx = gameChar_x - width /2;

    // DRAW THE SKY
    background(200, 105, 255);

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

    // DRAW CHARACTER
    drawGameCharacter();
    // DRAW ENEMY
    enemyy.drawEnemy()
    enemyy.contact()
    pop();
 
   

    // CHECK GAME OVER OR LEVEL COMPLETE
    if(flagpole.isReached == true){
        push()
        strokeWeight(3)
        stroke(10)
        fill(20,200,20)
        text("Level complete! Press space to continue", 500, 100)
        pop()
    }
    if(lives<1){
        push()
        strokeWeight(1)
        stroke(2)
        fill(30,200,20)
        textSize(20)
        text("Game Over! Press space to continue", 500, 100)
        pop()
        isPlummeting= true;
    }

    //CHECK THE FLAGPOLE
    if(flagpole.isReached == false){
        checkFlagpole();
    }

    //MINUS ONE LIFE
    checkPlayerDie()

    //SCORE COUNT TEXT
    fill(255);
    noStroke();
    text("Score: " + game_score, 20, 20);

    //LIVES COUNT TEXT
    fill(255);
    noStroke();
    text("Lives: " + lives, width - 80, 20)

    ///////////INTERACTION CODE//////////

    // JUMPING INTERACTION
    if (gameChar_y < floorPos_y) {
        gameChar_y += 3;
        isFalling = true;
    } else if (gameChar_y >= floorPos_y) {
        isFalling = false;
    }

    // PLUMMETING INTERACTION
    if (isPlummeting == true) {
        gameChar_y += 5;
        isFalling = true;
        if(gameChar_y > floorPos_y +250){
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
    if(flagpole.isReached ==true && keyCode == 32 || lives < 1 && keyCode == 32){
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
    if(lives < 1){
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);

        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 3, gameChar_y - 54, 6, 3);

        fill(10, 10, 200);
        ellipse(gameChar_x + 15, gameChar_y - 54, 6, 3);

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
        return
    }
    
    if(isComplete == true){
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);

        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 3, gameChar_y - 54, 6, 3);

        fill(10, 10, 200);
        ellipse(gameChar_x + 15, gameChar_y - 54, 6, 3);

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
        return
    }
    if (isLeft && isFalling) {
        // add your jumping-left code
        // HEAD
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 3, gameChar_y - 54, 6, 3);
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
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);

        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 15, gameChar_y - 54, 6, 3);

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
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);
        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 3, gameChar_y - 54, 6, 3);
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
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);

        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 15, gameChar_y - 54, 6, 3);

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
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);

        // EYE
        fill(10, 10, 200);
        ellipse(gameChar_x + 3, gameChar_y - 54, 6, 3);

        fill(10, 10, 200);
        ellipse(gameChar_x + 15, gameChar_y - 54, 6, 3);

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
        fill(5, 10, 10);
        rect(gameChar_x - 10, gameChar_y - 65, 40, 5);
        rect(gameChar_x, gameChar_y - 75, 20, 15);
        fill(155, 200, 100);
        rect(gameChar_x - 3, gameChar_y - 60, 26, 20);

        // EYES
        fill(10, 10, 200);
        ellipse(gameChar_x + 3, gameChar_y - 54, 6, 3);

        fill(10, 10, 200);
        ellipse(gameChar_x + 15, gameChar_y - 54, 6, 3);

        // BODY
        fill(200, 30, 50);
        rect(gameChar_x, gameChar_y - 40, 20, 27);

        // FEET;
        fill(10, 80, 200);
        rect(gameChar_x, gameChar_y - 13, 9, 14);
        rect(gameChar_x + 11, gameChar_y - 13, 9, 14);
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
    for (i = 0; i < trees_x.length; i++) {
        fill(200, 100, 45);
        quad(
            trees_x[i],
             treePos_y,
             trees_x[i] + 30,
             treePos_y,
             trees_x[i] + 55,
             treePos_y + 110,
             trees_x[i] - 25,
             treePos_y + 110
        );
        fill(100, 155, 55);
        ellipse(trees_x[i] - 20, treePos_y, 120, 100);
        ellipse(trees_x[i] + 40, treePos_y, 100, 100);
        ellipse(trees_x[i], treePos_y - 50, 100, 90);
        ellipse(trees_x[i] + 30, treePos_y - 50, 80, 90);
    }
}

function drawMountains() {
    for (i = 0; i < 2; i++) {
        fill(140, 110, 80);
        triangle(
            mountains[i].x_pos,
            mountains[i].y_pos,
            mountains[i].x_pos + 180,
            mountains[i].y_pos - 350,
            mountains[i].x_pos + 350,
            mountains[i].y_pos
        );
        fill(140, 110, 80);
        triangle(
            mountains[i].x_pos,
            mountains[i].y_pos,
            mountains[i].x_pos + 180,
            mountains[i].y_pos - 350,
            mountains[i].x_pos + 350,
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
    rect(t_canyon.x_pos + 80, 432, 20, 800);
}

function checkCanyon(t_canyon) {
    if (
        gameChar_x > t_canyon.x_pos &&
        gameChar_x < t_canyon.x_pos + (t_canyon.width - 35) &&
        isFalling == false
    ) {
        isPlummeting = true;
    }
}

function drawCollectable(t_collectable) {
    if (t_collectable.isFound == false) {
        fill(230, 255, 0);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
        fill(200, 155, 255);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, 28);
    }
}

function checkCollectable(t_collectable) {
    if (
        dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <
        t_collectable.size
    ) {
        t_collectable.isFound = true;
        game_score += 1;
        console.log("Got one!");
    }
}

function drawFlagpole(){
    push()
    strokeWeight(10);
    stroke(255);
    line(flagpole.x_pos, floorPos_y -3, flagpole.x_pos, floorPos_y - 260);
    fill(200,20,20);
    noStroke()
    if(flagpole.isReached == true){
        rect(flagpole.x_pos, floorPos_y -260, 50, 50)
    }else{
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50)
    }
    pop()
}

function checkFlagpole(){
    var d = abs(gameChar_x - flagpole.x_pos)
    if(d < 10){
        flagpole.isReached = true;
        isComplete = true;
    }
}

function checkPlayerDie(){
    if(isDead){
        lives -= 1;
        if(lives > 0){
            isPlummeting = false
            startGame()
        }else{
            lives = 0
        }
        isDead = false;
    }
}

function startGame(){
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    canyons = [
        { x_pos: 570, width: 100 },
        { x_pos: 1370, width: 100 },
    ];
    collectables = [
        { x_pos: 700, y_pos: 410, size: 39, isFound: false },
        { x_pos: 1300, y_pos: 410, size: 39, isFound: false },
        { x_pos: 100, y_pos: 410, size: 39, isFound: false },
    ];
    trees_x = [200, 390, 800, 1020, 1500];
    treePos_y = height / 2 + 34;
    clouds = [
        { x_pos: 600, y_pos: 120 },
        { x_pos: 200, y_pos: 100 },
        { x_pos: 800, y_pos: 80 },
        { x_pos: 1280, y_pos: 100 },
        { x_pos: 1500, y_pos: 90 },
    ];
    mountains = [
        { x_pos: 160, y_pos: 432 },
        { x_pos: 780, y_pos: 432 },
    ];
    cameraPosx = 0;
    limitWorldRight = 1900;
    limitWorldLeft = 0;
    game_score = 0;
    isComplete = false;
    flagpole = {isReached:false, x_pos: 1700}
    enemyy = new Enemy(200, 100);
}

function Enemy(x, range) {
    this.x = x;
    this.y = floorPos_y - 10;
    this.range = range;
    this.currentX = x;
    this.inc = 2; 

    this.move = function() {
        this.currentX += this.inc;
        if (this.currentX >= this.x + this.range) {
            this.inc = -2;
        } else if (this.currentX <= this.x) {
            this.inc = 2;
        }
    };

    this.drawEnemy = function() {
        this.move();
        fill(200, 20, 20);
        ellipse(this.currentX, this.y, 20);
    };
    this.contact = function(){
        this.dist = abs(gameChar_x - this.currentX)
        if(this.dist < 20){
            isDead = true;
        }
    }
}