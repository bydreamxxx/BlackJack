var rank_info = require('rank_info');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HallCommonData = require('hall_common_data').HallCommonData;
cc.Class({
    extends: cc.Component,

    properties: {
        rankSpList: { default: [], type: cc.SpriteFrame, tooltip: '排行图片' },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
     setData(msg){
        //  {
        //      rankListList: [],
        //          rankId: 19,
        //              historyInfo:
        //      {
        //          champinUserId: 0,
        //              championName: '',
        //                  championHead: '',
        //                      championScore: 0,
        //                          curRank: -1,
        //                              curScore: 0,
        //                                  historyRank: -1
        //      }
        //  }
         this.node.setLocalZOrder(500);
         var data = rank_info.getItem(function (item) {
             return item.key == msg.rankId;
         });
         msg.rankListList.sort(function (a, b) { return a.rank - b.rank });
         switch (data.refresh_type) {
            case 1: // 日榜
                 var panel = cc.find('bg/panels/panel1', this.node);
                 cc.find('list', panel).getComponent('com_glistView').setDataProvider(msg.rankListList, 0, function (itemNode, index) {
                     if (index < 0 || index >= msg.rankListList.length)
                         return;
                     var element = msg.rankListList[index];
                     if (element.rank < 4) {
                         itemNode.getChildByName('rank_img').getComponent(cc.Sprite).spriteFrame = this.rankSpList[element.rank - 1];
                         itemNode.getChildByName('rank_img').active = true;
                         itemNode.getChildByName('rank_lbl').active = false;
                     }
                     else {
                         itemNode.getChildByName('rank_lbl').getComponent(cc.Label).string = element.rank.toString();
                         itemNode.getChildByName('rank_img').active = false;
                         itemNode.getChildByName('rank_lbl').active = true;
                     }
                     itemNode.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(element.name, 0, 4);
                     itemNode.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(element.score);
                  
                 }.bind(this));
                 var mine = cc.find('mine', panel);
                 mine.getChildByName('rank').getComponent(cc.Label).string = msg.historyInfo.curRank == -1 ? '未上榜' : msg.historyInfo.curRank.toString();  
                 mine.getChildByName('nick').getComponent(cc.Label).string = cc.dd.Utils.substr(HallCommonData.getInstance().nick, 0, 4);
                 mine.getChildByName('coin').getComponent(cc.Label).string = this.getCoinStr(msg.historyInfo.curScore);


         }
     },
    start () {

    },
    onClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
     //点击活动排行榜切换
    onClickActiveRankToggle(event, custom) {
        hall_audio_mgr.com_btn_click();
        var panels = cc.find("bg/panels", this.node);
        panels.children.forEach(node => {
            node.active = (node.name == 'panel' + custom);
        });
    },
    getCoinStr(num) {
        if (num >= 100000000) {
            return (Math.floor(num / 1000000) / 100).toString() + '亿';
        }
        else if (num >= 10000) {
            return (Math.floor(num / 100) / 100).toString() + '万';
        }
        else {
            return num.toString();
        }
    },
    // update (dt) {},
});
