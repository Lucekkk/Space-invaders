 import Menu from './main.js';
 import Controls from './controls.js';
 import Spaceship from './spaceship.js';
 export default class SpaceInvaders{
    constructor(canvas, pickedMode = 'normal'){

        this.controls = new Controls();
        this.keyDown = this.controls.boundKeyDown;
        this.keyUp = this.controls.boundKeyUp;
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;



        this.pickedMode = pickedMode;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')

       

        this.score = 0;
        this.currentRound = 1;

        // console.log(this.pickedMode);
        
        

        this.beforeTime = performance.now();

        this.beforeTime2 = performance.now();

        this.beforeTimeBlinking = performance.now();
        
        this.spriteWidth = (this.width <= 1500) || (this.height <= 800) ? 736 : 960;
        this.spriteHeight = (this.width <= 1500) || (this.height <= 800) ? 46 : 60;

      

        this.cols = 10;
        this.didSpaceshipGetHit = false
        
        this.timeFrequency = 300;

        this.spriteWidthPerCols = this.spriteWidth / this.cols;
        this.frame = 0;
        this.frameMax = 10;
        this.srcX = null

        this.canEnemyShoot = false;
        this.hasArrived = false;

        
        this.arrivalAudioPlayed = false;

        this.bossState = "arriving";

        this.requestMoveID = null;
        this.requestDrawID = null;
        this.requestBlinkID = null;
        this.intervalIndex = null;
        this.isSpaceshipVisible = true;
        this.isGameRunning = true;
        
        this.enemySpaceships = []

        
        this.spaceship = new Spaceship(this.width, this.height, this.controls, this);
        // console.log(this.spaceship.width)
       

      


        

        //BOSS

          this.boss = {
            width: 220,
            height: 305,
            img: new Image(),
            x : (this.width / 2) - 110,
            y: -305,
            speedX: 2,
            speedY: 2,
            gunCooldown: 600,
            ifShot: false,
            projectiles: []
        }         

        //y: -305
        this.boss.img.src = 'images/finalBoss.png';


    
      switch(this.pickedMode){
            case "easy":
                this.spaceship.properties.speed = 12;
                this.spaceship.properties.gunCooldown = 600;
                this.spaceship.properties.damageTakenToBoss = 15;
                this.boss.gunCooldown = 700;
                break;
                case "hard":
                    this.spaceship.properties.speed = 7;
                    this.spaceship.properties.gunCooldown = 1500;
                    this.spaceship.properties.damageTakenToBoss = 5;
                    this.boss.gunCooldown = 400;
                break;        
        }

      
    }

    

     
      //////////////////////////////////////////////////////////////////////////////////////////////////

      

       // Enemy Spaceships

      

       shootByEnemy(enemySpaceship){
       
          
            
                if(enemySpaceship.canShoot && !enemySpaceship.ifShot){
                    setTimeout(() => {
                        enemySpaceship.ifShot = !enemySpaceship.ifShot;
                        this.generateEnemyProjectile(enemySpaceship);
                        // console.log('wróg strzela!');
                     

                    }, enemySpaceship.gunCooldown);

                    enemySpaceship.ifShot = !enemySpaceship.ifShot;
                }
                                     
           
     }


     generateEnemyProjectile(enemySpaceship){

         
            enemySpaceship.projectiles.push({
                x: enemySpaceship.x,
                y: enemySpaceship.y,
                speed: 4.5,
                color: 'red',
                radius: 4,
              
            })
            // console.log( enemySpaceship.projectiles);

                  
        
    

   }
    
   drawEnemyProjectiles(enemySpaceship){
 
        enemySpaceship.projectiles.forEach((projectile, index) => {
            this.drawEnemyProjectile(projectile, index, enemySpaceship);
        })
       
    
}

    drawEnemyProjectile(projectile, index, enemySpaceship){
        this.ctx.save();
        projectile.y += projectile.speed;
        
        if(projectile.y > this.height){
            
                enemySpaceship.projectiles.splice(index, 1);

            
         
        }
        // if(enemySpaceship.length > 0){

        //     this.enemySpaceships.forEach((enemySpaceship, enemyIndex) =>{
            if(!this.didSpaceshipGetHit){
                if((projectile.x >= this.spaceship.x - (this.spaceship.width / 2) && projectile.x <= this.spaceship.x + (this.spaceship.width / 2)) && (projectile.y >= this.spaceship.y - (this.spaceship.height * 0.375) && projectile.y <= this.spaceship.y + (this.spaceship.height * 0.375))){
                    enemySpaceship.projectiles.splice(index, 1);
                   
                    this.spaceship.lives--;
                    this.immortalEffect()

                      
                   
                    }
                   
                    // console.log(this.spaceship.lives)
                }
        // }
        
        // 

        this.ctx.fillStyle = projectile.color;
        this.ctx.beginPath();
        this.ctx.arc(projectile.x + (this.spriteWidthPerCols / 2), projectile.y + this.spriteHeight, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        // console.log(this.movingProjectileY)
        this.ctx.restore();

    }

    immortalEffect(){
         this.didSpaceshipGetHit = !this.didSpaceshipGetHit;
         this.blinkingSpaceship()
         
        setTimeout(()=>{
            this.didSpaceshipGetHit = !this.didSpaceshipGetHit;
            cancelAnimationFrame(this.requestBlinkID);
        }, 3000)

    }
    blinkingSpaceship(currentTime){
    if(currentTime - this.beforeTimeBlinking > 100){ // 100ms = 10 blinks per second
        this.beforeTimeBlinking = currentTime;
        this.isSpaceshipVisible = !this.isSpaceshipVisible; // Toggle visibility
    }
    this.requestBlinkID = window.requestAnimationFrame((currentTime) => this.blinkingSpaceship(currentTime));
}

     destroyEnemy(index){
        this.enemySpaceships.splice(index, 1);
        switch(this.pickedMode){
            case "easy":
                this.score += 50;
                break;
            case "normal":
                this.score += 100;
                break;    
            case "hard":
                this.score += 200;
                break;        
        }
        
        // console.log(this.enemySpaceships.length)
       }

       moveEnemySpaceship(currentTime) {

         if(this.enemySpaceships.length <= 6){
            this.timeFrequency = 700; //10
        }else if(this.enemySpaceships.length >= 7 && this.enemySpaceships.length <= 12){
            this.timeFrequency = 175; // 40
        }else if(this.enemySpaceships.length >= 13 && this.enemySpaceships.length <= 18){
            this.timeFrequency = 250; // 70
        }else if(this.enemySpaceships.length >= 19 && this.enemySpaceships.length <= 24){
            this.timeFrequency = 500; // 150
        }else if(this.enemySpaceships.length >= 25 && this.enemySpaceships.length <= 30){
            this.timeFrequency = 700;
        }

    if (!this.isGameRunning) return;

    if (currentTime - this.beforeTime > this.timeFrequency) {
        this.beforeTime = currentTime;
        
       
        
        // Check for group-level collision and update positions
        this.checkEnemyCollision();

        // Move all spaceships horizontally
        this.enemySpaceships.forEach((enemySpaceship) => {
            enemySpaceship.x += enemySpaceship.speed;
        });
    }

    this.requestMoveID = window.requestAnimationFrame((currentTime) => this.moveEnemySpaceship(currentTime));
}

       checkEnemyCollision() {
    if (!this.isGameRunning) return;

    // Check if any spaceship in the group touches the right edge
    const touchedRightEdge = this.enemySpaceships.some(
        (enemySpaceship) => enemySpaceship.x + this.spriteWidthPerCols >= this.width
    );

    // Check if any spaceship in the group touches the left edge
    const touchedLeftEdge = this.enemySpaceships.some(
        (enemySpaceship) => enemySpaceship.x <= 0
    );

    if (touchedRightEdge) {
       

        // Move all spaceships down and reverse direction
        this.enemySpaceships.forEach((enemySpaceship) => {
            enemySpaceship.speed = -Math.abs(enemySpaceship.speed); // Move left
            enemySpaceship.y += this.height * 0.03;
        });

        // console.log('Group touched right edge');
    } else if (touchedLeftEdge) {
       

        // Move all spaceships down and reverse direction
        this.enemySpaceships.forEach((enemySpaceship) => {
            enemySpaceship.speed = Math.abs(enemySpaceship.speed); // Move right
            enemySpaceship.y += this.height * 0.03;
        });

        // console.log('Group touched left edge');
    }

    // Check if any spaceship crosses 70% of the screen height
    if (this.enemySpaceships.some((enemySpaceship) => enemySpaceship.y >= this.height * 0.7)) {
        this.restartGame();
    }
}
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   bossMove() {
      if (!this.isGameRunning) return;
    if (this.boss.y < (this.height / 2) - this.boss.height) {
        this.boss.y += 4;
    } else if (this.bossState === "arriving") {
        this.bossState = "paused";
        // Play audio only once
        if (!this.arrivalAudioPlayed) {
            const audio = new Audio('audio/Arrival.mp3');
            audio.play();

            this.arrivalAudioPlayed = true;
            // setTimeout(()=>{
                
               

            // }, 4000);
        }
        setTimeout(() => {
            this.bossState = "moving";
            this.arrivalAudioPlayed = false;

             document.addEventListener('keydown', this.keyDown);
                document.addEventListener('keyup', this.keyUp);
            
        }, 4000);
    }
}

    drawWhereToMove(){
          if (!this.isGameRunning) return;

        if (this.bossState === "moving") {
            this.boss.y += this.boss.speedY;
            this.boss.x += this.boss.speedX;
            this.checkScreenEdgeForBoss();
        }
    }



    checkScreenEdgeForBoss(){
     
        if(this.boss.x >= this.width - this.boss.width){
            // console.log('przekroczył prawą');
            this.boss.speedX = -Math.abs(this.boss.speedX);
            
        }else if(this.boss.x <= 0){
            // console.log('przekroczył lewą');
            this.boss.speedX = Math.abs(this.boss.speedX);
            
        }

        if(this.boss.y >= (this.height * 0.65) - this.boss.height){
            // console.log('przekroczył dolną')
            this.boss.speedY = -Math.abs(this.boss.speedY);
            
        }else if(this.boss.y <= 0){
            // console.log('przekroczył górną')

              this.boss.speedY = Math.abs(this.boss.speedY);
        }

         
        

    }



generateBossHealthBar(){
    const innerHealthBar = document.createElement('div');
    innerHealthBar.classList.add('inner-health-bar');


    const outerHealthBar = document.createElement('div');
    outerHealthBar.classList.add('outer-health-bar');

    outerHealthBar.appendChild(innerHealthBar);
    document.body.appendChild(outerHealthBar);

       
}

        shootByBoss(){
              if (!this.isGameRunning) return;
            if(!this.boss.ifShot){
                setTimeout(() => {
                    this.boss.ifShot = !this.boss.ifShot;
                    this.generateBossProjectileTrajectory();
                    // console.log('boss strzela!');
                

                }, this.boss.gunCooldown);

                this.boss.ifShot = !this.boss.ifShot;
            }
                                
                
            }

        generateBossProjectileTrajectory(){
              if (!this.isGameRunning) return;
                    // Calculate direction vector from boss to spaceship's current position
            const startX = this.boss.x + (this.boss.width / 2);
            const startY = this.boss.y + this.boss.height;
            const targetX = this.spaceship.x + (this.spaceship.width / 2);
            const targetY = this.spaceship.y + (this.spaceship.height / 2);

            const dx = targetX - startX;
            const dy = targetY - startY;
            const length = Math.sqrt(dx * dx + dy * dy);

            // Normalize and multiply by desired speed
            const speed = 4.5;
            const velocityX = (dx / length) * speed;
            const velocityY = (dy / length) * speed;

            this.generateBossProjectile(startX, startY, velocityX, velocityY)

            

            

            
        }

        generateBossProjectile(startX, startY, velocityX, velocityY){
              if (!this.isGameRunning) return;

            if(this.percentageOfBossHealth <= 25){
                        //    console.log('opcja c')
                              const newStartY = this.boss.y + this.boss.height * 0.7;
                const offset = 40;
                this.startYPlusOffset = 0; 
                const projectiles = 7;

                 for(let i = 1; i <= projectiles; i++){
                    if(i !== 4){
                                this.boss.projectiles.push({
                                x: startX + (i * offset) - 165,
                                y: startY,
                                velocityX: velocityX,
                                velocityY: velocityY,
                                color: 'green',
                                radius: 3
                            })
                    }else{
                        this.startYPlusOffset = (((projectiles - 1) * offset) / 2);
                        for(let j = 1; j <= projectiles; j++){
                             this.boss.projectiles.push({
                                x: startX - 5,
                                y: startY + this.startYPlusOffset,
                                velocityX: velocityX,
                                velocityY: velocityY,
                                color: 'green',
                                radius: 3.5
                            })
                             this.startYPlusOffset += -offset;

                        }
                    }
                                
                        }

                        return;
                           
            }else if(this.percentageOfBossHealth <= 50){
                        //    console.log('opcja b')
                  const newStartY = this.boss.y + this.boss.height * 0.7; 
                        //    console.log('opcja a')
                           
                           this.startYPlusOffset = 0;
                           const projectiles = 7;

                         for(let i = 1; i <= projectiles; i++){
                                this.boss.projectiles.push({
                                x: startX + (i * 20) -85,
                                y: this.setForY(newStartY, i, projectiles, 30),
                                velocityX: velocityX,
                                velocityY: velocityY,
                                color: 'green',
                                radius: 3.5
                            });
                           }

                           return;

                    
            }
            else if(this.percentageOfBossHealth <= 75){
                const projectiles = 3;

                         for(let i = 1; i <= projectiles; i++){
                                this.boss.projectiles.push({
                                x: startX + (i * 20) - 45,
                                y: startY,
                                velocityX: velocityX,
                                velocityY: velocityY,
                                color: 'green',
                                radius: 3.5
                            });
                           }
                           return;
                }

            this.boss.projectiles.push({
                x: startX,
                y: startY,
                velocityX: velocityX,
                velocityY: velocityY,
                color: 'green',
                radius: 3.5
            });
        }
      

        setForY(startY, i, n = 5, offset = 20 ){
          
            if(i > (n + 1) / 2){
                    this.startYPlusOffset += -offset;
                }else{
                    this.startYPlusOffset += offset;
                }
                
                return startY += this.startYPlusOffset;

                    
                
                
        }

        drawBossProjectiles(){
              if (!this.isGameRunning) return;

            for (let i = this.boss.projectiles.length - 1; i >= 0; i--) {
        const projectile = this.boss.projectiles[i];

        // Move projectile
        projectile.x += projectile.velocityX;
        projectile.y += projectile.velocityY;

        // Remove if out of bounds
        if (
            projectile.x < 0 || projectile.x > this.width ||
            projectile.y < 0 || projectile.y > this.height
        ) {
            this.boss.projectiles.splice(i, 1);
            continue;
        }
        if(!this.didSpaceshipGetHit){
            if((projectile.x >= this.spaceship.x && projectile.x <= this.spaceship.x + this.spaceship.width) &&
                (projectile.y >= (this.spaceship.y + this.spaceship.height / 2) && projectile.y  <= this.spaceship.y + this.spaceship.height)
        ){
      

            this.boss.projectiles.splice(i, 1);
            this.spaceship.lives--;
            this.immortalEffect()
            // console.log('trafiony')
        
        }
        }
        

        // Draw projectile
        this.ctx.save();
        this.ctx.fillStyle = projectile.color;
        this.ctx.beginPath();
        this.ctx.arc(projectile.x, projectile.y, projectile.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }
        }


        checkBossHealth(projectile, index){
              if (!this.isGameRunning) return;
                if(
                    (projectile.x >= this.boss.x - 40 && projectile.x <= this.boss.x + this.boss.width - 45) &&
                    (projectile.y >= this.boss.y && projectile.y <= this.boss.y + this.boss.height)
                ){
                    const innerHealthBar = document.querySelector('.inner-health-bar');
                    const outerHealthBar = parseInt(getComputedStyle(document.querySelector('.outer-health-bar')).width, 10);
                    
                    const healthBar = parseInt(getComputedStyle(innerHealthBar).width, 10);
                    let newHealthBar = healthBar - this.spaceship.properties.damageTakenToBoss;
                     
                    newHealthBar = Math.sign(newHealthBar) === -1 ? 0 : newHealthBar;
                    
                      this.percentageOfBossHealth = ((newHealthBar / outerHealthBar) * 100).toFixed('') * 1;

                    innerHealthBar.style.setProperty('width', `${newHealthBar}px`, 'important');
                    //   console.log(this.percentageOfBossHealth);
                    if(this.percentageOfBossHealth <= 0){
                        this.score += 1000;
                         const innerHealthBar = document.querySelector('.inner-health-bar');
                            if (innerHealthBar) {
                                innerHealthBar.remove();
                            }
                        this.showEndMenu()
                    }
                    else if(this.percentageOfBossHealth <= 25){
                            this.boss.speedX = Math.sign(this.boss.speedX) === 1 ? 5 : -5;
                            this.boss.speedY = Math.sign(this.boss.speedY) === 1 ? 5 : -5;
                            
                    }else if(this.percentageOfBossHealth <= 50){
                            this.boss.speedX = Math.sign(this.boss.speedX) === 1 ? 3.4 : -3.4;
                            this.boss.speedY = Math.sign(this.boss.speedY) === 1 ? 3.4 : -3.4;
                             this.boss.gunCooldown = 1500;
                    }else if(this.percentageOfBossHealth <= 75){
                            this.boss.speedX = Math.sign(this.boss.speedX) === 1 ? 2.3 : -2.3;
                            this.boss.speedY = Math.sign(this.boss.speedY) === 1 ? 2.3 : -2.3;
                            this.boss.gunCooldown = 700;
                    }

                    this.spaceship.projectiles.splice(index, 1);

                    this.ctx.restore();
                    // console.log('trafiony');
                    return;
                }
}

    showEndMenu(){
        cancelAnimationFrame(this.requestMoveID);
        cancelAnimationFrame(this.requestDrawID);
        this.isGameRunning = false;
        document.removeEventListener('keydown', this.keyDown);
        document.removeEventListener('keyup', this.keyUp);
        this.bossAudioMusic.pause();

        setTimeout(()=>{
                this.clearCanvas();
                document.body.innerHTML = '';
                const endGameMenuBox = document.createElement('div');
                const congratsText = document.createElement('p');
                congratsText.textContent = 'Congratulations!'

                const congratsText2 = document.createElement('p');
                congratsText2.textContent = 'You defeated the boss!';  

                const scoreText = document.createElement('p');
                scoreText.textContent = `Your score: ${this.score}` 

                const backToMenuBtn = document.createElement('button');
                backToMenuBtn.textContent = 'restart game';
                
                backToMenuBtn.addEventListener('click', ()=>{
                    document.body.innerHTML = '';
                    const menu = new Menu();
                    menu.init();
                })

                endGameMenuBox.classList.add('end-game-menu-box');
                endGameMenuBox.appendChild(congratsText);
                endGameMenuBox.appendChild(congratsText2);
                endGameMenuBox.appendChild(scoreText);
                endGameMenuBox.appendChild(backToMenuBtn);
                document.body.appendChild(endGameMenuBox);
                // const menu = new Menu();
                // menu.init();

            }, 4000)
        console.log('wygrałeś')

    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
       drawText(){
          if (!this.isGameRunning) return;
       let x = 50; 
       this.ctx.font = '28px Sixtyfour Convergence';
           
     
        this.ctx.fillText(`Points: ${this.score}`, 60, 60);

        this.ctx.fillText(`lives:  `, 60, 120)
        for(let i = 1; i <= this.spaceship.lives; i++){

            this.spaceship.imgMini.push(new Image());
            this.spaceship.imgMini[i - 1].src = 'images/spaceship60.png';
            this.ctx.drawImage(this.spaceship.imgMini[i - 1], 200 + x, 75);

            x += 70;
       
        }

      
       }
       putRoundText(){
            this.ctx.fillText(`Round ${this.currentRound}`, (this.width - 200) / 2, (this.height - 50) / 2); 
       }

    clearCanvas(){
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
     }

     draw(currentTime) {
    // 60 FPS lock
    const fps = 60;
    const framDuration = 1000 / fps; // ~16.67ms
    if (!this.lastDrawTime) this.lastDrawTime = currentTime;
    const delta = currentTime - this.lastDrawTime;

    if (delta < framDuration) {
        this.requestDrawID = window.requestAnimationFrame((t) => this.draw(t));
        return;
    }
    this.lastDrawTime = currentTime;

    this.clearCanvas();

    this.spaceship.shoot();
    this.spaceship.drawProjectiles();

    if (this.enemySpaceships.length > 0 && this.currentRound != 3) {
        if (!this.canEnemyShoot) {
            setTimeout(() => {
                this.canEnemyShoot = !this.canEnemyShoot;
                for (let i = 0; i < this.enemySpaceships.length; i++) {
                    this.canShoot(i);
                }
            }, 3000)
            this.canEnemyShoot = !this.canEnemyShoot;
        }

        this.enemySpaceships.forEach((enemySpaceship) => {
            this.shootByEnemy(enemySpaceship);
            this.drawEnemyProjectiles(enemySpaceship);

            if (currentTime - this.beforeTime2 > 150) {
                this.beforeTime2 = currentTime;
                this.frame = ++this.frame % this.frameMax;
                this.srcX = this.frame * this.spriteWidthPerCols;
            }
            this.ctx.drawImage(enemySpaceship.img, this.srcX, 0, this.spriteWidthPerCols, this.spriteHeight, enemySpaceship.x, enemySpaceship.y, this.spriteWidthPerCols, this.spriteHeight)
        })
    }

    if (this.currentRound === 3) {
        this.ctx.drawImage(this.boss.img, this.boss.x, this.boss.y);

        if (this.bossState === "arriving") {
            this.bossMove();
        } else if (this.bossState === "moving") {
            this.drawWhereToMove();
            this.shootByBoss();
            this.drawBossProjectiles();
        }
    }

    this.drawText();

    if (!this.didSpaceshipGetHit || (this.didSpaceshipGetHit && this.isSpaceshipVisible)) {
        this.ctx.drawImage(this.spaceship.img, this.spaceship.x, this.spaceship.y);
    }

    this.spaceship.move();

    if (this.spaceship.lives <= 0) return this.restartGame();
    if (this.enemySpaceships.length === 0 && this.currentRound != 3) {
        this.currentRound++;
        return this.nextRound()
    };

    this.requestDrawID = window.requestAnimationFrame((t) => this.draw(t));
}



     restartGame(){
        this.isGameRunning = false;
        cancelAnimationFrame(this.requestMoveID);
        cancelAnimationFrame(this.requestDrawID);
        if(this.bossAudioMusic !== undefined){

            this.bossAudioMusic.pause();
        }
        // this.spaceship.lives = 3;
        // this.points = 0;
        setTimeout(()=>{
            document.body.innerHTML = '';
            const menu = new Menu();
            menu.init();
        }, 4000);
       
     }

     canShoot(i){
        this.enemySpaceships[i].canShoot = false;
        const chance = Math.ceil(Math.random() * 3)
         if(chance === 3) {
            this.enemySpaceships[i].canShoot = true;
           
         };
     }
     nextRound(){
         this.isGameRunning = false;
         cancelAnimationFrame(this.requestMoveID);
         cancelAnimationFrame(this.requestDrawID);
        this.doesTouchedRightSide = null;
        this.doesTouchedLeftSide = null;

        this.requestMoveID = null;
        this.requestDrawID = null;
        this.spaceship.projectiles.length = 0; // Clear the projectiles array
        
        this.controls.key.w.pressed = false
        this.controls.key.a.pressed = false
        this.controls.key.s.pressed = false
        this.controls.key.d.pressed = false
        this.controls.key.spaceBar.pressed = false

        document.removeEventListener('keydown', this.keyDown);
        document.removeEventListener('keyup', this.keyUp);
      

        setTimeout(()=>{
          this.isGameRunning = true;
          this.clearCanvas();

             
            if(this.currentRound === 2){
                this.round2()
                this.loadEnemySpaceships();

            } else if(this.currentRound === 3){
                this.generateBossHealthBar()
               

                this.bossAudioMusic = new Audio('audio/bossMusic.mp3');
                this.bossAudioMusic.play();
                this.bossAudioMusic.volume = 0.45;
               
            }
            
          
            
            this.spaceship.x = this.width / 2 - (this.spaceship.width / 2);
            this.spaceship.y = this.height * 0.9 - (this.spaceship.height / 2);
            this.ctx.drawImage(this.spaceship.img, this.spaceship.x, this.spaceship.y);

            this.drawText();
             this.intervalIndex = setInterval(()=>{
                this.putRoundText();
          },50)
            
             

            this.isGameRunning = false;
                
            setTimeout(()=>{
                clearInterval(this.intervalIndex);
                this.isGameRunning = true;
                 
                    
                    this.draw();
                    if(this.currentRound === 2){
                        this.moveEnemySpaceship();
                        document.addEventListener('keydown', this.keyDown);
                        document.addEventListener('keyup', this.keyUp);
                    }
                
            },4000)
            
        }, 2000)

        
            
     }
     loadEnemySpaceships(){
         this.enemySpaceships.forEach((enemySpaceship)=>{
             enemySpaceship.img.addEventListener("load", () =>  this.ctx.drawImage(enemySpaceship.img, this.srcX, 0, this.spriteWidthPerCols, this.spriteHeight , enemySpaceship.x, enemySpaceship.y, this.spriteWidthPerCols, this.spriteHeight ));
                enemySpaceship.img.src = (this.width <= 1500) || (this.height <= 800) ? 'images/enemyShip736.png' : 'images/enemyShip.png';
                 
            
            })
     }
     checkDifficultyForGunCooldown(){
        if(this.pickedMode === 'easy'){
            return 6000;
        }else if(this.pickedMode ==='normal'){
            return 5000;
        }else{
            return 4000;
        }
     }
     setPositionAndCreateEnemies(){
        let spaceX = 0;
        let spaceY = 0;
        let percents = 0;
        let spaceXOffset = 0;
        let spaceYOffset = 0;

        if((this.width <= 1500) || (this.height <= 800)){
            percents = 0.2
            spaceXOffset = 70; 
            spaceYOffset = 80; 
        }else{
            percents = 0.2
            spaceXOffset = 120; 
            spaceYOffset = 100; 
        }
        


         for(let j = 0; j < 3; j++){ //j 3

   
          for(let i = 0; i < 10; i++){ //i 10
                this.enemySpaceships.push(
                            {
                    img: new Image(),
                    x: (this.width * percents) + spaceX,
                    y: (this.height * percents) + spaceY,
                    speed: 10,
                    canShoot: false,
                    gunCooldown: this.checkDifficultyForGunCooldown(),
                    ifShot: false, 
                    projectiles: [],
                    });
                    spaceX += spaceXOffset;
                    
                }
                spaceX = 0;
                spaceY += spaceYOffset;
            }
           

        // console.log(this.enemySpaceships[3].canShoot);

     }
     
     round2(){
        
        let spaceX = 0;
        let spaceY = 0;
        let percentsX = 0;
        let percentsY = 0;
        let spaceXOffset = 0;
        let spaceYOffset = 0;
        let multiplier = 0;

        if((this.width <= 1500) || (this.height <= 800)){
            percentsX = 0.3;
            percentsY = 0.08;
            spaceXOffset = 70; 
            spaceYOffset = 80; 
        }else{
            percentsX = 0.35;
            percentsY = 0.08;
            spaceXOffset = 120; 
            spaceYOffset = 100; 
        }
        


         for(let j = 6; j >= 1; j--){ //j 6
            
                spaceX += spaceXOffset * multiplier;
             

            for(let i = j; i >= 1; i--){
                
                     this.enemySpaceships.push(
                            {
                    img: new Image(),
                    x: (this.width *  percentsX) + spaceX,
                    y: (this.height * percentsY) + spaceY,
                    speed: 5,
                    canShoot: false,
                    gunCooldown: this.checkDifficultyForGunCooldown(),
                    ifShot: false, 
                    projectiles: [],
                    });
                    spaceX += spaceXOffset;
            }

   
        
             
                    
                multiplier += 0.5 
                spaceX = 0;
                spaceY += spaceYOffset;
            }
           
           
     }
    initCanvas(){
        this.canvas.width = this.width;
        this.canvas.height = this.height;

    
        // console.log(this.spriteWidth, this.spriteHeight)
        
        this.ctx.fillRect(0, 0, this.width, this.height);
         
        this.spaceship.imgMini.forEach(img => img.addEventListener('load', () => this.drawText()));
         
        this.spaceship.img.addEventListener("load", () => this.ctx.drawImage(this.spaceship.img, this.spaceship.x, this.spaceship.y));
         
        this.setPositionAndCreateEnemies()
        this.loadEnemySpaceships()
         
            
            
            // console.log(this.spriteWidthPerCols,  this.spriteHeight)
            
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);

            
        this.drawText();
           
        this.intervalIndex = setInterval(()=>{
                this.putRoundText();
          },50)
            
        setTimeout(()=>{
                
            clearInterval(this.intervalIndex);
            this.draw();
            this.moveEnemySpaceship();
            // console.log(this.enemySpaceships[2].canShoot)
        
            // console.log('Runda1')
            }, 3000)
    
         
        
    }
    run(){
        this.initCanvas();
     
    }
}

// const game = new SpaceInvaders(document.querySelector('#canvas'))
// game.run()

// game.generateProjectile();