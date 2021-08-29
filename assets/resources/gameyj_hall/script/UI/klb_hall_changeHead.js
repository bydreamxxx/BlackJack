var hall_audio_mgr = require('hall_audio_mgr').Instance();
const AppCfg = cc.dd.AppCfg;
var LoginData = require('jlmj_login_data');
var login_module = require('LoginModule');
var Platform = require('Platform');
let md5 = require('md5').MD5;
var hallData = require('hall_common_data').HallCommonData;
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var AppConfig = require('AppConfig');

let changeHead = cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node,
        changeCard: cc.Label,
        photoNode: cc.Node,
        cameraNode: cc.Node,
    },

    ctor(){
        this.regNativeCallFunc();
    },

    onLoad(){
        if(cc._isHuaweiGame && cc._lianyunID == 'oppo')
            this.photoNode.active = false;
        this.cameraNode.active = !cc._isHuaweiGame;
        if(cc.game_pid == 2){
            for(let i = 1; i < 7; i++){
                cc.find(`bg/content/Button${i}`, this.node).active = true;
            }

            cc.find('bg/New Label', this.node).getComponent(cc.Label).string = '上传头像需要消耗1张改名卡'
        }
        let changeCardInfo = hall_prop_data.getItemInfoByDataId(1102);
        this.changeCard.string = `剩余改名卡：${changeCardInfo ? changeCardInfo.count : 0} 张`;
    },

    start(){
        if(this._waitAdminAnima){
            return;
        }
        this._waitAdminAnima = true;
        this.bgNode.stopAllActions();

        this.bgNode.active = true;
        this.bgNode.scaleX = 0;
        this.bgNode.scaleY = 0;
        this.bgNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
            })
        ));
    },

    getData(){
        // let gameid = 10361;
        let data = {
            // gameid: gameid,
            // promoterid: '',
            // version: AppCfg.VERSION,
            // encrypt: 'md5',
            // source: 'client',
            // sign: md5('encrypt=md5&gameid=' + gameid + '&promoterid=&source=client&token='+LoginData.Instance().accountToken+'&version=' + AppCfg.VERSION + '#233e3d39a1b3de599b1ef45730bbf93e'),
            // token: LoginData.Instance().accountToken,
            user_id: cc.dd.user.id.toString()
        }
        // return [cc.dd.SysTools.encode64(JSON.stringify(data)), Platform.accountUrl+"v1/user/headImage"];
        return [JSON.stringify(data), Platform.newHeadUrl[AppCfg.PID]+"v1/headimg/upheadimg"];
    },

    onClickOpenAlbum(){
        hall_audio_mgr.com_btn_click();
        if(!cc.sys.isNative){
            cc.dd.PromptBoxUtil.show('网页暂不支持');
            return;
        }

        if(login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.GUEST){
            cc.dd.PromptBoxUtil.show('游客账号暂不支持');
            return;
        }

        if(!this.checkChangeCard()){
            return;
        }

        cc.dd.DialogBoxUtil.show(0, '更换头像将消耗1张改名卡', '确定', '取消',()=>{
            let [data,uploadURL] = this.getData();

            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/PicturePick', 'openAlbum', '(Ljava/lang/String;Ljava/lang/String;)V', data, uploadURL);
            }else if(cc.sys.OS_IOS == cc.sys.os){
                jsb.reflection.callStaticMethod('PicturePick', 'openAlbum:uploadURL:', data, uploadURL);
            }

            this.close();
        }, function(){});
    },

    onClickTakePhoto(){
        hall_audio_mgr.com_btn_click();
        if(!cc.sys.isNative){
            cc.dd.PromptBoxUtil.show('网页暂不支持');
            return;
        }

        if(login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.GUEST){
            cc.dd.PromptBoxUtil.show('游客账号暂不支持');
            return;
        }

        if(!this.checkChangeCard()){
            return;
        }

        cc.dd.DialogBoxUtil.show(0, '更换头像将消耗1张改名卡', '确定', '取消',()=>{
            let [data,uploadURL] = this.getData();

            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/PicturePick', 'takePhoto', '(Ljava/lang/String;Ljava/lang/String;)V', data, uploadURL);
            }else if(cc.sys.OS_IOS == cc.sys.os){
                jsb.reflection.callStaticMethod('PicturePick', 'takePhoto:uploadURL:', data, uploadURL);
            }

            this.close();
        }, function(){});
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        this.close();
    },

    onClickSystemHead(event, data){
        hall_audio_mgr.com_btn_click();


        if(!cc.sys.isNative){
            cc.dd.PromptBoxUtil.show('网页暂不支持');
            return;
        }

        if(login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.GUEST){
            cc.dd.PromptBoxUtil.show('游客账号暂不支持');
            return;
        }

        let func = ()=>{
            data = "$#XLYX_"+data;

            // let gameid = 10361;
            let json_data = {
                // gameid: gameid,
                // promoterid: '',
                // version: AppCfg.VERSION,
                // encrypt: 'md5',
                // source: 'client',
                // sign: md5('encrypt=md5&gameid=' + gameid + '&image='+data+'&promoterid=&source=client&token='+LoginData.Instance().accountToken+'&version=' + AppCfg.VERSION + '#233e3d39a1b3de599b1ef45730bbf93e'),
                // token: LoginData.Instance().accountToken,
                user_id: cc.dd.user.id.toString(),
                system_img: data,
            }

            json_data = encodeURIComponent(JSON.stringify(json_data));
            // let url = Platform.accountUrl+"v1/user/headReset";
            let url = Platform.newHeadUrl[AppCfg.PID]+"v1/headimg/upheadimg";
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var jsonData = JSON.parse(xhr.responseText);
                        cc.onChangeHeadCallBack(jsonData.code, jsonData.msg);
                        if (jsonData.code == 1) {
                            // cc.log(xhr.responseText)
                            this.close();
                        }
                        cc.log(jsonData.msg);
                    }
                    cc.dd.NetWaitUtil.close();
                    return;
                }

            }.bind(this);
            xhr.ontimeout = function () {
                cc.log('http timeout:headReset');
                cc.dd.NetWaitUtil.close();
            }.bind(this);
            xhr.onerror = function () {
                cc.log('http error:headReset');
                cc.dd.NetWaitUtil.close();
            }.bind(this);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            xhr.send("data=" + json_data);
        }

        if(cc.game_pid == 2){
            func();
        }else{
            if(!this.checkChangeCard()){
                return;
            }
            cc.dd.DialogBoxUtil.show(0, '更换头像将消耗1张改名卡', '确定', '取消', func, function(){});
        }

        // this.close();
    },

    close(){
        cc.dd.UIMgr.destroyUI(this.node);
    },

    checkChangeCard(){
        let changeCardInfo = hall_prop_data.getItemInfoByDataId(1102);
        if(changeCardInfo &&  changeCardInfo.count > 0){
            return true;
        }else{
            cc.dd.PromptBoxUtil.show('改名卡不足，无法修改');
            return false;
        }
    },


    regNativeCallFunc(){
        cc.onChangeHeadCallBack = function (code, msg){
            if(Number(code) == 1){
                if(cc.dd._.isUndefined(msg)){
                    cc.dd.PromptBoxUtil.show('更换头像失败，头像数据错误');
                    return;
                }
                var req = new cc.pb.hall.msg_modify_head_req();
                req.setNewHead(msg);
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_modify_head_req,req,
                    '发送协议[id: ${cc.netCmd.hall.cmd_msg_modify_head_req}],msg_modify_head_req[修改头像]', true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'changeHead');

                // cc.dd.PromptBoxUtil.show('更换头像成功');
                // LoginData.Instance().saveRefreshToken('');
                // // login_module.Instance().account_token = LoginData.Instance().accountToken;
                // login_module.Instance().getAcctounToken(()=>{
                //     login_module.Instance().AccountLogin(true);
                // });

            }else{
                cc.dd.PromptBoxUtil.show('更换头像失败code:'+code+msg);
            }
        }
    },

});

module.exports = changeHead;
