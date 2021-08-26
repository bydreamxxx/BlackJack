// create by wj 2019/04/25
var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oContent: cc.Node,
        m_oItem: cc.Node,
        m_tList: [],
    },


    onLoad () {},

    setWarnData: function(warnList, ipList, gpsList){
        this.m_tList.splice(0, this.m_tList.length);
        //设置警告信息
        warnList.forEach(function(warndata) {
            if(warndata){
                var player = playerMgr.findPlayerByUserId(warndata);
                if(player){
                    var node = cc.instantiate(this.m_oItem);
                    node.parent = this.m_oContent;
                    node.active = true;
                    node.getComponent(cc.RichText).string = '<color=#cd5555>' + player.getPlayerCommonInfo().name +'</color>' + '  <color=000000>未开启定位</color>';
                    this.m_tList.push(node);
                }
            }
        }.bind(this));

        //ip形同警告
        ipList.forEach(function(warndata) {
            if(warndata){
                var node = cc.instantiate(this.m_oItem);
                node.parent = this.m_oContent;
                node.active = true;
                var str = '';
                var ip = '';
                for(var i = 0; i < warndata.length; i++){
                    var player = playerMgr.findPlayerByUserId(warndata[i]);
                    if(player){
                        if(i == 0){
                            str = '<color=#cd5555>' + player.getPlayerCommonInfo().name + ' </color><color=#000000>与</color> '
                            ip = player.getPlayerCommonInfo().ip;
                        }else if( i == warndata.length - 1)
                            str += '<color=#cd5555>' + player.getPlayerCommonInfo().name + '</color>';
                        else
                            str += '<color=#cd5555>' + player.getPlayerCommonInfo().name + '</color><color=#000000>,</color>';
                    }
                }
                str += '  <color=#000000>ip相同: </color>' + '<color=#3cb371>' + ip +' </color>';
                node.getComponent(cc.RichText).string = str;
                this.m_tList.push(node);
            }
        }.bind(this));

        //位置相同警告
        gpsList.forEach(function(warndata) {
            if(warndata){
                var node = cc.instantiate(this.m_oItem);
                node.parent = this.m_oContent;
                node.active = true;
                var str = '';
                for(var i = 0; i < warndata.length; i++){
                    var player = playerMgr.findPlayerByUserId(warndata[i]);
                    if(player){
                        if(i == 0){
                            str = '<color=#cd5555>' + player.getPlayerCommonInfo().name + ' </color><color=#000000>与</color> '
                        }else if( i == warndata.length - 1)
                            str += '<color=#cd5555>' + player.getPlayerCommonInfo().name + '</color>';
                        else
                            str += '<color=#cd5555>' + player.getPlayerCommonInfo().name + '</color><color=#000000>,</color>';
                    }
                }
                str += '  <color=#000000> 位置相同</color>';
                node.getComponent(cc.RichText).string = str;
                this.m_tList.push(node);
            }
        }.bind(this));
    },

    onClose: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },


});
