var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
const AppCfg = cc.dd.AppCfg;
var LoginData = require('jlmj_login_data');
var login_module = require('LoginModule');
var Platform = require('Platform');
let md5 = require('md5').MD5;

cc.Class({
    extends: cc.Component,

    properties: {

        head:cc.Sprite,
        aggentName:cc.Label,
        aggentid:cc.Label,

    },

    onLoad(){

    },

    showAggent:function(msg)
    {
        this.aggentData = msg;
        if(this.aggentData)
        {
            this.aggentName.string = msg.name;
            this.aggentid.string = "ID:"+msg.playerid;
            cc.dd.SysTools.loadWxheadH5(this.head, cc.dd.Utils.getWX64Url(msg.headUrl));
        }

    },

    setCode:function(code)
    {
        this.code = code;
        cc.log("")
    },

    onClickCancel:function()
    {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickConfirm:function()
    {
        const req = new cc.pb.hall.hall_bind_agent_req;
        req.setCode(this.code);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_bind_agent_req, req,
            '发送协议 hall_bind_agent_req', true);
        this.onClickCancel();
    },


});
