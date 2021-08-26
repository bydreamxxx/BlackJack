var pai3d_value = require("jlmj_pai3d_value");
var Text = cc.dd.Text;
var RoomMgr = require("jlmj_room_mgr").RoomMgr;
var  jlmj_str  = require('jlmj_strConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        pai: { default: null, type: cc.Sprite, tooltip: '麻将数值', },
        fan: { default: null, type: cc.Label, tooltip: '翻数', },
        cnt: { default: null, type: cc.Label, tooltip: '倍数', },
        hunPai: { default: null, type: cc.Node, tooltip: '混牌', },
    },

    // use this for initialization
    onLoad: function () {
        //this.huType=[Text.TEXT_HUPAI_0,Text.TEXT_HUPAI_1,Text.TEXT_HUPAI_2,Text.TEXT_HUPAI_3,Text.TEXT_HUPAI_4];
    },

    /**
     * 设置叫牌信息
     * @param jiaoPai
     */
    setJiaoPai: function (jiaoPai) {
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai || !jiaoPai || typeof(jiaoPai.fan) == "undefined" || isNaN(jiaoPai.fan)){
            return;
        }
        cc.log("叫牌 牌信息：" + jiaoPai);
        var huType =[Text.TEXT_HUPAI_0,Text.TEXT_HUPAI_1,Text.TEXT_HUPAI_2,Text.TEXT_HUPAI_3,Text.TEXT_HUPAI_4];
        if(RoomMgr.Instance().isHeLongMJ()){
            huType =['屁胡','屁胡','屁胡',Text.TEXT_HUPAI_3,Text.TEXT_HUPAI_4];
        }else if(RoomMgr.Instance().isJiSuMJ()){
            huType =[Text.TEXT_HUPAI_0,'','','碰碰胡',''];
        }
        var valueRes = res_pai.getComponent('mj_res_pai').majiangpai_new;
        this.pai.spriteFrame = valueRes.getSpriteFrame(pai3d_value.spriteFrame["_"+jiaoPai.id]);

        if(jiaoPai.fan == -1 && jiaoPai.cnt == -1){
            this.fan.string = '';
            this.cnt.string = '';
            this.hunPai.active = true;
        }else{
            if(RoomMgr.Instance().isTuiDaoHuMJ() || RoomMgr.Instance().isChiFengMJ()){
                let hupaiType = jlmj_str.hupaiJinZhouType;
                this.fan.string = hupaiType[jiaoPai.hutypesList[0]];
            }else{
                if(jiaoPai.fan == -1){
                    this.fan.string = '';
                }else{
                    this.fan.string = huType[jiaoPai.fan];
                }
            }
            this.cnt.string = jiaoPai.cnt+"张";
            this.hunPai.active = false;
        }
    },
    //
    // /**
    //  * 布局
    //  */
    // layout: function (target_node,align_left) {
    //     var widget = this.node.getComponent(cc.Widget);
    //     if(!widget){
    //         cc.error('jlmj_jiaopai_ui预制未挂在widget组件');
    //         return;
    //     }
    //     widget.target = target_node;
    //     widget.left = align_left;
    // },

});
