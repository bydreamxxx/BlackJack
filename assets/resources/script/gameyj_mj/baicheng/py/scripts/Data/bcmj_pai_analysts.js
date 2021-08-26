var gang_pai_List = require('jlmj_gang_pai_type');

var jlmj_pai_analysts = require('base_mj_pai_analysts');

var RoomMgr = require("jlmj_room_mgr").RoomMgr;
const gang_pai_config = require('bcmj_gangList');

var sh_PaiAnalysts = cc.Class({

    extends:jlmj_pai_analysts,

    cc_s_analysts: null,

    statics: {

        Instance: function () {
            if(!this.cc_s_analysts){
                this.cc_s_analysts = new sh_PaiAnalysts();
            }
            return this.cc_s_analysts;
        },

        Destroy: function () {
            if(this.cc_s_analysts){
                this.cc_s_analysts = null;
            }
        },

    },


    //补杠列表组合
    getBuGangGroup: function(cardList, groupList, isXiaoji, isgangting){
        var temp = [];
        var group3List = [];

        if(!isgangting){
            this._caculateListGroup(cardList,cardList.length,3,group3List, temp, 3);
        }

        //检查生成的排列是否为杠
        for(var index = 0; index < group3List.length; index++){
            var priority = this._checkGang(group3List[index], isXiaoji);
            if(priority == 0){
                group3List.splice(index,1);
                index = index - 1;
            }else{
                group3List[index].priority =  priority;
            }
        }

        //传入的数据是否为补杠/巴杠
        for(var index = 0; index < cardList.length; index++)
        {
            var cardID = cardList[index];
            if(this.isBuGang(cardID, isXiaoji) || this.isBaGang(cardID, isXiaoji))
            {
                var tempList = [];
                tempList.push(cardList[index]);
                tempList.priority = Math.floor(cardList[index] / 4) + 84;
                group3List.push(tempList);
            }
        }

        if(group3List.length != 0){
            this._filterList(group3List);
            this._sortGang(group3List);
            groupList.push(group3List);
            cc.log("三杠列表" + group3List + '\n 个数:' + group3List.length);
        }
    },
    /**
     * 获取所有杠牌的组合
     * @param cardList 杠牌数据列表
     * @param groupList 杠的容器

     */
    getAllGangGroup: function(cardList, groupList, isXiaoji, isgangting){
        var temp = [];
        var group1List = [];
        var group3List = [];
        var group4List = [];
        var t_cardList = cardList.slice();
        var sifeng = RoomMgr.Instance()._Rule.issifenggang;

        //传入的数据是否为补杠/巴杠
        for(var index = 0; index < t_cardList.length; index++)
        {
            var cardID = t_cardList[index];
            if(this.isBuGang(cardID, isXiaoji) || this.isBaGang(cardID, isXiaoji))
            {
                var tempList = [];
                tempList.push(t_cardList[index]);
                tempList.priority = Math.floor(t_cardList[index] / 4) + 84;
                group1List.push(tempList);
                var type = Math.floor(t_cardList[index]/4);
                if( type != gang_pai_List.CardType.S1)
                {
                    t_cardList.splice(index,1);
                    index--;
                }
            }
        }

        if(group1List.length != 0){
            this._filterList(group1List);
            this._sortGang(group1List);
            groupList.push(group1List);
            cc.log("补杠列表" + group1List + '\n 个数:' + group1List.length);
        }

        if(!isgangting){
            this._caculateListGroup(t_cardList,t_cardList.length,3,group3List, temp, 3);
        }

        //检查生成的排列是否为杠
        for(var index = 0; index < group3List.length; index++){
            var priority = this._checkGang(group3List[index], isXiaoji);
            if(priority == 0){
                group3List.splice(index,1);
                index = index - 1;
            }else{
                group3List[index].priority =  priority;
            }
        }

        //4杠组合数据
        if (t_cardList.length >= 4) {
            this._caculateListGroup(t_cardList, t_cardList.length, 4, group4List, temp, 4)
            //检查生成的排列是否为杠
            for (var index = 0; index < group4List.length; index++) {
                var priority = this._checkGang(group4List[index], isXiaoji);
                if (priority == 0) {
                    group4List.splice(index, 1);
                    index = index - 1;
                } else {
                    group4List[index].priority = priority;
                }
            }
        }

        if(sifeng){
            for(var i = 0; i < group3List.length; ++i){
                for(var idx in group3List[i]){
                    var type = Math.floor(group3List[i][idx]/4);
                    if( type == gang_pai_List.CardType.DONG ||
                        type == gang_pai_List.CardType.NAN ||
                        type == gang_pai_List.CardType.XI ||
                        type == gang_pai_List.CardType.BEI){
                        group3List.splice(i,1);
                        i--;
                        break;
                    }
                }
            }
        }
        if(this.require_DeskData.Instance().isJBC() || !sifeng){
            for(var i = 0; i < group4List.length; ++i){
                var type0 = Math.floor(group4List[i][0]/4);
                var type1 = Math.floor(group4List[i][1]/4);
                var type2 = Math.floor(group4List[i][2]/4);
                var type3 = Math.floor(group4List[i][3]/4);
                if(type0 != type1 || type0 != type2 || type0 != type3){
                    group4List.splice(i,1);
                    i--;
                }
            }
        }

        if(group3List.length != 0 && (this.require_playerMgr.Instance().getUserPlayer().canzfb || this.require_DeskData.Instance().isLiangPai(group3List[0][0]))){
            this._filterList(group3List);
            this._sortGang(group3List);
            groupList.push(group3List);
            cc.log("三杠列表" + group3List + '\n 个数:' + group3List.length);
        }

        if(group4List.length != 0){
            this._filterList(group4List);
            this._sortGang(group4List);
            groupList.push(group4List);
            cc.log("四杠列表" + group4List+ '\n 个数:' + group4List.length);

        }
    },

    /**
     * 检测是否为杠的牌型
     */
    _checkGang: function(groupList, isXiaoji){
        var checktag = [false,false,false,false];
        var priority = 0;
        var aaaaType = false;
        // //首先检查下是不是自己的杠牌
        // if(groupList.length == 4){
        //     aaaaType = this.isAAAAtype(groupList)
        // }
        // if(aaaaType){
        //     return priority = 81;
        // }
        // else{
        for(var index = 0; index < gang_pai_config.items.length; index++)
        {
            var item_info = gang_pai_config.items[index];
            if(item_info.priority_id == 0 && isXiaoji == false){
                continue;
            }
            if (item_info.group.length == groupList.length){
                //数组判定先排序
                this._sortArr(item_info.group);
                this._sortArr(groupList);
                for(var i = 0; i < item_info.group.length;i++){
                    if(Math.floor(groupList[i]/4) == item_info.group[i])
                    {
                        checktag[i] = true;
                    }

                    if(groupList.length == 3){
                        if(item_info.priority >= 81 && !this.require_DeskData.Instance().isLiangPai(groupList[i])){
                            checktag[i] = false;
                        }
                    }
                }
                var count = 0;
                for(var m =0; m < groupList.length; m++)
                {
                    if(checktag[m]){count++;}
                }
                if(count == groupList.length){
                    priority = item_info.priority;
                    break;
                }else{
                    checktag = [false,false,false,false];
                    count = 0;
                }
                count = 0;
            }
        }
        //}

        return priority;
    },

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    }

});

module.exports = sh_PaiAnalysts;