cc.Class({
    extends: cc.Component,

    properties: {
        runNum: [cc.Node],
        numList: [cc.Label],
        targetSpeed:32,
        needSlowDown: false,
    },

    onLoad :function() {
        this.itemHeight = this.runNum[0].height;
        this.reset();
    },

    reset(){
        this._startUpdate = false;
        this.runSpeed = -2
        this.fixNodePos(this.runNum[0],this.runNum[1]);

        this.runTime = 0;
        this.hasResult = false;
        this.endNum = null;

        this.passOnce = 0;//设定好停止数字后转一圈再停止
        this.passOnceEnd = 0;

        this.startSlowDow = false;
    },

    fixNodePos:function(node1,node2){
        node1.x = 0;
        node1.y = 0;
        //利用前一张图片的边框大小设置下一张图片的位置
        var bg1BoundingBox = node1.getBoundingBox();
        node2.setPosition(bg1BoundingBox.xMin,bg1BoundingBox.yMax)
    },

    update:function(dt){
        dt = 0.03;
        if(this._startUpdate){
            this.nodeMove(this.runNum,this.runSpeed);
            this.checkNodeReset(this.runNum, this.numList);
            this.runTime += dt;
            if(this.runTime >= 2 && this.hasResult){//转2秒后并且有结果
                if(this.needSlowDown){
                    if(this.passOnce >= this.passOnceEnd && this.numList[0].string == this.endNum && !this.startSlowDow){
                        this.startSlowDow = true;
                        this.endLength = this.itemHeight * 20 + this.runNum[0].y;
                    }
                    if(this.startSlowDow){
                        if(this.endLength >= this.itemHeight * 5 && this.endLength < this.itemHeight * 10) {
                            if(this.runSpeed > 10){
                                this.runSpeed -= 9;
                            }else{
                                this.runSpeed = 10;
                            }
                        }else if(this.endLength > this.itemHeight * 3 && this.endLength < this.itemHeight * 5){
                            if(this.runSpeed > 5){
                                this.runSpeed -= 4;
                            }else{
                                this.runSpeed = 5;
                            }
                        }else if(this.endLength <= this.itemHeight * 3){
                            if(this.runSpeed > dt * 4) {
                                this.runSpeed -= dt;
                            }else if(this.runSpeed > dt && this.runSpeed <= dt * 4){
                                this.runSpeed -= dt / 2;
                            }else{
                                this.runSpeed = dt/2;
                            }
                        }
                        this.endLength -= this.runSpeed;
                        if(this.endLength <= 0){
                            if(this.numList[0].string != this.endNum && this.numList[1].string == this.endNum){
                                let preFirstNode = this.runNum.shift();
                                this.runNum.push(preFirstNode);

                                let curFirstNode = this.runNum[0];
                                preFirstNode.y = curFirstNode.getBoundingBox().yMax;


                                let preLabel = this.numList.shift();

                                let preNum = parseInt(preLabel.string);
                                if(preNum == 8){
                                    preNum = 0;
                                }else if(preNum == 9){
                                    preNum = 1;
                                }else{
                                    preNum += 2;
                                }
                                preLabel.string = preNum;
                                this.numList.push(preLabel);
                            }
                            this.reset();
                            if(this.runEndFunc){
                                this.runEndFunc();
                            }
                        }
                    }
                }else{
                    if(this.passOnce >= this.passOnceEnd){//this.passOnce跑完一轮的情况下，开始展示实际的数字
                        if(this.numList[0].string == this.endNum){
                            this.reset();

                            if(this.runEndFunc){
                                this.runEndFunc();
                            }
                        }
                    }
                }
            }else{
                if(this.runSpeed < this.targetSpeed){
                    this.runSpeed += 20;
                }else{
                    this.runSpeed = this.targetSpeed;
                }
            }
        }
    },

    nodeMove:function(nodeList,speed){
        for(let index = 0; index < nodeList.length; index++){
            let element = nodeList[index];
            element.y -= speed;
        }
    },
    //检查是否要重置位置
    checkNodeReset:function(nodeList, numList){
        var first_yMax = nodeList[0].getBoundingBox().yMax;
        if(first_yMax <= 0){
            let preFirstNode = nodeList.shift();
            nodeList.push(preFirstNode);

            let curFirstNode = nodeList[0];
            preFirstNode.y = curFirstNode.getBoundingBox().yMax;


            let preLabel = numList.shift();

            if(this.startNum == preLabel.string){//如果this.startNum跑完一轮，this.passOnce++
                this.passOnce++;
            }

            let preNum = parseInt(preLabel.string);
            if(preNum == 8){
                preNum = 0;
            }else if(preNum == 9){
                preNum = 1;
            }else{
                preNum += 2;
            }
            preLabel.string = preNum;
            numList.push(preLabel);
        }
    },

    startRun(){
        this._startUpdate = true;
    },

    setRunEndCall(func){
        this.runEndFunc = func;
    },

    setRunEndNum(num){
        this.hasResult = true;
        this.endNum = num ? num : '0';
        this.startNum = this.numList[0].string;//设置开始停止的数字
        this.passOnce = 0;
        this.passOnceEnd = this.checkRunNum(parseInt(this.startNum), parseInt(this.endNum));//设置与this.startNum数字相同的数字经过了几次
    },

    /**
     * 如果起始数字+5比显示数字小，就加一圈多转一会
     * @param startNum
     * @param endNum
     * @returns {number}
     */
    checkRunNum(startNum, endNum){
        let result = endNum - startNum;
        if(result < 0){
            result += 10
        }
        if(result < 5 ){
            return 2;
        }else{
            return 1;
        }

    }

});