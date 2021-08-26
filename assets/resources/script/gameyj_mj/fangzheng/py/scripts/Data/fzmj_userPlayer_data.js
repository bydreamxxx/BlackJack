var pai3d_value = require("jlmj_pai3d_value");
var PlayerData = require("fzmj_player_data").PlayerData;

var fzmjUserPlayerData = cc.Class({

    extends: PlayerData,

    s_userPlayer: null,

    properties:{
        _isUserPlayer: {default:true, override:true},
    },

    statics: {

        Instance: function () {
            if(!this.s_userPlayer){
                this.s_userPlayer = new fzmjUserPlayerData();
            }
            return this.s_userPlayer;
        },

        Destroy: function () {
            if(this.s_userPlayer){
                this.s_userPlayer = null;
            }
        },
    },

    //设置亮掌
    setLiangZhang(msg){
        if(!msg.canliangzhang){
            return ;
        }
        this.liangZhangList = [];
        msg.liangzhangcardsList.forEach(function (liangzhangInfo) {
            let list = [liangzhangInfo.id];
            let checkList = [liangzhangInfo.id - 3, liangzhangInfo.id - 2 , liangzhangInfo.id - 1, liangzhangInfo.id + 1, liangzhangInfo.id + 2, liangzhangInfo.id + 3]
            // let pengDes = pai3d_value.desc[liangzhangInfo.id].split('[')[0];
            // for(let i = 0; i < this.shoupai.length; i++) {
            //     // if(paiID.indexOf(shoupai_id) == -1 && outPaiID.indexOf(shoupai_id) == -1) {
            //     if(paiID.indexOf(this.shoupai[i]) == -1) {
            //         let _pengDes = pai3d_value.desc[this.shoupai[i]].split('[')[0];
            //
            //         if(_pengDes == pengDes && this.shoupai[i] != liangzhangInfo.id){
            //             list.push(this.shoupai[i]);
            //             break;
            //         }
            //     }
            // }
            for(let i = 0; i < checkList.length; i++){
                if(this.shoupai.indexOf(checkList[i]) != -1){
                    let pengDes = pai3d_value.desc[liangzhangInfo.id].split('[')[0];
                    let _pengDes = pai3d_value.desc[checkList[i]].split('[')[0];
                    if(_pengDes == pengDes){
                        list.push(checkList[i]);
                        break;
                    }
                }
            }

            this.liangZhangList.push(list);
        },this);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"亮掌");
    },

    getPair(){
        return this.liangZhangList || [];
    },

    setLiangXiState(state){
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.LIANGXISTATE,[this, state]);
    },
});

module.exports = fzmjUserPlayerData;
