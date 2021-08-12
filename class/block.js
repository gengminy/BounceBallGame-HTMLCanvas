class Block{
    constructor(_x=0, _y=0, _horizon=0, _vertical=0, _type=1){
        this.x = _x;
        this.y = _y;
        this._horizon = _horizon;
        this._vertical = _vertical;

        this.type = _type;

        this.top = _y;
        this.bottom = _y + _vertical;
        this.right = _x + _horizon;
        this.left = _x;

        if(Block.type.upPannel <= _type && _type <= Block.type.rightPannel){
            this.move = (dx, dy)=>{
                this.x += dx; this.y += dy;
            }

            this.isCollision = (dx, dy, block)=>{
                if(block.inBlock(this.x+this._horizon/2+dx, this.y+this._vertical/2+dy))
                    return true;
                return false;
            }

            this.moveWithAntimation = (dx, dy, ms)=>{
                const frame = 15;
                for(let i=1; i<=frame; ++i){
                    setTimeout(()=>{
                        this.move(dx/frame, dy/frame);
                    }, ms/frame*i)
                }
            }
        }
    }


    inBlock(x, y){    //해당 좌표가 이 블록 내부에 있는지 검사
        if(this.x <= x && x <= this.x + this._horizon && this.y <= y && y <= this.y+ this._vertical)
            return true;
        return false;
    }

    setPos(x, y){
        this.x = x; this.y = y;
    }


    static type = {
         empty: 0,        //void
        default: 1,      //block
        jump: 2,
        broken: 3,

        //spike
        upSpike: 4,
        downSpike: 5,
        leftSpike: 6,
        rightSpike: 7,

        //shooter
        rightShoot: 8,
        leftShoot: 9,

        //moving pannel
        upPannel: 10,
        downPannel: 11,
        leftPannel: 12,
        rightPannel: 13,

        //item
        jumpItem: 90,
        dashItem: 91,

        ball: 99,

        text: 200,
    }

    static style = {
        default: { background: "#F3F3F3", border: "#AFAFAF" },
        jump: { background: "#70B7FF", border: "#45A1FF" },
        broken: { background: "white", border: "#222"},
        spike: { background: "#FFF", border: "#999"},
        rightShoot: { background: "#1E8EFF", border: "#0180FF", arrow: "#FFF" },
        leftShoot: { background: "#1E8EFF", border: "#0180FF", arrow: "#FFF"},

        verticalPannel: { background: "white", border: "#444", arrow: "#FB0F00" },
        horizontalPannel: { background: "white", border: "#444", arrow: "#046AFF" },


        jumpItem: { background: "#F78400", border: "#E47A00" },
        dashItem: { background: "#2A61FF", border: "#205AFF" },

        ball: {background: "#FFD400", border: "" },
        ballWithJumpItem: { background: "#F78400", border: "" },
        ballWithDashItem: { background: "#2A61FF", border: "" }
    }
}