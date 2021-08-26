// var pai3d_cfg = require("jlmj_pai3d_down").Instance();
var pai3d_cfg = require("jlmj_pai3d_up").Instance();
// var pai3d_cfg = require("jlmj_pai3d_left").Instance();
// var pai3d_cfg = require("jlmj_pai3d_right").Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        zhanshi_pai_list: {default: [], type: [require('jlmj_pai')], tooltip: '出牌-下'},
        shoupai_idx_edit: {default: null, type: cc.EditBox, tooltip: '手牌索引'},
        dapai_idx_edit: {default: null, type: cc.EditBox, tooltip: '打牌索引'},
    },

    // use this for initialization
    onLoad: function () {
        this.chuPai_0 = [];
        this.chuPai_1 = [];
        this.chuPai_2 = [];
        this.chuPai_3 = [];
        this.pai3dCfg = pai3d_cfg;
        // this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/down/jlmj_shou2mid_down_';
        // this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/down/jlmj_mid2dapai_down_';
        // this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/right/jlmj_shou2mid_right_';
        // this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/right/jlmj_mid2dapai_right_';
        // this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/left/jlmj_shou2mid_left_';
        // this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/left/jlmj_mid2dapai_left_';
        this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/up/jlmj_shou2mid_up_';
        this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/up/jlmj_mid2dapai_up_';

        cc.dd.ResLoader.loadAtlas("gameyj_mj/common/atlas/majiangpai_new", function (err, res) {
            cc.log('加载完成');
        }.bind(this));
        this.value = 0;

        this.zhanshi_pai_list.forEach(function (item) {
           item.node.zIndex = 99;
        });
        this.player_idx = 3;
    },

    /**
     * 生成牌
     */
    createPai: function () {
        var pai_node = cc.instantiate(this.zhanshi_pai_list[0].node);
        var jlmj_pai = pai_node.getComponent("jlmj_pai");
        if (!jlmj_pai) {
            cc.error("麻将牌没有jlmj_pai组件");
        }
        return jlmj_pai;
    },

    dapai: function (event,data) {


        if(data == "0"){
            this.player_idx = 0;
            this.chuPai = this.chuPai_0;
            this.zhanshi_pai = this.zhanshi_pai_list[0];
            this.pai3dCfg = require("jlmj_pai3d_down").Instance();
            this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/down/jlmj_shou2mid_down_';
            this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/down/jlmj_mid2dapai_down_';

        }else if(data == "1"){
            this.player_idx = 1;
            this.chuPai = this.chuPai_1;
            this.zhanshi_pai = this.zhanshi_pai_list[1];
            this.pai3dCfg = require("jlmj_pai3d_right").Instance();
            this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/right/jlmj_shou2mid_right_';
            this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/right/jlmj_mid2dapai_right_';
        }else if(data == "2"){
            this.player_idx = 2;
            this.chuPai = this.chuPai_2;
            this.zhanshi_pai = this.zhanshi_pai_list[2];
            this.pai3dCfg = require("jlmj_pai3d_up").Instance();
            this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/up/jlmj_shou2mid_up_';
            this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/up/jlmj_mid2dapai_up_';
        }else{
            this.player_idx = 3;
            this.chuPai = this.chuPai_3;
            this.zhanshi_pai = this.zhanshi_pai_list[3];
            this.pai3dCfg = require("jlmj_pai3d_left").Instance();
            this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai/left/jlmj_shou2mid_left_';
            this.mid2dapai_ani_path = 'gameyj_mj/common/animations/pai/left/jlmj_mid2dapai_left_';
        }

        var jlmj_pai = this.createPai();
        if (!jlmj_pai) {
            return;
        }
        this.node.addChild(jlmj_pai.node);

        var chupai_length_list = [38,33,30,33];
        if(this.chuPai.length >= chupai_length_list[this.player_idx]){
            this.chuPai.forEach(function (item) {
                item.destroy();
            });
            this.chuPai.splice(0,chupai_length_list[this.player_idx]);
        }
        this.chuPai.push(jlmj_pai.node);

        var idx = this.chuPai.length-1;
        this.value+=4;
        this.value = this.value % 136;
        jlmj_pai.kaipai(this.pai3dCfg.dapai_cfg['frame_' + idx], this.pai3dCfg.dapai_cfg['value_' + idx], this.pai3dCfg.dapai_cfg);
        jlmj_pai.setValue(this.value);
        var shoupai_idx = idx%14;
        this.stop_chupai_ani();
        this.play_chupai_ani(shoupai_idx, idx, this.value);
    },

    stop_chupai_ani: function () {
        this.mid2dapai_playing = false;
        this.zhanshi_pai.node.active = false;
        this.zhanshi_pai.ani.stop();
        this.chuPai.forEach(function (pai) {
            pai.active = true;
        });
    },


    play_chupai_ani: function (chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        this.chuPai[last_chupai_idx].active = false;
        this.zhanshi_pai.setValue(cardID);
        cc.resources.load(this.shou2mid_ani_path + chupai_idx_in_shoupai, function (err, clip) {
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束-1");
                return;
            }
            cc.log('手牌-中间牌-start');
            this.zhanshi_pai.node.active = true;
            this.zhanshi_pai.ani.removeClip('shou2mid');
            this.zhanshi_pai.ani.addClip(clip, 'shou2mid');
            this.zhanshi_pai.ani.play('shou2mid');

            //中间牌转变打牌end
            var mid2dapaiEnd = function () {
                this.mid2dapai_playing = false;
                this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束-5");
                    return;
                }
                cc.log('中间牌-打牌-end');
                this.zhanshi_pai.node.active = false;
                var last_chupai_idx = this.chuPai.length - 1;
                this.chuPai[last_chupai_idx].active = true;
            }.bind(this);
            //中间牌转变打牌
            var mid2dapai = function () {
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束-3");
                    return;
                }
                cc.log('中间牌-打牌-start');
                var last_chupai_idx = this.chuPai.length - 1;
                cc.resources.load(this.mid2dapai_ani_path + last_chupai_idx, function (err, clip) {
                    if (this.zhanshi_pai.cardId != cardID) {
                        cc.log("出牌动画-提前结束-4");
                        return;
                    }
                    setTimeout(function () {
                        this.mid2dapai_playing = true;
                    }.bind(this),200);
                    this.zhanshi_pai.ani.removeClip('mid2dapai');
                    this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                    this.zhanshi_pai.ani.play('mid2dapai');
                    this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                }.bind(this));
            }.bind(this);
            //手牌转变中间牌end
            var shou2midEnd = function () {
                this.zhanshi_pai.ani.off('finished', shou2midEnd);
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束-2");
                    return;
                }
                cc.log('手牌-中间牌-end');
                setTimeout(function () {
                    mid2dapai();
                }.bind(this), 500);
            }.bind(this);

            this.zhanshi_pai.ani.on('finished', shou2midEnd);
        }.bind(this));

    },


    playAction1: function () {
        var ani = this.zhanshi_pai.getComponent(cc.Animation);
        ani.play('jlmj_shou2mid');
    },

    playAction2: function () {
        var ani = this.zhanshi_pai.getComponent(cc.Animation);
        ani.play('jlmj_mid2dapai');
    },

    update: function () {
        //右家
        if( this.player_idx == 1&&this.mid2dapai_playing&&this.zhanshi_pai.node.active){
            var length = this.chuPai.length;
            if(length>=2){
                var x = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].x;
                var y = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].y;
                var width = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].sizeW;
                var height = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].sizeH;
                var order_rect = cc.rect(x-width/2,y-height/2,width,height-15);
                if (order_rect.contains(this.zhanshi_pai.node.getPosition())) {
                    this.zhanshi_pai.node.active = false;
                    this.chuPai.forEach(function (pai) {
                        pai.active = true;
                    });
                }
            }
        }

        //自己
        if( this.player_idx == 0&&this.mid2dapai_playing&&this.zhanshi_pai.node.active){
            var length = this.chuPai.length;
            if(length>=12){
                var x = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].x;
                var y = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].y;
                var width = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].sizeW;
                var height = this.pai3dCfg.dapai_cfg['frame_'+(length-1)].sizeH;
                var order_rect = cc.rect(x-width/2,y-height/2,width,height);
                if (order_rect.contains(this.zhanshi_pai.node.getPosition())) {
                    this.zhanshi_pai.node.active = false;
                    this.chuPai.forEach(function (pai) {
                        pai.active = true;
                    });
                }
            }
        }
    },

});
