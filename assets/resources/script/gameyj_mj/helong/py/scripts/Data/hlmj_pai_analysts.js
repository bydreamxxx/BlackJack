var jlmj_pai_analysts = require('base_mj_pai_analysts');
var RoomMgr = require("jlmj_room_mgr").RoomMgr;
const gang_pai_config = require('hlmj_gangList');
const gang_pai_List = require('jlmj_gang_pai_type');

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

    /**
     * 获取所有杠牌的组合
     * @param cardList 杠牌数据列表
     * @param groupList 杠的容器

     */
    getAllGangGroup: function(cardList, groupList, isXiaoji, isgangting){
        let userData = this.require_playerMgr.Instance().getUserPlayer();

        var temp = [];
        var group1List = [];
        var group4List = [];
        var t_cardList = cardList.slice();
        var sifeng = RoomMgr.Instance()._Rule.issifenggang;

        //传入的数据是否为补杠/巴杠
        for(var index = 0; index < t_cardList.length; index++)
        {
            var cardID = t_cardList[index];
            if(this.isBaGang(cardID, isXiaoji))
            {
                var tempList = [];
                tempList.push(t_cardList[index]);
                tempList.priority = Math.floor(t_cardList[index] / 4) + 84;

                if(this.require_DeskData.Instance().isFenZhang || !userData.canbugang) {
                    let mopaiID = userData.getMoPai();

                    if (tempList.indexOf(mopaiID) != -1) {
                        group1List.push(tempList);
                    }
                }else{
                    group1List.push(tempList);
                }
                // var type = Math.floor(t_cardList[index]/4);
                // if( type != gang_pai_List.CardType.S1)
                // {
                //     t_cardList.splice(index,1);
                //     index--;
                // }
            }
        }

        if(group1List.length != 0){
            this._filterList(group1List);
            this._sortGang(group1List);
            groupList.push(group1List);
            cc.log("补杠列表" + group1List + '\n 个数:' + group1List.length);
        }

        //4杠组合数据
        if (t_cardList.length >= 4) {
            this._caculateListGroup(t_cardList, t_cardList.length, 4, group4List, temp, 4)
            //检查生成的排列是否为杠
            for (var index = 0; index < group4List.length; index++) {
                let mopaiID = -1;
                if(this.require_DeskData.Instance().isFenZhang){
                    mopaiID = userData.getMoPai();
                }
                var priority = this._checkGang(group4List[index], isXiaoji, mopaiID);
                if (priority == 0) {
                    group4List.splice(index, 1);
                    index = index - 1;
                } else {
                    group4List[index].priority = priority;
                }
            }
        }

        // if(this.require_DeskData.Instance().isJBC() || !sifeng){
        //     for(var i = 0; i < group4List.length; ++i){
        //         var type0 = Math.floor(group4List[i][0]/4);
        //         var type1 = Math.floor(group4List[i][1]/4);
        //         var type2 = Math.floor(group4List[i][2]/4);
        //         var type3 = Math.floor(group4List[i][3]/4);
        //         if(type0 != type1 || type0 != type2 || type0 != type3){
        //             group4List.splice(i,1);
        //             i--;
        //         }
        //     }
        // }

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
    _checkGang: function(groupList, isXiaoji, mopaiID){
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
        if(cc.dd._.isNumber(mopaiID) && mopaiID >= 0){
            let checkList = groupList.filter((item)=>{
                return Math.floor(item / 4) == Math.floor(mopaiID / 4);
            })
            if(checkList.length == 0){
                return priority;
            }
        }
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
        return require("mjComponentValue").hlmj;
    }

});

module.exports = sh_PaiAnalysts;