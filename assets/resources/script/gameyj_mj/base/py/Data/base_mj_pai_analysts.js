/**
 * Created by yons on 2017/6/10.
 */

const gang_pai_List = require('jlmj_gang_pai_type');
const gang_pai_config = require('gangList');

let mjComponentValue = null;

var PaiAnalysts = cc.Class({

    s_analysts: null,

    statics: {

        Instance: function () {
            if(!this.s_analysts){
                this.s_analysts = new PaiAnalysts();
            }
            return this.s_analysts;
        },

        Destroy: function () {
            if(this.s_analysts){
                this.s_analysts = null;
            }
        },

    },

    ctor(){
        mjComponentValue = this.initMJComponet();
        this.require_DeskData = require(mjComponentValue.deskData).DeskData;
        this.require_playerMgr = require(mjComponentValue.playerMgr);
    },


    /**
     * 判断是不是中发白牌型
     */
    isZFB:function (cardList) {
        if(!cardList || cardList.length!=3) {
            return false;
        }
        var k=0;
        for(var i=0; cardList && i<cardList.length; ++i){
            var type = Math.floor(cardList[i]/4);
            if(type == gang_pai_List.CardType.ZHONG ||
                type == gang_pai_List.CardType.FA ||
                type == gang_pai_List.CardType.BAI){//只要是其中一个
                k += 1;
            }
        }
        if(k==3){
            return true;
        }
        return false;
    },

    /**
     * 判断牌组是不是 一样类型的牌  AAA 或 AAAA 或 BBB
     */
    isAAAAtype:function (gang_list) {
        //升序排列
        if(gang_list){
            gang_list.sort(function (a ,b) {
                return a-b;
            });
            if( Math.floor(gang_list[0]/4) ==  Math.floor(gang_list[gang_list.length-1]/4)){
                return true;
            }
        }
        return false;
    },
    /**
     * 判断特殊杠
     * @param pai_list  判断的集合
     * @param isXiaoji  有没有小鸡飞蛋
     */
    isGangToConfig:function (pai_list, isXiaoji, is19) {
        if(pai_list){
            var temp =[];
            for(var i=0; i<pai_list.length; ++i){
                temp.push( Math.floor(pai_list[i]/4));
            }
            return gang_pai_List.findGang(isXiaoji, is19,temp);
        }
        return false;
    },

    /**
     *  判断是不是杠牌
     * @param pai_list  判断的集合
     * @param isXiaoji  有没有小鸡飞蛋
     */
    isGang:function (pai_list, isXiaoji, is19) {
        if(!pai_list || pai_list.length>4 ||pai_list.length<3){
            return false;
        }else{
            if(pai_list.length==4 && this.isAAAAtype(pai_list)){//AAAA型 或 ABCD 或 AABC
                return true;
            }else if(this.isGangToConfig(pai_list, isXiaoji, is19)) {
                return true;
            }
        }
        return false;
    },
    /**
     * 判断牌能不能补杠
     *     SFG:        5,  //三风杠
     _4FG:       6,  //四风杠
     ZFBG:       7,  //中发白杠
     _19G1:      8,  //1杠
     _19G9:      9,  //9杠
     */
    isBuGang:function (cardID, isXiaoji) {
        var playerMgr = require(mjComponentValue.playerMgr);
        var BaipaiType = require("jlmj_baipai_data").BaipaiType;
        var userData = playerMgr.Instance().getUserPlayer();
        var cardType = gang_pai_List.getCardType(cardID);
        switch (cardType){
            case gang_pai_List.CardType.S1: //1 杠\
                var is = userData.isHaveGangData(BaipaiType._19G1) ||
                    userData.isHaveGangData(BaipaiType._19G9) ||
                    userData.isHaveGangData(BaipaiType._FG) ||
                    userData.isHaveGangData(BaipaiType.ZFBG);
                if(is && isXiaoji){//幺鸡特殊 有任何杠都能补
                    return true;
                }
            case gang_pai_List.CardType.T1:
            case gang_pai_List.CardType.W1:
                return userData.isHaveGangData(BaipaiType._19G1);
            case gang_pai_List.CardType.S9://9杠
            case gang_pai_List.CardType.T9:
            case gang_pai_List.CardType.W9:
                return userData.isHaveGangData(BaipaiType._19G9);
            case gang_pai_List.CardType.DONG://风牌
            case gang_pai_List.CardType.NAN:
            case gang_pai_List.CardType.XI:
            case gang_pai_List.CardType.BEI:
                return userData.isHaveGangData(BaipaiType._FG) ;
            case gang_pai_List.CardType.ZHONG://喜牌
            case gang_pai_List.CardType.FA:
            case gang_pai_List.CardType.BAI:
                return userData.isHaveGangData(BaipaiType.ZFBG);
        }
    },
    /**
     * 判断是不是吧杠
     */
    isBaGang:function (cardID) {
        var playerMgr = require(mjComponentValue.playerMgr);
        var BaipaiType = require("jlmj_baipai_data").BaipaiType;
        var userData = playerMgr.Instance().getUserPlayer();
        return userData.getPengData(BaipaiType.PENG, cardID);
    },

    /**
     * 获取所有杠牌的组合
     * @param cardList 杠牌数据列表
     * @param groupList 杠的容器

     */
    getAllGangGroup: function(cardList, groupList, isXiaoji, isgangting){
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


        //4杠组合数据
        if (cardList.length >= 4){
            var group4List = [];
            this._caculateListGroup(cardList,cardList.length,4, group4List, temp, 4)
            //检查生成的排列是否为杠
            for(var index = 0; index < group4List.length; index++){
                var priority = this._checkGang(group4List[index], isXiaoji);
                if(priority == 0){
                    group4List.splice(index,1);
                    index = index - 1;
                }else{
                    group4List[index].priority =  priority;
                }
            }
            if(group4List.length != 0){
                this._filterList(group4List);
                this._sortGang(group4List);
                groupList.push(group4List);
                cc.log("四杠列表" + group4List+ '\n 个数:' + group4List.length);

            }
        }
    },

    get4GangList:function (cardList, groupList, isXiaoji) {
        //4杠组合数据
        if (cardList.length >= 4){
            var temp = [];
            var group4List = [];
            this._caculateListGroup(cardList,cardList.length,4, group4List, temp, 4)
            //检查生成的排列是否为杠
            for(var index = 0; index < group4List.length; index++){
                var priority = this._checkGang(group4List[index], isXiaoji);
                if(priority == 0){
                    group4List.splice(index,1);
                    index = index - 1;
                }else{
                    group4List[index].priority =  priority;
                }
            }
            if(group4List.length != 0){
                this._filterList(group4List);
                this._sortGang(group4List);
                groupList.push(group4List);
                cc.log("四杠列表" + group4List+ '\n 个数:' + group4List.length);

            }
        }
    },

    /**
     * 获取排列组合
     * @param cardList 所有牌数据列表
     * @param listLength  排数据列表长度
     * @param gangType  杠牌是3个还是4个
     * @param grouplist  排列组合后保存点
     * @param temList  临时存储变量的地方
     */
    _caculateListGroup: function(cardList,listLength, gangType, grouplist, temList, count){
        if (gangType == 0){
            var temp = []
            for (var i = 0; i < count; i++)
            {
                temp.push(temList[count - 1 -i]);
            }
            grouplist.push(temp);
            return;
        }
        for(var index = listLength; index >= gangType; index--){
            temList[gangType - 1] = cardList[index - 1];
            this._caculateListGroup(cardList,index - 1, gangType - 1,grouplist,temList, count)
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
    /**
     * 将数组内部自排序
     */
    _sortArr:function(groupList)
    {
        var i = groupList.length;
        var temp ;
        while(i > 0){
            for(var j = 0; j < i -1; j++){
                if(groupList[j] > groupList[j+1])
                {
                    temp = groupList[j];
                    groupList[j] = groupList[j+1];
                    groupList[j+1] = temp;
                }
            }
            i--;
        }
    },

    /**
     * 将杠牌组合做优先级排序
     */
    _sortGang:function(groupList){
        var i = groupList.length;
        while(i > 0){
            for(var j = 0; j < i -1; j++){
                if(groupList[j].priority > groupList[j+1].priority)
                {
                    var temp = groupList[j+1];
                    groupList[j+1] = groupList[j];
                    groupList[j] = temp;
                }
            }
            i--;
        }
    },
    /**
     * 排除重复的数组列表
     */
    _filterList:function(groupList){
        for(var i = groupList.length - 1; i >= 0; i--){
            var target = groupList[i];
            for(var j = 0; j < i; j++)
            {
                if(target.priority == groupList[j].priority && target.priority != 81){
                    groupList.splice(i,1);
                    break;
                }
            }
        }
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_pai_analysts initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = PaiAnalysts;