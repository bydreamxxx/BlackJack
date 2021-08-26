
const MAX_showCount = 5;
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        frame: { default: null, type: cc.Sprite, tooltip: '框' },
        addNode:cc.Node,//添加节点
        huSp:cc.Node,
        jiaopai_ui: { default: null, type: cc.Node, tooltip: '叫牌' },
        bg:cc.Node,
        scrollView: cc.Node,
        viewNode: cc.Node,
    },

    ctor: function () {
        this.paiPool = new cc.NodePool();
    },

    initPool(){
        for (let i = 0; i < 28; ++i) {
            let pai_node = cc.instantiate(this.jiaopai_ui); // 创建节点
            this.paiPool.put(pai_node); // 通过 put 接口放入对象池
        }
        this.onClickClose();
    },

    // use this for initialization
    init: function (play_list) {
        this.play_list = play_list;
        this.addNode.width = this.jiaopai_ui.width;
        this.frame.node.height = this.jiaopai_ui.height;

        if(this.scrollView){
            this.scrollView.height = this.frame.node.height;
            this.scrollView.width = this.addNode.width;
            this.viewNode.height = this.scrollView.height / 2;
            this.viewNode.width = this.scrollView.width;
            this.scrollView.getComponent(cc.ScrollView).setContentPosition(cc.v2(0, 0));
        }
    },

    showMask:function (show) {
        this.active = show;
    },
    setJiaoPaiList: function (jiaopai_list) {
        if(!this.play_list){
            return;
        }

        var cur_num =  0;

        for(let i = this.addNode.children.length - 1; i >= 0; i--){
            this.paiPool.put(this.addNode.children[i]);
        }

        jiaopai_list.sort((a, b)=>{
            return a.id - b.id;
        });

        // this.addNode.removeAllChildren(true);
        for(var idx =0; idx<jiaopai_list.length; ++idx ){


            var biaoji = [];
            var num = 0;
            var play_list = this.play_list;
            var userList = play_list.getUserList();
            for (let i = 0; i < userList.length; i++) {
                var com = userList[i];
                if(!com.node.active){
                    continue;
                }
                var isuser = com.head.player.userId == cc.dd.user.id;
                let count = com.getAllPaiToID(jiaopai_list[idx].id,isuser);
                num += count;
                if (isuser && com.modepai && com.modepai.node.active && Math.floor(com.modepai.cardId / 4) == Math.floor(jiaopai_list[idx].id / 4)) {
                    num++;
                }
            }

            if(RoomMgr.Instance().isWuDanMJ()){
                let DeskData = require("wdmj_desk_data").DeskData;
                if(Math.floor(DeskData.Instance().unBaopai / 4) == Math.floor(jiaopai_list[idx].id / 4)){
                    num++;
                }
            }

            if(num >4){
                num = 4;
            }

            var cnt = 4 - num;
            if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.JZMJ_GOLD || RoomMgr.Instance().gameId == cc.dd.Define.GameType.JZMJ_FRIEND){
                cnt = jiaopai_list[idx].cnt;
            }

            var pai_node = null;
            if(this.paiPool.size() > 0){
                pai_node = this.paiPool.get();
            }else{
                pai_node = cc.instantiate(this.jiaopai_ui);
            }
            pai_node.active = true;
            // if(cur_num == 5){
            //     this.frame.node.height += pai_node.height;
            // }

            if(cur_num < 5){
                this.addNode.width = (idx + 1) * pai_node.width;
            }

            if(this.scrollView){
                if(Math.floor(cur_num / 5) > 1){
                    this.frame.node.height = this.jiaopai_ui.height + pai_node.height * 1.5;
                }else{
                    this.frame.node.height = this.jiaopai_ui.height + pai_node.height * Math.floor(cur_num / 5);
                }
            }else{
                this.frame.node.height = this.jiaopai_ui.height + pai_node.height * Math.floor(cur_num / 5);
            }

            pai_node.parent = this.addNode;
            var jlmj_pai = pai_node.getComponent("mj_jiao_pai");

            jlmj_pai.setJiaoPai(jiaopai_list[idx]);
            if(jiaopai_list[idx].fan == -1 && jiaopai_list[idx].cnt == -1){
                jlmj_pai.cnt.string = "";
            }else{
                jlmj_pai.cnt.string = cnt+"张";
            }
            jlmj_pai.node.y = 0;
            cur_num++;

        }

        if(this.scrollView) {
            this.scrollView.height = this.frame.node.height;
            this.scrollView.width = this.addNode.width;
            this.viewNode.height = this.scrollView.height;
            this.viewNode.width = this.scrollView.width;
            this.viewNode.y = this.scrollView.height / 2;
            // this.addNode.y = 0;
            this.scrollView.getComponent(cc.ScrollView).setContentPosition(cc.v2(0, 0));
        }
    },
    onClickClose: function () {
        cc.dd.UIMgr.closeUI(this.node);
        this.active = false;
    },

});
