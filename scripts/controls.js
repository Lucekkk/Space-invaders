export default class Controls{
    constructor(){
  this.key = {
            w: {pressed: false},
            a: {pressed: false},
            s: {pressed: false},
            d: {pressed: false},
            spaceBar: {pressed: false}

        }

        this.boundKeyDown = this.keyDown.bind(this);
        this.boundKeyUp = this.keyUp.bind(this);
    }
        //CONTROLS

    keyDown(e){
        //   console.log(e.key)
        switch (e.key){
            //left
            case 'a':
            case 'A':
            case 'ArrowLeft':    
                this.key.a.pressed = true;      
                break;
            //up
            case 'w':
            case 'W':
            case 'ArrowUp':    
                this.key.w.pressed = true;      
                break;
            //right
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.key.d.pressed = true;      
               break; 
            //down
            case 's':
            case 'S':
            case 'ArrowDown':
                this.key.s.pressed = true;      
                break;
            //Spacebar
            case ' ':
            case 'Clear':    
                this.key.spaceBar.pressed = true;      
                break;
                   
        }
    }

    keyUp(e){
        switch(e.key){
                   //left
                   case 'a':
                   case 'A':
                   case 'ArrowLeft':
                       this.key.a.pressed = false;     
                       break;
                   //up
                   case 'w':
                   case 'W':
                   case 'ArrowUp': 
                       this.key.w.pressed = false;      
                       break;
                   //right
                   case 'd':
                   case 'D':
                   case 'ArrowRight':  
                       this.key.d.pressed = false;      
                      break; 
                   //down
                   case 's':
                   case 'S':
                   case 'ArrowDown':  
                       this.key.s.pressed = false;      
                       break;
                    // Spacebar
                    case ' ':
                    case 'Clear':    
                        this.key.spaceBar.pressed = false;   
                        break;                 
               }
           }
}