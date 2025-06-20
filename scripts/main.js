import SpaceInvaders from "./game.js";
export default class gameMenu{
    constructor(){
        this.modes = []
        this.pickedMode = undefined;
      
        
    }
 
   init(){
       const menuBox = document.createElement('div');
       menuBox.setAttribute('class', 'game-menu-box');
      

       const menuStart = document.createElement('div');
       menuStart.setAttribute('class', 'game-menu__start');
       menuStart.innerHTML = `<p class="game-menu__start-paragraph">start game</p>`;
       menuStart.addEventListener('click', ()=> this.startGame());

       this.menuStart = menuStart;

       const menuDifficulty = document.createElement('div');
       menuDifficulty.setAttribute('class', 'game-menu__difficulty');
       menuDifficulty.innerHTML = `<p class="game-menu__difficulty-paragraph">difficulty</p>`;
       menuDifficulty.addEventListener('click', ()=> this.showDifficulty());

       menuBox.appendChild(menuStart);
       menuBox.appendChild(menuDifficulty);
       document.body.appendChild(menuBox);

        this.menu = menuBox;   

       const canvas = document.createElement('canvas');
       canvas.setAttribute('id', 'canvas');
        this.canvas = canvas

         
}
startGame(){
    document.body.innerHTML = ''
    document.body.appendChild(this.canvas)
    this.game = new SpaceInvaders(this.canvas, this.pickedMode)
    // console.log(this.pickedMode)
    this.game.run();
}
showDifficulty(){
   document.body.innerHTML = '';
   
   const difficultyBox = document.createElement('div')
   difficultyBox.setAttribute('class', 'difficulty-box');
   const difficultyBoxChoose = document.createElement('div')
   difficultyBoxChoose.setAttribute('class', 'difficulty-box__choose');

   const easyModeEl =  document.createElement('p')
   easyModeEl.setAttribute('class', 'difficulty-box__choose-easy-mode');
   easyModeEl.textContent = 'easy';
   easyModeEl.addEventListener('click', () => this.pickMode('easy'))

   this.easyModeEl = easyModeEl;

   const normalModeEl =  document.createElement('p')
   normalModeEl.setAttribute('class', 'difficulty-box__choose-normal-mode');

   

   normalModeEl.textContent = 'normal';
   normalModeEl.addEventListener('click', () => this.pickMode('normal'))

   this.normalModeEl = normalModeEl;

   const hardModeEl =  document.createElement('p')
   hardModeEl.setAttribute('class', 'difficulty-box__choose-hard-mode');
   hardModeEl.textContent = 'hard';
   hardModeEl.addEventListener('click', () => this.pickMode('hard'))

   this.hardModeEl = hardModeEl;

   const difficultyBoxBack = document.createElement('div')
   difficultyBoxBack.setAttribute('class', 'difficulty-box__back');
   const goBackEl = document.createElement('p')
   goBackEl.setAttribute('class', 'go-back');
   goBackEl.textContent = 'back';
   goBackEl.addEventListener('click', () => this.goBackToMenu());


        if(this.pickedMode === 'easy'){
            easyModeEl.classList.add('active');
        }else if(this.pickedMode === 'normal'){
            normalModeEl.classList.add('active');
        }else if(this.pickedMode === 'hard'){
            hardModeEl.classList.add('active');
        }else{
            normalModeEl.classList.add('active');
        }
             
   difficultyBoxChoose.appendChild(easyModeEl);
   difficultyBoxChoose.appendChild(normalModeEl);
   difficultyBoxChoose.appendChild(hardModeEl);
   difficultyBoxBack.appendChild(goBackEl);

   difficultyBox.appendChild(difficultyBoxChoose);
   difficultyBox.appendChild(difficultyBoxBack);

   this.difficultySection = difficultyBox;
   document.body.appendChild(this.difficultySection);

   this.modes = [this.easyModeEl, this.normalModeEl, this.hardModeEl];
   

}

goBackToMenu(){
    document.body.innerHTML = '';
    document.body.appendChild(this.menu);
}

pickMode(mode){
    

    const pickedMode = mode;
    this.modes.forEach((mode)=>{
        
        mode.classList.remove('active');
        if(pickedMode === mode.textContent){

            mode.classList.add('active');
            this.pickedMode = mode.textContent;
               
    
           
        }
    });
    

}

     
}
const menu = new gameMenu();
menu.init();
 


