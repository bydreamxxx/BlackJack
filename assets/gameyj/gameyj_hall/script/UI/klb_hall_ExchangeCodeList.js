var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        //contentNode: cc.Node,
        //record_Item: cc.Prefab,
        CodeTxt:{default: [], type: cc.Label},
    },

    // use this for initialization
    onLoad: function () {

    },

    setData: function(data){
        if(data.codeList.length == 0){
            var desc = cc.find('desc_1', this.node);
            desc.active = true;
        }else{
            for(var i = 0; i < data.codeList.length; i++){
                var codeInfo = data.codeList[i];
                if(codeInfo){
                    var node = cc.find('history_' + (i+1), this.node);
                    node.active = true;
                    this.CodeTxt[i].string = codeInfo.code;
                    node.getChildByName('money').getComponent(cc.Label).string = codeInfo.value  + '元';
                }
            }
        }

    },


    copy: function(event, data){
        hall_audio_mgr.com_btn_click();

        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.CodeTxt[data].string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
