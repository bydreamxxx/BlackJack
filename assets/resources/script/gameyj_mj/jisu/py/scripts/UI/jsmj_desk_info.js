var dd = cc.dd;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var HuType = require('jlmj_define').HuType;
let base_mj_desk_info = require('base_mj_desk_info');

var Text = cc.dd.Text;
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var UIZorder = require("mj_ui_zorder");
var game_room = require("game_room");

var baseDeskInfo = cc.Class({
    extends: base_mj_desk_info,

    initProperties: function() {
        cc.log("jsmj_desk_info onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-jisu").getComponent(cc.Sprite);

        // this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        // this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        // this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        // this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        // this.qd_ani.node.active = false;
    },

    /**
     * 获取文字玩法
     */
    getGameGuiZe: function() {
        return [[], [], '', ''];
    },

    clearHuAni(){
        // this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        // this.qd_ani.node.active = false;
    },


    getQuanJu(data){
        return '';
    },

    on_show_da_pai_prompt:function (data) {
        // if(data[1] != null && this.da_pai_prompt){
        //     if(data[0] == -1 && this.dapai_tip_type == 0 && data[1] == false){
        //         return;
        //     }
        //     if(data[0] == -2 && this.dapai_tip_type == 1 && data[1] == false){
        //         return;
        //     }
        //     this.dapai_tip_type = data[0];
        //     this.da_pai_prompt.active = data[1];
        //     var text_arr = [Text.TEXT_MJ_DESK_INFO_0,Text.TEXT_MJ_DESK_INFO_7];
        //     this.da_pai_prompt_label.string = text_arr [data[0]];
        // }
    },

    getFJInfo(){
        return '';
    },

    getHuAni(id){
        switch(id){
            // case HuType.GANG_HUA_HU:
            //     return [this.gghh_ani, ['gangshanghua']];
            // case HuType.GANG_PAO_HU:
            //     return [this.gghh_ani, ['gangshangpao']];
            // case HuType.HAIDI_LAO:
            //     return [this.gghh_ani, ['haidilao']];
            // case HuType.HAIDI_PAO:
            //     return [this.gghh_ani, ['haidipao']];
            // case -1:
            //     return [this.gghh_ani, ['yipaoshuangxiang']];
            // case -2:
            //     return [this.gghh_ani, ['yipaosanxiang']];
            // case HuType.JIA5_HU:
            //     return [this.gkm_ani, ['guadafeng']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.gkm_ani, ['kaipaizha']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.jingoushiba_ani, ['jingoudiao']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['haoqidui']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['longqidui']];
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qidui']];
            // case -3:
            //     return [this.qd_ani, ['qinglongqidui']];
            // case -4:
            //     return [this.qd_ani, ['qinqidui']];
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    fapai: function() {
        this.db_duiju = this._kaiJuAni.getComponent(dragonBones.ArmatureDisplay);
        this.db_duiju.node.active = true;
        this.db_duiju.playAnimation("DJKS", 1);
        this.db_duiju.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
        this.db_duiju.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);

        let ani = this.use2D ? "jlmj_fapai_ani_jisu_2d" : "jlmj_fapai_ani_jisu";

        this._deskNode.getComponent(cc.Animation).play(ani);
        this._deskNode.getComponent(cc.Animation).setCurrentTime(0, ani);
    },

    /**
     * 结算
     * @param data
     */
    jiesuan: function (data) {

        cc.log("结算ui弹出");
        if (this.fenzhang) {
            this.fenzhang.node.active = false;
        }

        if( this._jiesuan){
            this._jiesuan.close();
            this._jiesuan = null;
        }

        if(this._jsmj_jiesuan){
            this._jsmj_jiesuan.close();
            this._jsmj_jiesuan = null;
        }

        if(this.jiesuan_TimeID){
            clearTimeout(this.jiesuan_TimeID);
        }
        this.da_pai_prompt.active = false;

        let waitTime = cc._needShowDrop && !this.require_DeskData.Instance().isMatch() ? 4000 : 0;

        this.lastJiesuan = data[0];

        cc.dd.mj_game_start = false;


        this.jiesuan_TimeID = setTimeout(() => {
            this.jiesuan_TimeID = null;

            cc.log("结算ui延时弹出----------》  " + data);
            if (!data || !data[0]) {
                this.require_DeskData.Instance().waitJiesuan = false;
                return;
            }

            if(this.require_DeskData.Instance().getIsStart() && data[1] !== true){
                this.require_DeskData.Instance().waitJiesuan = false;
                return;
            }
            if (this.require_DeskData.Instance().isInMaJiang()) {
                let func = ()=>{
                    cc.dd.UIMgr.openUI('gameyj_mj/jisu/py/prefabs/jsmj_jiesuan_ui',(ui) => {
                        var jlmj_jiesuan = ui.getComponent("jlmj_jiesuan_ui");
                        jlmj_jiesuan.showJianYiLayer(data[0], 15,()=> {
                            this._jiesuan = null;
                            this.require_DeskData.Instance().waitJiesuan = false;
                        }, data[1]);
                        // jlmj_jiesuan.jiesuanBtnCallBack();
                        this._jiesuan = jlmj_jiesuan;
                        this.playJieSuanAudio();
                        // var ani = this._jiesuan.node.getComponent(cc.Animation);
                        // if(data[0].huuserid){
                        //     ani.play('mj_jiesuan');
                        // }

                        cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO);

                        if(this.require_DeskData.Instance().isJBC()) {
                            this._messageBtn.getComponent(cc.Button).interactable = false;
                            //判断是否破产停止倒计时
                            var roomId = RoomMgr.Instance().roomLv;
                            var gameId = RoomMgr.Instance().gameId;
                            var room_item = game_room.getItem(function(item){
                                return item.gameid == gameId && item.roomid == roomId;
                            });

                            if(room_item && HallPropData.getCoin() < room_item.entermin){
                                cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_XIAOQIAN,(ui)=> {
                                    var mj_huaqian = ui.getComponent("mj_huaqian");
                                    mj_huaqian.setEntermin(room_item.entermin);
                                    ui.zIndex = UIZorder.MJ_LAYER_TOP;
                                    jlmj_jiesuan.stopTime();
                                });
                            }
                        }else if(this.require_DeskData.Instance().isFriend()){
                            if(this.require_DeskData.Instance().isDajiesuan){
                                this.result_TimeID = setTimeout(()=> {
                                    this.onShowResultView();
                                }, 2000);
                            }
                        }

                    });
                }

                if(data[0].baopaiList.length > 0){
                    cc.dd.UIMgr.openUI('gameyj_mj/jisu/py/prefabs/jsmj_jiesuan_haidi',(ui) => {
                        var jsmj_jiesuan = ui.getComponent("jsmj_jiesuan_haidi");
                        jsmj_jiesuan.show(data[0].baopaiList, data[0].playercoininfoList[0].baolistList, ()=>{
                            this._jsmj_jiesuan = null;
                            func();
                        });
                        this._jsmj_jiesuan = jsmj_jiesuan;
                    });
                }else{
                    func();
                }

            }
        },waitTime);
    },


    update_hall_data: function( msg ) {
        if(this.isDeskReplay()){
            if(cc.replay_looker_id){
                cc.dd.user.id = cc.replay_looker_id;    //旁观者作为第一视角
            }
            cc.log('前后台切换,麻将回放场景中不返回大厅');
            return;
        }

        var jiesuan_ui = cc.dd.UIMgr.getUI('gameyj_mj/jisu/py/prefabs/jsmj_jiesuan_ui');
        if(jiesuan_ui && jiesuan_ui.active){
            cc.log("存在结算界面时,不返回大厅");
            return;
        }

        // cc.dd.DialogBoxUtil.show(0, "本局游戏未开始或已结束", '确定', null,
        //     function () {
        // 返回大厅
        this.require_playerMgr.Instance().clear();
        this.gobackHall();
        //     },
        //     function () {
        //     }
        // );
    },

    onDestroy: function () {
        this._super();
        if(this._jsmj_jiesuan){
            this._jsmj_jiesuan.close();
            this._jsmj_jiesuan = null;
        }
    },

    cleanJieSuan(){
        this._super();
        if(this._jsmj_jiesuan){
            this._jsmj_jiesuan.close();
            this._jsmj_jiesuan = null;
        }
    },

    recoverDesk: function () {
        this._super();

        if(this.isDeskJBC()){
            if(this.require_DeskData.Instance().isGameStart){
                if(this._jsmj_jiesuan){
                    this._jsmj_jiesuan.close();
                    this._jsmj_jiesuan = null;
                }
            }
        }
    },

    hideDeskReady: function () {
        this._super();

        if(this.isDeskJBC()){
            if(this._jsmj_jiesuan){
                this._jsmj_jiesuan.close();
                this._jsmj_jiesuan = null;
            }
        }
    },

    restConnect:function () {
        this._super();
        if(this._jsmj_jiesuan){
            this._jsmj_jiesuan.close();
            this._jsmj_jiesuan = null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").jsmj;
    }
});
module.exports = baseDeskInfo;