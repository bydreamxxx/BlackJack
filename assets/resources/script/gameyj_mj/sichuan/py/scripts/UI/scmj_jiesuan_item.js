let HuTypeDesc = require('jlmj_define').SCHuTypeDesc;
let pai3d_value = require("jlmj_pai3d_value");

cc.Class({
    extends: cc.Component,

    properties: {
        fangwei: cc.Label,
        pai: cc.Label,
        fanshu:cc.Label,
        score:cc.Label,
    },

    setplayer(userId){
      this.userID = userId;
    },

    setHuData(data, userInfo, winOrLose){
        let gen = data.gounums;
        // let winUser = data.huuserid;
        // let playerInfo = null;
        // for(let i = 0; i < userList.length; i++){
        //     if(userList[i].userid == data.huuserid){
        //         playerInfo = userList[i];
        //         break;
        //     }
        // }

        // let genList = {};
        // let paiID = [];//存一下牌的ID，避免重复统计
        //
        // let mopaiList = [];
        //
        // for(let i = 0; i < playerInfo.pailistList.length; i++){
        //     let cardInfo = playerInfo.pailistList[i];
        //     let shoupai = cardInfo.cardinfo.cardindexList;
        //
        //     for(let j = 0; j < shoupai.length; j++){
        //         if(paiID.indexOf(shoupai[j]) == -1){
        //
        //             if(cardInfo.cardtype == 5){
        //                 mopaiList.push(cardInfo);
        //             }else{
        //                 let pengDes = pai3d_value.desc[shoupai[j]].split('[')[0];
        //
        //                 paiID.push(shoupai[j]);
        //
        //                 if(genList.hasOwnProperty(pengDes)){
        //                     genList[pengDes] ++;
        //                 }else{
        //                     genList[pengDes] = 1;
        //                 }
        //             }
        //         }
        //     }
        // }
        //
        // if(idx < mopaiList.length){
        //     let cardInfo = mopaiList[idx];
        //     let shoupai = cardInfo.cardinfo.cardindexList;
        //     for(let j = 0; j < shoupai.length; j++){
        //         if(paiID.indexOf(shoupai[j]) == -1){
        //             let pengDes = pai3d_value.desc[shoupai[j]].split('[')[0];
        //
        //             paiID.push(shoupai[j]);
        //
        //             if(genList.hasOwnProperty(pengDes)){
        //                 genList[pengDes] ++;
        //             }else{
        //                 genList[pengDes] = 1;
        //             }
        //         }
        //     }
        // }


        // for(let k in genList){
        //     if(genList.hasOwnProperty(k)){
        //         if(genList[k] >= 4){
        //             gen++;
        //         }
        //     }
        // }

        let loser = "一";
        if(data.loseuseridList.length == 2){
            loser = "两";
        }else if(data.loseuseridList.length == 3){
            loser = "三";
        }else if(data.loseuseridList.length == 1){
            loser = "一";
        }else{
            loser = "零";
        }

        this.fangwei.string = userInfo[data.huuserid].fangwei;
        this.pai.string = "胡"+loser+"家("+this.getHu(data.hutypeList, gen) + ")";
        this.fanshu.string = data.fan+"番";

        let hufen = data.hufen;
        if(!winOrLose){
            hufen = hufen / data.loseuseridList.length;
        }

        this.score.string = (winOrLose ? "+" : "-") + Math.abs(hufen).toString();
    },

    setGangData(data, userInfo, winOrLose){
        let gangInfo = data.winnerdata;
        if(data.winnerdata.userid == this.userID){
            gangInfo = data.winnerdata;
        }else{
            for(let i = 0; i < data.loserdataList.length; i ++){
                if(data.loserdataList[i].userid == this.userID){
                    gangInfo = data.loserdataList[i];
                    break;
                }
            }
        }

        this.fangwei.string = userInfo[data.winnerdata.userid].fangwei;
        this.pai.string = (winOrLose ? "" : "被") + this.getGangType(data.gangtype);

        if(gangInfo){
            this.fanshu.string = "";
            this.score.string = (winOrLose ? "+" : "-") + Math.abs(gangInfo.gangfen).toString();
        }
    },

    setGangZhuanYiData(data, userInfo, winOrLose){
        let gangInfo = data.winnerdata;

        this.fangwei.string = userInfo[this.userID].fangwei;
        this.pai.string = (winOrLose ? "" : "被") + "转杠分";

        if(gangInfo){
            this.fanshu.string = "";
            this.score.string = (winOrLose ? "+" : "-") + Math.abs(gangInfo.gangfen).toString();
        }
    },

    setTuiGangData(data, userInfo, winOrLose){
        let gangInfo = data.winnerdata;
        if(data.winnerdata.userid == this.userID){
            gangInfo = data.winnerdata;
        }else{
            for(let i = 0; i < data.loserdataList.length; i ++){
                if(data.loserdataList[i].userid == this.userID){
                    gangInfo = data.loserdataList[i];
                    break;
                }
            }
        }

        this.fangwei.string = userInfo[data.winnerdata.userid].fangwei;
        this.pai.string = '退税';

        if(gangInfo){
            this.fanshu.string = "";
            this.score.string = (winOrLose ? "-" : "+") + Math.abs(gangInfo.gangfen).toString();
        }
    },

    setHuaZhu(data, userInfo, winOrLose, huazhuWin){
        this.fangwei.string = userInfo[this.userID].fangwei;
        this.pai.string = "查花猪";
        this.fanshu.string = "";

        let hufen = 0;
        if(winOrLose){
            for(let i = 0; i < data.huazhufenList.length; i++){
                hufen += (data.huazhufenList[i]/huazhuWin);
            }
        }else{
            let idx = data.huazhuuseridList.indexOf(this.userID);
            hufen = data.huazhufenList[idx]/huazhuWin;
        }

        this.score.string = (winOrLose ? "+" : "-") + Math.abs(hufen).toString();
    },

    setWuJiao(data, userInfo, winOrLose){
        this.fangwei.string = userInfo[this.userID].fangwei;
        this.pai.string = "查叫";
        this.fanshu.string = "";

        let hufen = 0;
        if(winOrLose){
            for(let i = 0; i < data.chajiaofenList.length; i++){
                hufen += data.chajiaofenList[i]
            }
        }else{
            let idx = data.chajiaouseridList.indexOf(this.userID);
            hufen = data.chajiaofenList[idx];
        }

        this.score.string = (winOrLose ? "+" : "-") + Math.abs(hufen).toString();
    },

    getHu(hutypeList, gen){
        let _hutypeList = hutypeList.slice();

        let str = "";
        let isEighteen = false;//十八罗汉
        let qEighteen = false;//清十八罗汉
        let qingqidui = false;//清七对
        let qinglongqidui = false;//清龙七对
        let qingdui = false;//清对

        if(_hutypeList.indexOf(7) != -1 && (_hutypeList.indexOf(15) != -1 || _hutypeList.indexOf(22) != -1) && gen >= 4){
            isEighteen = true;
            let duiduihuIdx = _hutypeList.indexOf(7);
            _hutypeList.splice(duiduihuIdx, 1);
            if(_hutypeList.indexOf(15) != -1){
                let jingoudiaoIdx = _hutypeList.indexOf(15);
                _hutypeList.splice(jingoudiaoIdx, 1);
            }
            if(_hutypeList.indexOf(22) != -1){
                let jingoudiaoIdx = _hutypeList.indexOf(22);
                _hutypeList.splice(jingoudiaoIdx, 1);
            }
            if(_hutypeList.indexOf(14) != -1){
                let qingyiseIdx = _hutypeList.indexOf(14);
                _hutypeList.splice(qingyiseIdx, 1);
                qEighteen = true;
            }
        }else if(_hutypeList.indexOf(10) != -1 && _hutypeList.indexOf(14) != -1){
            qingqidui = true;
            let qidui = _hutypeList.indexOf(10);
            _hutypeList.splice(qidui, 1);
            let qingyise = _hutypeList.indexOf(14);
            _hutypeList.splice(qingyise, 1);
        }else if((_hutypeList.indexOf(11) != -1 || _hutypeList.indexOf(12) != -1 || _hutypeList.indexOf(13) != -1) && _hutypeList.indexOf(14) != -1){
            qinglongqidui = true;
            if(_hutypeList.indexOf(11) != -1){
                let qidui = _hutypeList.indexOf(11);
                _hutypeList.splice(qidui, 1);
            }
            if(_hutypeList.indexOf(12) != -1){
                let qidui = _hutypeList.indexOf(12);
                _hutypeList.splice(qidui, 1);
            }
            if(_hutypeList.indexOf(13) != -1){
                let qidui = _hutypeList.indexOf(13);
                _hutypeList.splice(qidui, 1);
            }
            let qingyise = _hutypeList.indexOf(14);
            _hutypeList.splice(qingyise, 1);
        }else if(_hutypeList.indexOf(7) != -1 && _hutypeList.indexOf(14) != -1){
            qingdui = true;
            let duiduihu = _hutypeList.indexOf(7);
            _hutypeList.splice(duiduihu, 1);
            let qingyise = _hutypeList.indexOf(14);
            _hutypeList.splice(qingyise, 1);
        }

        if(qEighteen){
            str += "清十八罗汉"
        }else if(isEighteen){
            str += "十八罗汉"
        }else if(qinglongqidui){
            str += "清龙七对";
        }else if(qingqidui){
            str += "清七对";
        }else if(qingdui){
            str += "清对";
        }

        if(_hutypeList.length > 0){
            str += " ";
        }

        if(_hutypeList.indexOf(7) != -1 && _hutypeList.indexOf(25) != -1){//对对胡和将对不同时出现
            let duiduihu = _hutypeList.indexOf(7);
            _hutypeList.splice(duiduihu, 1);
        }

        for(let i = 0; i < _hutypeList.length; i++){
            str += HuTypeDesc[_hutypeList[i]];
            if(i != _hutypeList.length - 1){
                str += " ";
            }
        }

        let end = gen > 0 && !qEighteen && !isEighteen ? " " + gen + "根" : "";
        return str + end;
    },


    getGangType(gangType){
      switch (gangType) {
          case 1:
          case 2:
              return "刮风";
          case 3:
              return "下雨";
      }
    },
});
