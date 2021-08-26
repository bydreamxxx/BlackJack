const DISTANCE = {
    LU:0,
    UR:1,
    LR:2,
    UD:3,
    LD:4,
    RD:5,
}

var RoomMgr = require("jlmj_room_mgr").RoomMgr;
var jlmj_audio_mgr = require('nmmj_audio_mgr').Instance();


cc.Class({
    extends: cc.Component,

    properties: {
        players: [cc.Node],
        lines: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setGpsData: function (playerList) {
        this.players.forEach((player)=>{
            player.active = false;
        })

        this.lines.forEach((line)=>{
            line.active = false;
        })

        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i]) {
                let viewIdx = playerList[i].viewIdx;
                if(this.players[viewIdx]){
                    this.players[viewIdx].active = true;
                    let spr_head = cc.find('headNode', this.players[viewIdx]).getComponent('klb_hall_Player_Head');
                    spr_head.initHead(playerList[i].openId, playerList[i].headUrl);
                }
            }
        }

        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i]) {
                for (let j = i; j < playerList.length; j++) {
                    if (playerList[j] && i != j) {
                        if(this.players[playerList[i].viewIdx].active && this.players[playerList[j].viewIdx].active){
                            let line = this.getLineByIdx(playerList[i].viewIdx+''+playerList[j].viewIdx);
                            if(line){
                                line.active = true;
                                let color,str;
                                if(!RoomMgr.Instance()._Rule || !RoomMgr.Instance()._Rule.gps){
                                    str = '???';
                                    color = cc.color(45, 45, 45);
                                }else if(this.checkLocation(playerList[i].location) && this.checkLocation(playerList[j].location)) {
                                    let distance = parseInt(this.getDistance(playerList[i].location, playerList[j].location));
                                    if (distance < 100) {
                                        color = cc.color(192, 0, 0);
                                    }
                                    else {
                                        color = cc.color(45, 45, 45);
                                    }

                                    if(distance >= 1000){
                                        distance = distance / 1000;
                                        str = distance.toFixed(2)+'公里';
                                    }else{
                                        str = distance+'米';
                                    }
                                }else{
                                    str = '???';
                                    color = cc.color(45, 45, 45);
                                }
                                let label = cc.find('distanceLabel',line);
                                label.color = color;
                                label.getComponent(cc.Label).string = str;
                            }


                        }


                    }
                }
            }
        }
    },

    getDistance: function (locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps定位距离:++++++' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps定位距离:++++++' + distance);
            return distance;
        }
    },

    getLineByIdx(idx){
      switch(idx){
          case '01':
          case '10':
              return this.lines[DISTANCE.RD];//右下
          case '02':
          case '20':
              return this.lines[DISTANCE.UD];//竖
          case '03':
          case '30':
              return this.lines[DISTANCE.LD];//左下
          case '12':
          case '21':
              return this.lines[DISTANCE.UR];//右上
          case '13':
          case '31':
              return this.lines[DISTANCE.LR];//横
          case '23':
          case '32':
              return this.lines[DISTANCE.LU];//左上
          default:
              return null;
      }
    },

    checkLocation(location){
        return location && cc.dd._.isNumber(location.latitude) && cc.dd._.isNumber(location.longitude) && (location.latitude != 0 || location.longitude != 0);
    },

    onClickClose(){
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
