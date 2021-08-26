let jlmj_gang_pai_option = require('jlmj_gang_pai_option');

cc.Class({
    extends: jlmj_gang_pai_option,


//根据服务下发的杠牌数据具体化界面
    _openCombinationUi: function(gang_list, callBack){
        if(callBack != null)
        {
            this._GangClickCallBack = callBack;
        }
        if(gang_list.length != 0)
        {
            this.groupList = gang_list;

            var new_groupList = [[],[]];
            var gang_1_num = 0, gang_2_num = 0;
            for(var _index in this.groupList)
            {
                    var item_data = this.groupList[_index];
                    if(item_data.length == 1){
                        new_groupList[0][gang_1_num++] = {item:item_data,paitype:0};
                    }else if(item_data.length >= 2){
                        if(item_data.length > 2){
                            item_data.splice(2, item_data.length - 2);
                        }
                        new_groupList[1][gang_2_num++] = {item:item_data,paitype:1};
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
                if(item_data.paitype==1 && gang_count[1]>12){continue;}
                if(item_data.paitype==2 && gang_count[2]>3){continue;}

                var t_num = item_data.item.length;
                var gang = cc.instantiate(this.gang_optionp[item_data.paitype]);
                this._setOptionShow(gang,t_num,item_data.item);
                if(cur_pai + t_num > 12){
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
        // this._GangClickCallBack()
        this.clearUI();
        this.groupList = [];
        cc.dd.UIMgr.closeUI(this.node);
    },
});
