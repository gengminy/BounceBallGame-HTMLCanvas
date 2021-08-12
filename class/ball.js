class Ball{
    constructor(_x=0, _y=0, _radius=10, _color="black", _canvas=null){
        this.x = _x;
        this.y = _y;
        this.$canvas = _canvas;

        this._config = {
            radius : _radius,
            maxGravity : 15,         //최대활강속도

            maxValocity : 3.6,
            gravityAccelator: 0.5,    //중력 가속도
            bounceAccelator: 7.5,    //반작용 가속도
            inertiaAccelator: 0.6,    //관성 가속도
            color : _color,
                        
            item : [],        //아이템

            moveLeftKey : 37,
            moveRightKey : 39,
            itemKey: 32
        };

        this._ = {
            dx : 0,
            dy : 0,

            leftPressed : false,
            rightPressed : false,
            onflying : false,        //화살표 블록에 의해 활강중일때

            dyingSequence: 0, //죽을때 나오는 이펙트 순서
            diedX: 0,
            diedY: 0,
            ondying : false,            //죽는 이펙트 나오는 중일때

            breakingSequence: 0,
            breakX: 0,
            breakY: 0,
            onbreaking: false    //블록 부수는 이펙트 나오는 중일때
        }

        
        if(this.$canvas!=null){
            this._.ctx = canvas.getContext("2d");
        }

        
        //this._audio = {}
        //this.initAudio();
        
    }
    
    getConfig = () => this._config
    getPos= () => ({x: this.x, y: this.y});
    getDelta = ()=> ({dx: this._.dx, dy:this._.dy});
    getRadius = ()=> this._config.radius;
    getMaxValocity = ()=>this._config.maxValocity;
    getDiedPos = ()=>({x: this._.diedX, y: this._.diedY})
    getBreakPos = ()=>({x: this._.breakX, y: this._.breakY})

    setDelta(dx, dy){this._.dx = dx; this._.dy = dy;}
    addDelta(dx=0, dy=0){this._.dx += dx, this._.dy += dy;}

    setDiedPos(x=0, y=0){this._.diedX = x; this._.diedY = y;}
    setBreakPos(x=0, y=0){this._.breakX = x; this._.breakY = y;}

    setColor(colorString){this._config.color = colorString;}

    emptyItem(){
        this._config.item = [];
        this.setColor(Block.style.ball.background);
    }
    setItem(_type){
        this._config.item.push(_type);

        if(_type == Block.type.dashItem){
            this.setColor(Block.style.ballWithDashItem.background);
        } else if(_type == Block.type.jumpItem){
            this.setColor(Block.style.ballWithJumpItem.background);
        }
    }

    useItem(){
        let _itemlist = this._config.item;
        if(_itemlist.length < 1) return;
        const _item = _itemlist.pop();

        if(_itemlist.length < 1) this.setColor(Block.style.ball.background);
        else{
            if(_itemlist[_itemlist.length-1] == Block.type.dashItem){
                this.setColor(Block.style.ballWithDashItem.background);
            } else if(_itemlist[_itemlist.length-1] == Block.type.jumpItem){
                this.setColor(Block.style.ballWithJumpItem.background);
            }
        }

        if(_item == Block.type.jumpItem){
            this.setDelta(0, -9);
        } else if(_item == Block.type.dashItem){
            if(this.isLeftPressed()) this.setDelta(-15, -6);
            else if(this.isRightPressed()) this.setDelta(15, -6);
        }
    }

    move(dx=0, dy=0){
        this.x += dx;
        this.y += dy;
    }

    draw(){
        if(this.$canvas == null) return;

        this._.ctx.beginPath();
        this._.ctx.arc(this.x, this.y, this._config.radius, 0, Math.PI*2);
        this._.ctx.fillStyle = this._config.color;
        this._.ctx.fill();
        this._.ctx.closePath();	
    }

    drawDyingEffect(){
        const x = this.getDiedPos().x;
        const y = this.getDiedPos().y;
        const i = this._.dyingSequence++;
        const ctx = this._.ctx;

        if(60 < i) this._.dyingSequence = 0;

        ctx.strokeStyle = "#FAD700";
        ctx.fillStyle = "#FFDE13";
        const drawFn = (_x,_y, _i, _mx, _my, _sx, _sy)=>{
            const _side = 30;
            const s = _i*3;
            const m = _side/9;
            const _r = _side/_i;
                                    
            ctx.beginPath();
            ctx.arc(_x+_mx*m+_sx*s, _y+_my*m+_sy*s, _r, 0, Math.PI*2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(_x+_mx*m+_sx*s, _y+_my*m+_sy*s, (_r-1>=0?_r-1:_r/10), 0, Math.PI*2);
            ctx.fill(); 	
        }
        
        drawFn(x, y, i, 1, 1, -1, -1);
        drawFn(x, y, i, -1, 1, 1, -1);
        drawFn(x, y, i, 1, -1, -1, 1);
        drawFn(x, y, i, -1, -1, 1, 1);
    }


     drawBreakingEffect(){
         const x = this.getBreakPos().x;
         const y = this.getBreakPos().y;
        const i = this._.breakingSequence++;
        const ctx = this._.ctx;

        if(60 < i) this._.dyingSequence = 0;

        ctx.strokeStyle = "#AAA";
        ctx.fillStyle = Block.style.broken.background;
        
        const drawFn = (_x,_y, _i, _mx, _my, _sx, _sy,_gx, _gy)=>{
            const _side = 30;
            const s = _i;
            const G = _i*_i/15;
            const m = _side/9;
            const _r = _side/5*2/_i;
                                    
            ctx.beginPath();
            ctx.arc(_x+_mx*m+_sx*s+G*_gx, _y+_my*m+_sy*s+G*_gy, _r, 0, Math.PI*2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(_x+_mx*m+_sx*s+G*_gx, _y+_my*m+_sy*s+G*_gy, _r*2/3, 0, Math.PI*2);
            ctx.fill(); 	
        }

        drawFn(x, y, i, 1, 1, -1, -1, -1, 1);
        drawFn(x, y, i, -1, 1, 1, -1, 1, 1);
        drawFn(x, y, i, 1, -1, -1, 1, 0, 1);
        drawFn(x, y, i, -1, -1, 1, 1, 0, 1);
    }                
   

    setPos(_x, _y){
        this.x = _x+this._config.radius;
        this.y = _y+this._config.radius;
    }

    setGravity(){
        let G = this._config.gravityAccelator;
        let A = this._config.inertiaAccelator;

        if(this._.dy + G <= this._config.maxGravity)
            this._.dy += G;


        if(this._.dx + A <= 0)
            this._.dx = Math.round(this._.dx+A);
        else if (this._.dx - A >= 0)
            this._.dx = Math.round(this._.dx - A);
    }

    isLeftPressed = ()=> this._.leftPressed;
    isRightPressed = ()=>this._.rightPressed;
    isFlying = ()=>this._config.onflying;
    isDying = ()=>this._config.ondying;
    isBreaking = ()=>this._config.onbreaking;
    setFlyingStatement(state=true){ this._config.onflying = state; }
    setDyingStatement(state=true){ this._config.ondying = state; this.setDiedPos(this.x+this._.dx,this.y+this._.dy); this._.dyingSequence= 0;}

    setBreakingStatement(state=true, x=0, y=0){ this._config.onbreaking = state; this.setBreakPos(x, y); this._.breakingSequence=0;}

    /* Keyboard Event */
    setKeyboardEvent(){
        document.addEventListener("keydown", (e)=>{
            if(e.keyCode == this._config.moveRightKey) this._.rightPressed = true;
            else if(e.keyCode == this._config.moveLeftKey) this._.leftPressed = true;
            else if(e.keyCode == this._config.itemKey) this.useItem();

            this.setFlyingStatement(false); //활강 중단
        });
        document.addEventListener("keyup", (e)=>{
            if(e.keyCode == this._config.moveRightKey) this._.rightPressed = false;
            else if(e.keyCode == this._config.moveLeftKey) this._.leftPressed = false;

            this.setFlyingStatement(false); //활강 중단
        });
    }

    initAudio(){
        /*
        const audioContext = new AudioContext();

        const buffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 1,
            audioContext.sampleRate
        );
        const channelData = buffer.getChannelData(0);
        for(let i=0; i<buffer.length; ++i)
            channelData[i] = Math.random() * 2 - 1;

        const primaryGainControl = audioContext.createGain();
        primaryGainControl.gain.setValueAtTime(0.05, 0);
        primaryGainControl.connect(audioContext.destination);

        this._audio.audioContext = audioContext;
        this._audio.buffer = buffer;
        this._audio.channelData = channelData;
        this._audio.primaryGainControl = primaryGainControl;
        */
    }
    createBoundSound(){
        /*
        const audioContext = this._audio.audioContext;
        const buffer = this._audio.buffer;
        const primaryGainControl = this._audio.primaryGainControl;

        const snareFilter = audioContext.createBiquadFilter();
        snareFilter.type = "lowpass";
        snareFilter.frequency.value = 800.0;
        snareFilter.connect(primaryGainControl);

        const whiteNoiseSource = audioContext.createBufferSource();
        whiteNoiseSource.buffer = buffer;

        const whiteNoiseGain = audioContext.createGain();
        whiteNoiseGain.gain.setValueAtTime(1000, audioContext.currentTime);
        whiteNoiseGain.gain.exponentialRampToValueAtTime(1.5, audioContext.currentTime+0.025);

        //vibrato
        const vibrato = audioContext.createOscillator();
        vibrato.frequency.setValueAtTime(18, audioContext.currentTime);
        const vibratoGain = audioContext.createGain();
        vibratoGain.gain.setValueAtTime(1.5, audioContext.currentTime);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(whiteNoiseGain);
        vibrato.start();
        //


        whiteNoiseSource.connect(whiteNoiseGain);
        whiteNoiseGain.connect(snareFilter);
        whiteNoiseSource.start();
        whiteNoiseSource.stop(audioContext.currentTime+0.1);

        const snareOscillator = audioContext.createOscillator();
        snareOscillator.type = "triangle";
        snareOscillator.frequency.setValueAtTime(80, audioContext.currentTime);

        const oscillatorGain = audioContext.createGain();
        oscillatorGain.gain.setValueAtTime(200, audioContext.currentTime);
        oscillatorGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        snareOscillator.connect(oscillatorGain);
        oscillatorGain.connect(primaryGainControl);
        snareOscillator.start();
        snareOscillator.stop(audioContext.currentTime + 0.2);
        */
    }
}