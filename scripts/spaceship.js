export default class Spaceship{
    constructor(screenWidth, screenHeight, controls, game){
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.controls = controls;
        this.game = game;

        this.properties = {
            width: (this.screenWidth <= 1500) || (this.screenHeight <= 800) ? 60 : 80,
            height: (this.screenWidth <= 1500) || (this.screenHeight <= 800) ? 60 : 80,
            img: new Image(),
            x: (this.screenWidth <= 1500) || (this.screenHeight <= 800) ? (this.screenWidth / 2) - 30 : (this.screenWidth / 2) - 40,
            y: (this.screenWidth <= 1500) || (this.screenHeight <= 800) ? (this.screenHeight * 0.9) - 30 : (this.screenHeight * 0.9) - 40,
            speed: 10,
            gunCooldown: 1000,
            ifShot: false, 
            projectiles: [],
            lives: 3,
            imgMini: [new Image(), new Image(), new Image()],
            damageTakenToBoss: 7
        }

         this.properties.img.src = (this.screenWidth <= 1500) || (this.screenHeight <= 800) ? 'images/spaceship60.png' : 'images/spaceship.png';
    }

    // Convenience getters for easy access to spaceship properties
    get x() { return this.properties.x; }
    get y() { return this.properties.y; }
    get width() { return this.properties.width; }
    get height() { return this.properties.height; }
    get lives() { return this.properties.lives; }
    get projectiles() { return this.properties.projectiles; }
    get img() { return this.properties.img; }
    get imgMini() { return this.properties.imgMini; }

    // Convenience setters
    set x(value) { this.properties.x = value; }
    set y(value) { this.properties.y = value; }
    set lives(value) { this.properties.lives = value; }

     move(){
          if (!this.game.isGameRunning) return;

        let dx = 0; // Change in x
        let dy = 0; // Change in y

        if (this.controls.key.w.pressed) {
            dy -= this.properties.speed;
        }
        if (this.controls.key.a.pressed) {
            dx -= this.properties.speed;
        }
        if (this.controls.key.s.pressed) {
            dy += this.properties.speed;
        }
        if (this.controls.key.d.pressed) {
            dx += this.properties.speed;
        }
        
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        const normalizationFactor = Math.sqrt(2);
        dx /= normalizationFactor;
        dy /= normalizationFactor;
    }
     
    // Update spaceship position
    const percentageX = Math.round((this.properties.x / (this.screenWidth - this.properties.width)) * 100);
    const percentageY = Math.round((this.properties.y / (this.screenHeight - this.properties.width)) * 100);

    if (percentageX > 0 || dx > 0) {
        if (percentageX < 100 || dx < 0) {
            this.properties.x += dx;
        }
    }
    if (percentageY > 75 || dy > 0) {
        if (percentageY < 100 || dy < 0) {
            this.properties.y += dy;
        }
    }
      }

      // Spaceship shooting
       
       shoot(){
          if (!this.game.isGameRunning) return;

          if(this.controls.key.spaceBar.pressed && !this.properties.ifShot){
             
                    // console.log('strzela');
                    this.generateProjectile();
                    this.properties.ifShot = !this.properties.ifShot;
                    const shootAudio = new Audio('audio/shoot.mp3');
                    
                    shootAudio.play();
                    
                    setTimeout(()=> {
                        this.properties.ifShot = !this.properties.ifShot;

                    }, this.properties.gunCooldown)
                                    
              }
       }


       generateProjectile(){
          if (!this.game.isGameRunning) return;
         
            this.properties.projectiles.push({
                x: this.properties.x,
                y: this.properties.y,
                speed: 4.5,
                color: 'white',
                radius: 3.5,
              
            })
        
        
        // console.log(this.spaceship.projectiles);
       }

       drawProjectiles(){
        if (!this.game.isGameRunning) return;
        this.properties.projectiles.forEach((projectile, index) => {
            this.drawProjectile(projectile, index);
        })
       }

       drawProjectile(projectile, index){
        if (!this.game.isGameRunning) return;
            this.game.ctx.save();
            projectile.y -= projectile.speed;

            // Remove projectile if it leaves the screen
            if(projectile.y < 0){
                this.properties.projectiles.splice(index, 1);
                this.game.ctx.restore();
                return;
            }

            // Check collision with all enemies
            for(let enemyIndex = 0; enemyIndex < this.game.enemySpaceships.length; enemyIndex++) {
                const enemySpaceship = this.game.enemySpaceships[enemyIndex];
                if(
                    (projectile.x >= enemySpaceship.x - (this.game.spriteWidthPerCols / 2) && projectile.x <= enemySpaceship.x + (this.game.spriteWidthPerCols / 2)) &&
                    (projectile.y >= enemySpaceship.y && projectile.y <= enemySpaceship.y + this.game.spriteHeight )
                ){
                    this.properties.projectiles.splice(index, 1);
                    this.game.destroyEnemy(enemyIndex);
                    
                    const explosionAudio = new Audio('audio/explosion.mp3');
                    explosionAudio.volume = 0.45;
                    explosionAudio.play();
                    this.game.ctx.restore();
                    return; // Stop further processing for this projectile
                }
            }

            if(this.game.currentRound === 3){
                this.game.checkBossHealth(projectile, index)

            }

            // Draw projectile if not removed
            this.game.ctx.fillStyle = projectile.color;
            this.game.ctx.beginPath();
            this.game.ctx.arc(projectile.x + (this.properties.width / 2), projectile.y, projectile.radius, 0, 2 * Math.PI);
            this.game.ctx.fill();
            this.game.ctx.restore();
}
}