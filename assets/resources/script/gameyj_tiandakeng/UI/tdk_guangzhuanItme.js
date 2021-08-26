
cc.Class({
    extends: cc.Component,

    properties: {
        HeadNode: { default: null, type: cc.Sprite, tooltip: '头像', },
        NameStr: { default: null, type: cc.Label, tooltip: '名字', },
        IDstr: { default: null, type: cc.Label, tooltip: 'ID', },
    },
   
    onLoad: function () {
    },

    setItem: function (data) {
        if (!data) return;
        if (data.headUrl) { //头像
            cc.dd.SysTools.loadWxheadH5(this.HeadNode, data.headUrl);
        }
        if (this.NameStr) //名字
            this.NameStr.string = cc.dd.Utils.substr(data.name, 0, 4);
        if (this.IDstr) //ID
            this.IDstr.string = data.userId;
    },
});