class Stage{
    constructor(_side=600, _blockSize=30, $canvas=null, ball=null){
        this.map = [];
        this._config = {
            startingPoint: {x: 100, y: 100},
            side: _side,
            blockSize: _blockSize,
            order: 1,

            deathCount: 0
        }
        this._link = {
            $canvas: $canvas,
            ball: ball
        }
        this._ = {
            mapList: myStage
        }

        if($canvas != null){
            this._.ctx = canvas.getContext("2d");
        }
        this.initializeMap();

        this.blockList = [];

        this.textList = {
            10: "Press 'SpaceBar' to double jump!",
            15: "Press 'SpaceBar' to dash!"
        };

    }

    initializeMap(){
        let blockCount = Math.floor(this._config.side/this._config.blockSize);
        for(let i=0; i< blockCount; ++i){
            let p = [];
            for(let j=0; j<blockCount; ++j){
                p.push(0);
            }
            this.map.push(p);
        }
    }


    
    setMap(idx=1){
        this.map = this._.mapList[idx];
        this._link.ball.emptyItem();
        this._config.order = idx+1;
        this.createMap();
    }
    setNextMap(){
        if(this._config.order < this._.mapList.length){
            this._link.ball.setFlyingStatement(false);
            this.setMap(this._config.order++);
        }
        else console.log('This is the last map');
    }

    getStageOrder = ()=>this._config.order;

    setStartingPoint(x, y){
        if(0 < x && x < this._link.$canvas.width && 0 < y && y < this._link.$canvas.height){
            this._config.startingPoint = {x: x, y: y};
        }
        else throw('startingPoint :: position invalid');
    }

    revive(){    //부활
        let pos = this._config.startingPoint;
        const origColor = this._link.ball._config.color;
      
        this._config.deathCount++;

        this._link.ball.setDyingStatement(true);
        this._link.ball.setDelta(0, 0);
        this._link.ball.setPos(-10, -10);
        setTimeout(()=>{
            this._link.ball.setFlyingStatement(false);
            this._link.ball.setDyingStatement(false);
            this._link.ball.setGravity();
            this.setMap(this._config.order-1);
            this._link.ball.setDelta(0, 0);
        }, 500);
        
    }

    
    setBlockBreakEffect(_x, _y){    //블록부수는이펙트
        this._link.ball.setBreakingStatement(true, _x, _y);
        setTimeout(()=>{
            this._link.ball.setBreakingStatement(false);
        }, 300);
        
    }


    createBlock(x, y, type=1){
        const side = this._config.blockSize;
        const spikeSize = side/7*4;
        const bt = Block.type;
        switch(type){
            case bt.empty: break;
            case bt.default: case bt.jump: case bt.broken:
            case bt.rightShoot: case bt.leftShoot:
            case bt.test:

            //pannels
            case bt.upPannel: case bt.downPannel: case bt.leftPannel: case bt.rightPannel:
                this.blockList.push(new Block(x, y, side, side, type));
            break;

            //spikes
            case bt.upSpike: this.blockList.push(new Block(x, y, side, spikeSize, type)); break;
            case bt.downSpike: this.blockList.push(new Block(x, y, side, spikeSize, type)); break;
            case bt.leftSpike: this.blockList.push(new Block(x+side-spikeSize, y, spikeSize, side, type)); break;
            case bt.rightSpike: this.blockList.push(new Block(x, y, spikeSize, side, type)); break;

            //items
            case bt.jumpItem: this.blockList.push(new Block(x+side/3, y+side/3, side/3, side/3, type)); break;
            case bt.dashItem: this.blockList.push(new Block(x+side/3, y+side/3, side/3, side/3, type)); break;

            case bt.text: this.blockList.push(new Block(x+side/2, y+side/2, 0, 0, type)); break;

            case bt.ball:
                this._link.ball.setPos(x+side/2, y+side/2);
                this._link.ball.setDelta(0, 0);
                this.setStartingPoint(x+side/2,y+side/2);
            break;
        }
    }

    createMap(){
        let s = this._config.blockSize;
        this.blockList = [];

        for(let i in this.map){
            for(let j in this.map[i]){
                this.createBlock(j*s, i*s, this.map[i][j]);
            }
        }
    }

    drawBlock(){
        //모서리가 둥근 사각형 그리는 함수
        const roundedRect = (_x, _y, _r, _side)=>{
            const side = _side
            const ox = _x+1;
            const oy = _y+1;

            //background
            ctx.beginPath();
            ctx.moveTo(ox+_r, oy);
            ctx.lineTo(ox+side-_r-2, oy);
            ctx.arc(ox+side-_r-2, oy+_r, _r, Math.PI*3/2, Math.PI*2, false);
            ctx.lineTo(ox+side-2, oy+side-_r-2);
            ctx.arc(ox+side-_r-2, oy+side-_r-2, _r, 0, Math.PI/2, false);
            ctx.lineTo(ox+_r, oy+side-2);
            ctx.arc(ox+_r, oy+side-_r-2, _r, Math.PI/2, Math.PI, false);
            ctx.lineTo(ox, oy+_r);
            ctx.arc(ox+_r, oy+_r, _r, Math.PI, Math.PI*3/2, false);
            ctx.fill();

            //border
            ctx.beginPath();
            ctx.moveTo(ox+_r, oy);
            ctx.lineTo(ox+side-_r-2, oy);
            ctx.arc(ox+side-_r-2, oy+_r, _r, Math.PI*3/2, Math.PI*2, false);
            ctx.lineTo(ox+side-2, oy+side-_r-2);
            ctx.arc(ox+side-_r-2, oy+side-_r-2, _r, 0, Math.PI/2, false);
            ctx.lineTo(ox+_r, oy+side-2);
            ctx.arc(ox+_r, oy+side-_r-2, _r, Math.PI/2, Math.PI, false);
            ctx.lineTo(ox, oy+_r);
            ctx.arc(ox+_r, oy+_r, _r, Math.PI, Math.PI*3/2, false);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        
        //(_cx, _cy)를 중심점으로 갖는 삼각형 그리는 함수
        const drawTriangle = (_cx, _cy, _side, type)=>{
            const s = _side/2;
            const pi = Math.PI;
            const h = s/Math.sin(pi/3);
            let p1, p2, p3;

            switch(type){
                case Block.type.upPannel: default:
                    p1 = {x: _cx-s-1, y: _cy+s}
                    p2 = {x: _cx, y: _cy-h}
                    p3 = {x: _cx+s+1, y: _cy+s}
                break;
                case Block.type.downPannel:
                    p1 = {x: _cx-s-1, y: _cy-h}
                    p2 = {x: _cx, y: _cy+s}
                    p3 = {x: _cx+s+1, y: _cy-h}
                break;
                case Block.type.leftPannel:
                    p1 = {x: _cx+s, y: _cy-s-1}
                    p2 = {x: _cx-h, y: _cy}
                    p3 = {x: _cx+s, y: _cy+s+1}
                break;
                case Block.type.rightPannel:
                    p1 = {x: _cx-s, y: _cy-s-1}
                    p2 = {x: _cx+h, y: _cy}
                    p3 = {x: _cx-s, y: _cy+s+1}
                break;
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.fill();
        }		

        //박스 내부에 화살표 그리는 함수
        const drawArrow = (_x, _y, _side, _type)=>{
            let s1, s2, s3;
            if(_type == Block.type.leftShoot){
                s1 = _side/7*6;
                s2 = _side/7*3;
                s3 = _side/7;
            } else if(_type == Block.type.rightShoot){
                s1 = _side/7;
                s2 = _side/7*4;
                s3 = _side/7*6;
            }
            ctx.moveTo(_x+s1, _y+_side/10*4);
            ctx.lineTo(_x+s2, _y+_side/10*4);
            ctx.lineTo(_x+s2, _y+_side/10*2.5);
            ctx.lineTo(_x+s3, _y+_side/10*5);
            ctx.lineTo(_x+s2, _y+_side/10*7.5);
            ctx.lineTo(_x+s2, _y+_side/10*6);
            ctx.lineTo(_x+s1, _y+_side/10*6);
            ctx.lineTo(_x+s1, _y+_side/10*4);
            ctx.fill();
        }

        //각 방향에 맞는 가시 그리는 함수
        const drawSpike = (_x, _y, _side, _type)=>{
            let nx, ny, nh;
            const s = _side;
            ctx.fillStyle = Block.style.spike.background;
            ctx.strokeStyle = Block.style.spike.border;
            if(_type == Block.type.upSpike || _type == Block.type.downSpike){
                if(_type == Block.type.upSpike){ nx = _x; ny = _y; nh = _y+s/7*3; }
                else if(_type == Block.type.downSpike){ nx = _x; ny = _y-s+1; nh = _y+s/7*4; }
                ctx.beginPath();
                ctx.moveTo(nx+2, ny-1+s);
                ctx.lineTo(nx + s/6, nh+1);
                ctx.lineTo(nx + s/6*2, ny-1+s);
                ctx.lineTo(nx + s/6*3, nh+1);
                ctx.lineTo(nx + s/6*4, ny-1+s);
                ctx.lineTo(nx + s/6*5, nh+1);
                ctx.lineTo(nx-2 + s, ny-1+s);
                ctx.lineTo(nx+2, ny-1+s);
                ctx.fill();
                ctx.moveTo(nx+1, ny+s);
                ctx.lineTo(nx + s/6, nh);
                ctx.lineTo(nx + s/6*2, ny+s);
                ctx.lineTo(nx + s/6*3, nh);
                ctx.lineTo(nx + s/6*4, ny+s);
                ctx.lineTo(nx + s/6*5, nh);
                ctx.lineTo(nx-1 + s, ny+s);
                ctx.lineTo(nx+1, ny+s);
                ctx.stroke();
            } else if(_type == Block.type.leftSpike || _type == Block.type.rightSpike){
                 if(_type == Block.type.leftSpike){ nx = _x-s/7*3-1; ny = _y; nh = nx+s/7*3; }
                 else if(_type == Block.type.rightSpike){ nx = _x-s+1; ny = _y; nh = _x+s/7*4; }
                ctx.beginPath();
                ctx.moveTo(nx-1+s, ny+2);
                ctx.lineTo(nh+2, ny+s/6);
                ctx.lineTo(nx-1+s, ny + s/6*2);
                ctx.lineTo(nh+1, ny + s/6*3);
                ctx.lineTo(nx-1+s, ny+s/6*4);
                ctx.lineTo(nh+1, ny+s/6*5);
                ctx.lineTo(nx-1+s, ny-2+s);
                ctx.lineTo(nx-1+s, ny+2);
                ctx.fill();
                ctx.moveTo(nx+s, ny+1);
                ctx.lineTo(nh, ny+s/6);
                ctx.lineTo(nx+s, ny + s/6*2);
                ctx.lineTo(nh, ny + s/6*3);
                ctx.lineTo(nx+s, ny+s/6*4);
                ctx.lineTo(nh, ny+s/6*5);
                ctx.lineTo(nx+s, ny-1+s);
                ctx.lineTo(nx+s, ny+1);
                ctx.stroke();
            }
        }

        const bt = Block.type;
        const bs = Block.style;

        for(let i in this.blockList){
            const b = this.blockList[i];

            const x = b.x;
            const y = b.y;
            const side = this._config.blockSize;
            const type = b.type;
            const ctx = this._.ctx;
            const triSide = side/3;

            ctx.beginPath();

            switch(type){
                case bt.default:    //default
                    ctx.fillStyle = bs.default.background;
                    ctx.strokeStyle = bs.default.border;
                    roundedRect(x,y,2,side);
                break;

                case bt.jump:    //jump block
                    ctx.fillStyle = bs.jump.background;
                    ctx.strokeStyle = bs.jump.border;
                    roundedRect(x,y,2,side);
                break;

                case bt.broken:    //broken block
                    const s = side/9*4-2;
                    const v = side/9*5-2;
                    const nx = x+2;
                    const ny = y+2;

                    const drawFn = (_x, _y, _side)=>{
                        ctx.strokeStyle = bs.broken.border;
                        ctx.strokeRect(_x, _y, _side, _side);
                        ctx.fillStyle = bs.broken.background;
                        ctx.fillRect(_x, _y, _side, _side);
                    }
                    drawFn(nx, ny, s);
                    drawFn(nx, ny+v, s);
                    drawFn(nx+v, ny, s);
                    drawFn(nx+v, ny+v, s);
                break;

                case bt.upSpike: case bt.downSpike: case bt.leftSpike: case bt.rightSpike:
                    drawSpike(x, y, side ,type);
                break;

                //horizontal shoot
                case bt.rightShoot: case bt.leftShoot:
                    ctx.fillStyle = bs.rightShoot.background;
                    ctx.strokeStyle = bs.rightShoot.border;
                    roundedRect(x, y, 2, side);

                    ctx.beginPath();
                    ctx.fillStyle = bs.rightShoot.arrow;
                    drawArrow(x, y, side, type);

                break;

                //verticalPannel
                case bt.upPannel: case bt.downPannel:
                    ctx.fillStyle = bs.verticalPannel.background;
                    ctx.strokeStyle = bs.verticalPannel.border;
                    roundedRect(x, y, 2, side);
                    ctx.fillStyle = bs.verticalPannel.arrow;
                    drawTriangle(x+side/2, y+side/2, triSide, type);
                break;

                //horizontalPannel
                case bt.leftPannel: case bt.rightPannel:
                    ctx.fillStyle = bs.horizontalPannel.background;
                    ctx.strokeStyle = bs.horizontalPannel.border;
                    roundedRect(x, y, 2, side);
                    ctx.fillStyle = bs.horizontalPannel.arrow;
                    drawTriangle(x+side/2, y+side/2, triSide, type);
                break;

                case bt.jumpItem: case bt.dashItem:
                    const _s = b._vertical;
                    if(type == bt.jumpItem){
                        ctx.fillStyle = bs.jumpItem.background;
                        ctx.strokeStyle = bs.jumpItem.border;
                    } else if(type == bt.dashItem){
                        ctx.fillStyle = bs.dashItem.background;
                        ctx.strokeStyle = bs.dashItem.border;
                    }
                    ctx.beginPath();
                    ctx.arc(x+_s/2, y+_s/2, _s/2, 0, Math.PI*2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x+_s/2, y+_s/2, _s/2, 0, Math.PI*2);
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.lineWidth = 1;
                break;

                case bt.text:
                    const _text = this.textList[this.getStageOrder()] ?? false;
                    if(!_text) break;

                    Stage.drawText(x, y, _text, "15px", 1.2, "black", "san-serif", "center");
                break;

                case bt.test: //test
                    const _r = side/8;
                    ctx.beginPath();
                    ctx.arc(x+side/4, y+side/4, _r, 0, Math.PI*2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x+side/4*3, y+side/4, _r, 0, Math.PI*2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x+side/4, y+side/4*3, _r, 0, Math.PI*2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x+side/4*3, y+side/4*3, _r, 0, Math.PI*2);
                    ctx.stroke();

                break;
            }
            
            ctx.closePath();
        }
    }



    collisionDetectX(){
         if(!this._link.ball) return;

         const bx = this._link.ball.x; //ballX
         const by = this._link.ball.y;   
         const dx = this._link.ball._.dx;
         const r = this._link.ball._config.radius;

         const bt = Block.type;

         for(let i in this.blockList){
            const g = this.blockList[i];
            const gLeft = g.x;
            const gRight = g.x + g._horizon;
            const type = g.type;
                
            if(!g.inBlock(bx+dx+r, by) && !g.inBlock(bx+dx-r, by)) continue;

            if(bx <= gLeft && gLeft <= bx + r + dx){ //left bounce


                switch(type){
                    case bt.upSpike: case bt.downSpike: case bt.leftSpike: case bt.rightSpike:
                        this.revive();
                        return true;
                    case bt.jumpItem: case bt.dashItem:
                        this.blockList.splice(i, 1); 
                        this._link.ball.setItem(g.type);
                        return false;						
                }
                this._link.ball.setFlyingStatement(false);							
                this._link.ball._.dx = -4.5;
                this._link.ball.move(g.x - bx - r, 0);
                return true;
                
            } else if(bx - r + dx <= gRight && gRight <= bx){ //right bounce
                switch(type){
                    case bt.upSpike: case bt.downSpike: case bt.leftSpike: case bt.rightSpike:
                        this.revive();
                        return true;
                    case bt.jumpItem: case bt.dashItem:
                        this.blockList.splice(i, 1); 
                        this._link.ball.setItem(g.type);
                        return false;									
                }
                this._link.ball.setFlyingStatement(false);							
                this._link.ball._.dx = 4.5;
                this._link.ball.move(-(bx - r - gRight), 0);
                return true;
            }
         }
         return false;
    }

    collisionDetectY(){
        if(!this._link.ball) return;

        const bx = this._link.ball.x;
        const by = this._link.ball.y;    //ballY

        const dy = this._link.ball._.dy;
        const r = this._link.ball._config.radius;

        const G = this._link.ball._config.bounceAccelator; //반사 가속도

        const bt = Block.type; //블록타입
        

        for(let i in this.blockList){
            const g = this.blockList[i];        //ground

            const gTop = g.y;
            const gBottom = g.y + g._vertical;
            const gLeft = g.x;
            const gRight = g.x + g._horizon;

            if(!g.inBlock(bx, by+dy-r) && !g.inBlock(bx, by+dy+r)) continue;
            
            if(by - r + dy <= gBottom && gBottom <= by){	//down bounce
                switch(g.type){
                    case bt.downSpike: case bt.leftSpike: case bt.rightSpike:
                        this.revive();
                        return true;
                    case bt.jumpItem: case bt.dashItem:
                        this.blockList.splice(i, 1); 
                        this._link.ball.setItem(g.type);
                        return false;					

                    default: this._link.ball._.dy = -dy;
                }											
                this._link.ball.move(0, by - (g.y + g._vertical) + r);
                return true;
            }
            else if(gTop < by + r + dy){ //up bounce

                switch(g.type){
                    case bt.jump: 
                        this._link.ball._.dy = -G*1.6;
                        return true; //jump block;
                    case bt.broken:
                        this.blockList.splice(i, 1); 
                        this.setBlockBreakEffect(gLeft + g._horizon/2, gTop + g._vertical/2);
                        this._link.ball.createBoundSound();
                        this._link.ball._.dy = -G;
                        break; //broken block;
                    case bt.upSpike: case bt.leftSpike: case bt.rightSpike:    //up spike block
                        this.revive();
                        return true;
                    case bt.rightShoot:  //right shoot
                        this._link.ball.setPos(g.x + g._horizon + r, g.y+g._vertical/2-r);
                        this._link.ball.setDelta(10, 0);
                        this._link.ball.setFlyingStatement(true);
                        return true;
                    break;
                    case bt.leftShoot: //left shoot
                        this._link.ball.setPos(g.x - r, g.y+g._vertical/2-r);
                        this._link.ball.setDelta(-10, 0);
                        this._link.ball.setFlyingStatement(true);
                        return true;
                    break;
                    //pannels
                    case bt.upPannel: case bt.downPannel: case bt.rightPannel: case bt.leftPannel:
                         const _m = [{dx:0, dy:-g._vertical}, 
                             {dx:0, dy:g._vertical},
                             {dx:-g._horizon, dy:0},
                             {dx:g._horizon, dy:0}]

                         const _dx = _m[g.type-bt.upPannel].dx;
                         const _dy = _m[g.type-bt.upPannel].dy;
                         for(let i in this.blockList){
                            const b = this.blockList[i];
                            if(g.isCollision(_dx, _dy, b)){
                                this._link.ball.createBoundSound();
                                this._link.ball._.dy = -G;			
                                this._link.ball.move(0, gTop - by - r);					
                                return true;
                            }
                         }                                
                         g.moveWithAntimation(_dx, _dy, 80);
                         break;

                    case bt.jumpItem: case bt.dashItem:
                        this.blockList.splice(i, 1); 
                        this._link.ball.setItem(g.type);
                        return false;

                    default:
                }
                this._link.ball.createBoundSound();
                this._link.ball._.dy = -G;							
                this._link.ball.move(0, gTop - by - r);

                return true;
            }	                        
        }
        return false;

    }


    static drawText(_x, _y, _txt, _fontSize="16px", _fontWeight=1, _color="black", _fontFamily="san-serif", _align="start", _fill=false){
        const origAlign = ctx.textAlign;
        const origWidth = ctx.lineWidth;
        ctx.textAlign = _align;
        ctx.font = `${_fontSize} ${_fontFamily}`;
        
        ctx.lineWidth = _fontWeight;

        if(!_fill){
            ctx.strokeStyle = _color;
            ctx.strokeText(_txt, _x, _y);
        }else{
            ctx.fillStyle = _color;
            ctx.fillText(_txt, _x, _y);
        }

        ctx.lineWidth = origWidth;
        ctx.textAlign = origAlign;
    }
}