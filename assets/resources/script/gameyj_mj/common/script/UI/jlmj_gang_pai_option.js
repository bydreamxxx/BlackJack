/**
 * created by wj 2017/12/7
 */
var dd = cc.dd;
var pai3d_value = require("jlmj_pai3d_value");
var DeskED = require('jlmj_desk_data').DeskED;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var UserPlayer = require('jlmj_userPlayer_data').Instance();
var PlayerED = require("jlmj_player_data").PlayerED;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;
let RoomMgr = require('jlmj_room_mgr').RoomMgr;


cc.Class({
    extends:cc.Component,

    properties:{
        _GangClickCallBack:null,
        gang_optionp:[cc.Node],
        heng_layout:[cc.Layout],
        zong_layout:cc.Layout,
    },
    ctor: function(){
        this.groupList = [];
    },
    onLoad: function(){},

    //根据服务下发的杠牌数据具体化界面
    _openCombinationUi: function(gang_list, callBack){
        let gangCount3 = 12;
        let gangNum = 12;

        if(RoomMgr.Instance().isFangZhengMJ()){
            gangCount3 = 15;
            gangNum = 21;
        }

        if(callBack != null)
        {
            this._GangClickCallBack = callBack;
        }
        if(gang_list.length != 0)
        {
            this.groupList = gang_list;

            var new_groupList = [[],[],[]];
            var gang_1_num = 0, gang_3_num = 0, gang_4_num = 0;
            for(var _index in this.groupList)
            {
                for(var _index_ in this.groupList[_index])
                {
                    var item_data = this.groupList[_index][_index_];
                    if(item_data.length == 1){
                        new_groupList[0][gang_1_num++] = {item:item_data,paitype:0};
                    }else if(item_data.length == 3){
                        new_groupList[1][gang_3_num++] = {item:item_data,paitype:1};
                    }else if(item_data.length == 4){
                        new_groupList[2][gang_4_num++] = {item:item_data,paitype:2};
                    }
                }
            }
            this.groupList = new_groupList;
        }

        var cur_pai = 0;
        var cur_heng = 0;
        var gang_count = [0,0,0];
        var heng = this.heng_layout[cur_heng];
        //新杠
        for(var _index = 0; _index < this.groupList.length; _index++)
        {
            if(this.groupList[_index].length == 0){continue;}
            for(var _index_ = 0; _index_ < this.groupList[_index].length;_index_++)
            {
                var item_data = this.groupList[_index][_index_];
                if(typeof item_data == 'undefined'){continue;}
                if(item_data.paitype==0 && gang_count[0]>5){continue;}
                if(item_data.paitype==1 && gang_count[1]>gangNum){continue;}
                if(item_data.paitype==2 && gang_count[2]>3){continue;}

                var t_num = item_data.item.length;
                var gang = cc.instantiate(this.gang_optionp[item_data.paitype]);
                this._setOptionShow(gang,t_num,item_data.item);
                if(cur_pai + t_num > gangCount3){
                    heng = this.heng_layout[++cur_heng];
                    cur_pai = 0;
                }
                gang._idx = _index;
                gang._idx_ = _index_;
                gang.y = 0;
                cur_pai += t_num;
                heng.node.active = true;
                heng.node.addChild(gang);
                gang_count[item_data.paitype]++;
            }
        }
    },

    /**
     * 设置杠的显示
     * @param  option 杠牌控件
     * @param  gangType   杠牌类型 3/4
     * @param  groupList  杠牌数据
     */
    _setOptionShow:function(option,gangType,groupList)
    {
        option.active = true;
        if(groupList.length == 1){
            var sprite = option.getChildByName('New Sprite_1').getChildByName('value_0');
            if(sprite){
                this._setValues(sprite,groupList[0]);
            }

        }else{
            for(var i = 0; i < groupList.length; i++){
                var sprite = option.getChildByName('New Sprite_' + (i+1)).getChildByName('value_' + i);
                if(sprite){
                    sprite.parent.active = true;                    
                    this._setValues(sprite,groupList[i]);
                }
            }
        }
    },

    /**
     * 设置麻将的显示
     * @param sprite    需要设置的精灵
     * @param value     麻将的值
     */
    _setValues:function(sprite,value){
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return;
        }
        this.atlas = res_pai.getComponent('mj_res_pai').majiangpai_new;
        var _spriteFrame= this.atlas.getSpriteFrame(pai3d_value.spriteFrame["_"+value]);
        sprite.getComponent(cc.Sprite).spriteFrame =   _spriteFrame     
    },

    onClickOption: function (event,custom) {
        if( event.type != "touchend" ){
            return;
        }
        //根据点击的牌型获取牌数据
        var _idx = event.target._idx;
        var _idx_ = event.target._idx_;
        var gang_data = this.groupList[_idx][_idx_].item;

        this._GangClickCallBack(gang_data);
        this.clearUI();
        cc.dd.UIMgr.closeUI(this.node);
    },

    /**
     * 关闭界面取消信息
     */
    onCancelGang:function(){
        //DeskED.notifyEvent(DeskEvent.SHOW_UP_LISTBTN,[]);
        PlayerED.notifyEvent(PlayerEvent.SHOW_CLICK,[UserPlayer, false, null, 1]);    //取消牌的 不可点击 或者说是 切换出牌模式
        PlayerED.notifyEvent(PlayerEvent.CLEA_SELECT_CARD,[UserPlayer]); //取消已经选择的牌
        this.clearUI();
        this.groupList = [];
        cc.dd.UIMgr.closeUI(this.node);
    },
    clearUI:function () {
        for(var i in this.heng_layout)
        {
            var heng = this.heng_layout[i];
            heng.node.removeAllChildren(true);
            heng.node.active = false;
        }
        this.groupList = [];
    }
});