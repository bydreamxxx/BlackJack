// create by wj 2019/09/12
function getLength(pt){//获取向量长度
    return Math.sqrt( pt.x * pt.x + pt.y * pt.y )
}

function pToAngleSelf(offSet){
    return Math.atan2(offSet.y, offSet.x);
}

function LenBezier(P0, P1, P2, t){
    var ax = P0.x - 2 * P1.x + P2.x
    var ay = P0.y - 2 * P1.y + P2.y
    var bx = 2 * P1.x - 2 * P0.x
    var by = 2 * P1.y - 2 * P0.y

    var A = 4 *(ax * ax + ay * ay)
    var B = 4 *(ax * bx + ay * by)
    var C = bx * bx + by * by
    var sqrtA = Math.sqrt(A)
    var sqrtC = Math.sqrt(C)

    var temp1 = Math.sqrt(C + t *(B + A * t))
    var temp2 =(2 * A * t * temp1 + B *(temp1 - sqrtC))
    var temp3 = Math.log(B + 2 * sqrtA * sqrtC)
    var temp4 = Math.log(B + 2 * A * t + 2 * sqrtA * temp1)
    var temp5 = 2 * sqrtA * temp2
    var temp6 = (B * B - 4 * A * C) *(temp3 - temp4)

    return(temp5 + temp6) /(8 * Math.pow(A, 1.5))
}

//循环下标
var GetRingIndex = function(index, ringLen){
    return(index) % ringLen
}

var ToPoint = function(ptArr){
    var ptList = ptArr.split(',');
    return cc.v2(parseFloat(ptList[0]), parseFloat(ptList[1]));
}

///////////////////////////////直线路径Begin///////////////////////////////////
var FishMoveLine = cc.Class({
    ctor: function(){
        this.m_startPos = null; //起点
        this.m_dir = 0; //方向
        this.m_moveSpeed = 0; //移动速度
        this.m_moveTime = 0; //移动时间
        this.m_totalTime = 0; //总时长
    },

    statics: {//静态函数方法
        create: function(startPos, endPos, moveSpeed){ //创建一个直线线路
            var moveAct = new FishMoveLine;

            moveAct.m_startPos = startPos; //起始点
            var offSet = endPos.sub(startPos); //位移向量
            moveAct.m_dir = pToAngleSelf(offSet); //方向弧度
            moveAct.m_moveSpeed = offSet.normalize().mul(moveSpeed); //速度向量
            moveAct.m_totalTime = getLength(offSet) / moveSpeed; //总位移时长

            return moveAct;
        },

        createWithTime: function(startPos, totalTime, moveSpeedVec){
            var moveAct= new FishMoveLine;

            moveAct.m_startPos = startPos;
            moveAct.m_dir= pToAngleSelf(moveSpeedVec);
            moveAct.m_moveSpeed = moveSpeedVec;
            moveAct.m_totalTime=totalTime;
        
            return moveAct
        }
    },

    updatePos: function(dt){
        this.m_moveTime += dt;
        var leavTime = this.m_moveTime - this.m_totalTime; //鱼剩余时间差
        var curPos = null;
        if(leavTime > 0)
            curPos = this.m_startPos.add(this.m_moveSpeed.mul(this.m_totalTime)); //当前位置
        else
            curPos = this.m_startPos.add(this.m_moveSpeed.mul(this.m_moveTime)); //当前位置
        var info = {
            curPos : curPos,
            dir: this.m_dir,
            leavTime: leavTime,
        };

        return info;
    },
    onEnter: function(curPos, curDir){//初始进入
    },

});
///////////////////////////////直线路径End///////////////////////////////////

//////////////////////////////鱼阵当前鱼点begin///////////////////////////////
var FishMoveFromCur = cc.Class({
    ctor:function(){
        this.m_startPos = null; //起点
        this.m_dir = null; //方向
        this.m_moveSpeed = 0; //移动速度
        this.m_moveTime = 0; //移动时间
        this.m_totalTime = 0; //总时长
        this.m_originPos = null; //原始位置
    },

    statics:{
        create: function(totalTime, moveSpeed){//创建一个总时长， 移动速度的当前点
            var moveAct = new FishMoveFromCur;
            moveAct.m_moveSpeed = moveSpeed;
            moveAct.m_totalTime=totalTime;
        
            return moveAct
        },

        createWithDir: function(totalTime, moveSpeedVec){//带方向点移动点
            var moveAct = new FishMoveFromCur;
            moveAct.m_dir = pToAngleSelf(moveSpeedVec); //方向角
            moveAct.m_moveSpeed = moveSpeedVec; //速度向量
            moveAct.m_totalTime = totalTime;
            return moveAct;
        },

        createWithOrigin: function(totalTime, moveSpeed, originPos){
            var moveAct = new FishMoveFromCur;
            moveAct.m_originPos = originPos;
            moveAct.m_moveSpeed = moveSpeed; //速度向量
            moveAct.m_totalTime = totalTime;
            return moveAct;
        },
    },

    onEnter: function(curPos, curDir){//初始进入
        this.m_startPos = curPos;
        if(this.m_dir == null){
            if(this.m_originPos == null)
                this.m_dir = curDir;
            else
                this.m_dir = pToAngleSelf(curPos.sub(this.m_originPos));
            this.m_moveSpeed = cc.v2(Math.cos(this.m_dir), Math.sin(this.m_dir)).mul(this.m_moveSpeed);
        }


    },

    updatePos: function(dt){
        this.m_moveTime += dt;
        var leavTime = this.m_moveTime - this.m_totalTime; //鱼剩余时间差
        var curPos = null;
        if(leavTime > 0)
            curPos = this.m_startPos.add(this.m_moveSpeed.mul(this.m_totalTime)); //当前位置
        else
            curPos = this.m_startPos.add(this.m_moveSpeed.mul(this.m_moveTime)); //当前位置
        var info = {
            curPos : curPos,
            dir: this.m_dir,
            leavTime: leavTime,
        };

        return info;
    },
});

//////////////////////////////鱼阵当前鱼点End///////////////////////////////

//////////////////////////////贝塞尔曲线begin///////////////////////////////
var FishMoveBezier = cc.Class({
    ctor:function(){
        this.m_pos1 = null; //贝塞尔线点1
        this.m_pos2 = null;
        this.m_pos3 = null;
        this.m_moveTime = 0; //移动时间
        this.m_totalTime = 0; //移动总长
    },

    statics:{
        create: function(pos1, pos2, pos3, moveSpeed){//创建贝塞尔曲线
            var moveAct = new FishMoveBezier;

            moveAct.m_pos1 = pos1;
            moveAct.m_pos2 = pos2;
            moveAct.m_pos3 = pos3;

            var lenLine = LenBezier(moveAct.m_pos1, moveAct.m_pos2, moveAct.m_pos3, 1);
            moveAct.m_totalTime = lenLine / moveSpeed;
            moveAct.P21 = pos3.sub(pos2);
            moveAct.P10 = pos2.sub(pos1);

            return moveAct;
        },
    },

    pointOnBezier: function(P0, P1, P2, t){
        var P3 = P0.add(this.P10.mul(t));
        var P4 = P1.add(this.P21.mul(t));
        var face = P4.sub(P3);
        var result = P3.add(face.mul(t));
        var info = {
            face : face,
            result : result,
        }
        return info;
    },

    updatePos: function(dt){
        this.m_moveTime = this.m_moveTime + dt; //移动时长
        var leavTime = this.m_moveTime - this.m_totalTime; //剩余时长
        var curPos = null; //当前位置
        var curDir = null;
        if(leavTime >= 0){ //鱼已经需要消失
            curPos = this.m_pos3;
            curDir = this.m_pos3.sub(this.m_pos2); //当前方向向量
        }else{
            var info = this.pointOnBezier(this.m_pos1, this.m_pos2, this.m_pos3, this.m_moveTime / this.m_totalTime);
            curPos = info.result;
            curDir = info.face;
        }

        var info = {
            curPos : curPos,
            dir : pToAngleSelf(curDir),
            leavTime : leavTime,
        }
        return info;
    },
    onEnter: function(curPos, curDir){//初始进入
    }
});
//////////////////////////////贝塞尔曲线end///////////////////////////////

//////////////////////////////旋转begin///////////////////////////////
var FishMoveRot = cc.Class({
    ctor: function(){
        this.m_moveTime = 0;
        this.m_moveSpeed = 0;
        this.m_originPos = null;
        this.m_radiusLen = 0;
        this.m_startRadian = 0;
        this.m_totalTime = 0;
    },

    statics: {
        create: function(originPos, startPos, moveSpeed, totalTime){
            var moveAct = new FishMoveRot;
            moveAct.m_originPos = originPos;
            moveAct.m_radiusLen = getLength(startPos);
            moveAct.m_moveSpeed = moveSpeed;
            moveAct.m_startRadian = pToAngleSelf(startPos);
            moveAct.m_totalTime = totalTime;

            return moveAct;
        },
    },

    updatePos: function(dt){
        this.m_moveTime = this.m_moveTime + dt; //移动时长
        var leavTime = this.m_moveTime - this.m_totalTime; //剩余时长
        var curRadian = null;
        if(leavTime >= 0)
            curRadian = this.m_startRadian + this.m_moveSpeed * this.m_totalTime;
        else
            curRadian = this.m_startRadian + this.m_moveSpeed * this.m_moveTime;
        var curPos = this.m_originPos.add(cc.v2(Math.cos(curRadian), Math.sin(curRadian)).mul(this.m_radiusLen));
        var curDir = null;
        if(this.m_moveTime >0 )
            curDir = curRadian + Math.PI / 2;
        else
            curDir = curRadian - Math.PI / 2;
        
        var info = {
            curPos : curPos,
            dir : curDir,
            leavTime : leavTime,
        }

        return info;
    },
    onEnter: function(curPos, curDir){//初始进入
    }


});
//////////////////////////////旋转end///////////////////////////////

var FishMoveStop = cc.Class({
    ctor: function(){
        this.m_curPos = null;
        this.m_dir = 0;
        this.m_moveTime = 0;
        this.m_totalTime = 0;
    },

    statics:{
        create: function(curPos, dir, totalTime){
            var moveAct = new FishMoveStop;

            moveAct.m_curPos = curPos;
            moveAct.m_dir = dir;
            moveAct.m_totalTime = totalTime;

            return moveAct;
        },
    },

    updatePos: function(dt){
        this.m_moveTime += dt;

        var leavTime = this.m_moveTime - this.m_totalTime;

        var info = {
            curPos : this.m_curPos,
            dir : this.m_dir,
            leavTime : leavTime,
        }   

        return info;
    },
    onEnter: function(curPos, curDir){//初始进入
    }
});

//////////////////////////////鱼线begin///////////////////////////////
var FishMoveTrack = cc.Class({
    ctor: function(){
        this.m_originPos = null;
        this.m_posList = null;
        this.m_nCurIndex = 0;
        this.m_moveTime = 0;
        this.m_moveSpeed = 0;
        this.m_totalTime = 0;
        this.m_UpdatePos = null;
    },

    statics: {
        create: function(originPos, posList, curIndex, moveSpeed, totalTime){
            var moveAct = new FishMoveTrack;

            moveAct.m_originPos = originPos;
            moveAct.m_posList = posList;
            moveAct.m_nCurIndex = curIndex;
            moveAct.m_moveSpeed = moveSpeed;
            moveAct.m_totalTime = totalTime;

            moveAct.buildPathInfo();

            return moveAct;
        },
    },

    buildPathInfo: function(){//创建路径
        var indexStart = 0;
        var indexEnd = 0;

        //if(this.m_totalTime == null){
            var sharpLen = this.m_posList.length;

            indexStart = GetRingIndex(this.m_nCurIndex, sharpLen);
            indexEnd = GetRingIndex(this.m_nCurIndex + 1, sharpLen);
        // }else{
        //     indexStart = this.m_nCurIndex;
        //     indexEnd = this.m_nCurIndex + 1;
        //     cc.log('endIndex==============' + indexEnd);

        //     if (indexEnd >= this.m_posList.length) {
        //         indexEnd = 0;
        //     }
        // }

        var startPos = this.m_originPos.add(ToPoint(this.m_posList[indexStart]));
        var endPos = this.m_originPos.add(ToPoint(this.m_posList[indexEnd]));

        this.m_updatePos = FishMoveLine.create(startPos, endPos, this.m_moveSpeed);
    },

    updatePos: function(dt){
        if(this.m_totalTime){
            this.m_totalTime -= dt;
            var info = this.m_updatePos.updatePos(this.m_moveTime + dt);
            var leavTime = info.leavTime;

            if(leavTime > 0){
                this.m_moveTime = leavTime;
                this.m_nCurIndex = this.m_nCurIndex + 1;
                this.buildPathInfo();
            }else
                this.m_moveTime = 0;

            var data ={
                curPos : info.curPos,
                dir : info.dir,
                leavTime: -this.m_totalTime, 
            }
            return data;
        }else{
            var info = this.m_updatePos.updatePos(this.m_moveTime + dt);
            var leavTime = info.leavTime;

            if(leavTime > 0 && this.m_nCurIndex < this.m_posList.length){
                this.m_moveTime = leavTime;
                this.m_nCurIndex = this.m_nCurIndex;
                this.buildPathInfo();
                leavTime = 0;
            }else
                this.m_moveTime = 0;
            
            var data ={
                curPos : info.curPos,
                dir : info.dir,
                leavTime: leavTime, 
            }
            return data;
        }
    },
    onEnter: function(curPos, curDir){//初始进入
    }
});
//////////////////////////////鱼线end///////////////////////////////
module.exports = {
    CFishMoveLine : FishMoveLine,
    CFishMoveBezier : FishMoveBezier,
    CFishMoveFromCur: FishMoveFromCur,
    CFishMoveRot : FishMoveRot,
    CFishMoveStop : FishMoveStop,
    CFishMoveTrack : FishMoveTrack,
};


