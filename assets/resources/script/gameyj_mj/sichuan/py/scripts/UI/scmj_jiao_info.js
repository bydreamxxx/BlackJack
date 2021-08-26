let mj_jiao_info = require('mj_jiao_info');

cc.Class({
    extends: mj_jiao_info,

    setJiaoPaiList: function (jiaopai_list) {
        if(!this.play_list){
            return;
        }

        var cur_num =  0;
        this.addNode.removeAllChildren(true);
        for(var idx =0; idx<jiaopai_list.length; ++idx ){


            // var biaoji = [];
            // var num = 0;
            // var play_list = this.play_list;
            // var userList = play_list.getUserList();
            // for (var i in userList) {
            //     var com = userList[i];
            //     if(!com.node.active){
            //         continue;
            //     }
            //     var isuser = com.head.player.userId == cc.dd.user.id;
            //     num += com.getAllPaiToID(jiaopai_list[idx].id,isuser);
            //     if (isuser && com.modepai && com.modepai.node.active && Math.floor(com.modepai.cardId / 4) == Math.floor(jiaopai_list[idx].id / 4)) {
            //         num++;
            //     }
            // }
            // var cnt = 4 - num;
            var cnt = jiaopai_list[idx].cnt;
            var pai_node = cc.instantiate(this.jiaopai_ui);
            pai_node.active = true;
            if(cur_num == 5){
                this.frame.node.height += pai_node.height;
            }
            if(cur_num < 5){
                this.addNode.width = (idx + 1) * pai_node.width;
            }
            pai_node.parent = this.addNode;
            var jlmj_pai = pai_node.getComponent("scmj_jiao_pai");

            jlmj_pai.setJiaoPai(jiaopai_list[idx]);
            jlmj_pai.cnt.string = cnt+"张";
            jlmj_pai.node.y = 0;
            cur_num++;

        }
    },
});
