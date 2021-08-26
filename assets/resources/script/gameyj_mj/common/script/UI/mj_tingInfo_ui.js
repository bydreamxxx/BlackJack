var  jlmj_str  = require('jlmj_strConfig');


cc.Class({
    extends: cc.Component,

    properties: {
        fangkuangLayout: cc.Node,
        fangkuang: cc.Node,
        jiaopai_ui: cc.Node,
    },

    onLoad(){
        this.hupaiType = jlmj_str.hupaiJinZhouType;
    },

    close: function () {
        cc.dd.UIMgr.closeUI(this.node);
    },

    initUI: function(tingList, endFunc){
        this.endFunc = endFunc;

        this.fangkuangLayout.removeAllChildren();
        for(let k in tingList){
            if(tingList.hasOwnProperty(k)){
                this.createTingInfo(k, tingList[k]);
            }
        }
    },

    createTingInfo(fan, idList){
        idList.idList.sort((a, b)=>{
            return a - b;
        });

        let fangkuangNode = cc.instantiate(this.fangkuang);
        let paiNode = cc.find('pai_node', fangkuangNode);
        let hutype = cc.find('hutype', fangkuangNode).getComponent(cc.Label);
        let str = ''
        for(let i = 0; i < idList.hutype.length; i++){
            if(idList.hutype[i] != 2 && idList.hutype[i] != 9 && idList.hutype[i] != 15){
                str += this.hupaiType[idList.hutype[i]].replace('平胡', '屁胡').replace('夹胡', '屁胡').replace('边胡', '屁胡').replace('站立', '扣听').replace('清摸', '纯清风') + ' ';
            }
        }
        if(str == ''){
            str = '屁胡';
        }
        hutype.string = str;

        for(let i = 0; i < idList.idList.length; i++){
            let pai = cc.instantiate(this.jiaopai_ui);
            pai.active = true;

            if(i < 5){
                paiNode.width = (i + 1) * pai.width;
                fangkuangNode.height = this.jiaopai_ui.height;
            }else{
                fangkuangNode.height = this.jiaopai_ui.height + pai.height * 1.5;
            }

            paiNode.addChild(pai);

            var jlmj_pai = pai.getComponent("mj_jiao_pai");
            jlmj_pai.setJiaoPai({
                id: idList.idList[i],
                fan: -1,
                cnt: 0
            });
            jlmj_pai.node.y = 0;
        }

        fangkuangNode.tagname = fan;

        fangkuangNode.active = true;
        this.fangkuangLayout.addChild(fangkuangNode);

        fangkuangNode.y = fangkuangNode.height / 2
    },

    onClickKuang(event, data){
        if(this.endFunc){
            this.endFunc(parseInt(event.target.tagname));
        }

        this.close();
    }
});
