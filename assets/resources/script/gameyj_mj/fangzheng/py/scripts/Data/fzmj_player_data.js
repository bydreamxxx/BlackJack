var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;
var JLGData = require("jlmj_baipai_data").JLGData;

var pai3d_value = require("jlmj_pai3d_value");

var base_mj_player_data = require('base_mj_player_data');

var mjComponentValue = null;

//喜牌类型
const XI_PAI_TYPE = [
    //一饼一条一万
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   1,   0,   1,   0,    1,   0,   0],
    //一饼一万红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   1,   0,   0,   0,    1,   0,   1],
    //一条一万红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   1,   0,    1,   0,   1],
    //一条一条一万
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   2,   0,    1,   0,   0],
    //一万红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   0,   0,    1,   0,   2],
    //一饼一条红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   1,   0,   1,   0,    0,   0,   1],
    //一饼一条一条
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   1,   0,   2,   0,    0,   0,   0],
    //一饼红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   1,   0,   0,   0,    0,   0,   2],
    //九饼九条九万
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   0,   1,    0,   1,   0],
    //九饼一条九万
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   1,   0,    0,   1,   0],
    //九饼九万红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   0,   0,    0,   1,   1],
    //九条一条九万
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   1,   1,    0,   1,   0],
    //九条九万红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   0,   1,    0,   1,   1],
    //一条九万红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   1,   0,    0,   1,   1],
    //一条一条九万
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   2,   0,    0,   1,   0],
    //九万红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   0,   0,    0,   1,   2],
    //九饼九条一条
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   1,   1,    0,   0,   0],
    //九饼九条红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   0,   1,    0,   0,   1],
    //九饼一条红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   1,   0,    0,   0,   1],
    //九饼一条一条
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   2,   0,    0,   0,   0],
    //九饼红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   1,   0,   0,    0,   0,   2],
    //九条一条红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   1,   1,    0,   0,   1],
    //九条一条一条
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   2,   1,    0,   0,   0],
    //九条红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   0,   1,    0,   0,   2],
    //一条一条一条
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   3,   0,    0,   0,   0],
    //一条一条红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   2,   0,    0,   0,   1],
    //一条红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   1,   0,    0,   0,   2],
    //红中红中红中
    //一饼, 九饼, 一条, 九条, 一万, 九万, 红中
    [   0,   0,   0,   0,    0,   0,   3],
]

var sh_PlayerData = cc.Class({
    extends: base_mj_player_data.PlayerData,

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    /**
     * 用户玩家 是否有操作选项
     */
    hasCaozuo: function () {
        cc.log('----判断关闭吃碰杠菜单开始---'+this.canchi+"  "+this.canpeng+"  "+this.cangang+"  "+this.canting+"  "+this.canhu+"  "+this.canpengting + " " + this.canchiting + " " + this.cangangting + " " + this.canliangzhang + " " + this.canliangxi);
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu|| this.canpengting || this.canchiting || this.cangangting || this.canliangzhang || this.canliangxi;
    },

    clearCtrlStatus(){
        this.canchi = false;
        this.canpeng = false;
        this.cangang = false;
        this.canbugang = false;
        this.canhu = false;
        this.canting = false;
        this.isGangTing = false;
        this.cangangmopai = false;
        this.canpengting = false;
        this.canchiting = false;
        this.cangangting = false;
        this.canliangzhang = false;
        this.canliangxi = false;
    },


    /**
     * 初始化游戏数据
     */
    initGameData: function () {
        this._super();
        this.zhangBaoList = [];
    },

    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCtrlStatus: function (msg, isGangTing) {
        this.canchi = !msg.chitingjiaoinfosList.length && msg.canchi?true:false;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = msg.canting;
        this.isGangTing = isGangTing || false;
        this.cangangmopai = msg.cangangmopai;
        this.canxiaosa = msg.canxiaosa;
        this.canchiting = msg.chitingjiaoinfosList.length && msg.canchi?true:false;
        this.canliangzhang = msg.hasOwnProperty('canliangzhang') ? msg.canliangzhang : false;
        this.canliangxi = msg.canliangxi;

        var caozuoDes = function (canchi,canpeng,cangang,canbugang,canting,canhu,canliangxi) {
            var des = "[";
            if(canchi)  { des+=" 吃 " };
            if(canpeng) { des+=" 碰 " };
            if(cangang) { des+=" 杠 " };
            if(canbugang) { des+=" 补杠 " };
            if(canting) { des+=" 听 " };
            if(canhu)   { des+=" 胡 " };
            if(canliangxi)   { des+=" 亮喜 " };
            des += "]";
            return des;
        };
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+caozuoDes(this.canchi,this.canpeng,this.cangang,this.canbugang,this.canting,this.canhu,this.canliangxi));
        this.isTempXiaosa = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;

        if(this._isUserPlayer){
            this.canchi =  msg.canchi;
            this.canchiting = msg.chitingjiaoinfosList.length && msg.canchiting?true:false;
            this.canpengting = msg.pengtingjiaoinfosList.length && msg.canpengting?true:false;
            this.cangangting = msg.gangtingjiaoinfosList.length && msg.cangangting?true:false;

            // this.checkGangXi(msg);

            var DeskData = require(mjComponentValue.deskData).DeskData;
            if(msg.actcard){
                DeskData.Instance().last_chupai_id = msg.actcard.id;
            }
        }
    },

    setCPGTFunc(msg){
        this.setChiOptions(msg);
        this.setGangOptions(msg);
        this.setCanTing(msg);
        this.setCanChiTing(msg);
        this.setCanPengTing(msg);
        this.setCanGangTing(msg);
        this.setXiOptions(msg);

        if(this._isUserPlayer) {
            this.setLiangZhang(msg);
        }

        if(this.isTempBaoGu){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTingbiaoji(false);
            this.isTempBaoGu = false;
        }

        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this, isGangTing]);
    },


    /**
     * 是否有摸牌
     */
    hasMoPai: function () {
        if(this.shoupai.length == 11) {
            if(this.baipai_data_list.length == 1 && this.baipai_data_list[0].cardIds.length == 2){
                return false;
            }else{
                return this.shoupai.length % 3 == 2;
            }
        }if(this.shoupai.length == 12) {
            if(this.baipai_data_list.length == 1 && this.baipai_data_list[0].cardIds.length == 2){
                return true;
            }else{
                return this.shoupai.length % 3 == 2;
            }
        }else{
            return this.shoupai.length % 3 == 2;
        }
    },

    /**
     * 用户玩家 设置 杠牌选项
     */
    setXiOptions: function(msg){
        this.xiList = {};

        if(!msg.canliangxi){
            return;
        }

        this.xiList.isnewdealstyle = msg.gangcards.isnewdealstyle || false;
        this.xiList.cardList = [];
        if(!this.xiList.isnewdealstyle){//当是点杠时才有这个中心牌
            this.xiList.centerId =  msg.gangcards.centercard.id;
        }

        msg.gangcards.gangcardList.forEach(function(item,idx){
            this.xiList.cardList.push(item.id);//可杠 或是可选的杠牌的集合
        },this);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 喜牌选项"+":"+pai3d_value.descs(this.xiList.cardList));
    },

    /**
     * 亮掌宝
     */
    liangzhangbao(pengcardList){
        if(!pengcardList){
            cc.log("【数据】"+"亮掌宝列表为空");
            return;
        }

        this.zhangBaoList = [];
        pengcardList.forEach(function (card) {
            if(card){
                this.zhangBaoList.push(card.id);
            }else{
                cc.error("【数据】"+"亮掌宝列表项为空");
            }
        }.bind(this));
        // this.delShouPai(pengIds,1);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 亮掌宝:"+pai3d_value.descs(this.zhangBaoList));

        var baipai_data = new BaipaiData();
        baipai_data.index = this.baipai_data_list.length;
        var mj_index = 0;
        this.baipai_data_list.forEach(function(baipai){
            mj_index += baipai.down_pai_num;
        });
        baipai_data.mj_index = mj_index;
        baipai_data.type = BaipaiType.LZB;
        baipai_data.down_pai_num = 2;
        baipai_data.cardIds = this.zhangBaoList;
        this.baipai_data_list.push(baipai_data);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 亮掌宝:");
        this.baipai_data_list.forEach(function(item){
            cc.log(item.toString());
        });

        this.resetBaiPaiIndex();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.LIANGZHANG,[this,baipai_data]);
    },

    /**
     * 初始化摆牌数据
     */
    initBaiPaiData: function( baipaiDataList ) {
        if( !baipaiDataList ) {
            return;
        }
        this.baipai_data_list = [];

        var index = 0;
        var mj_index = 0;
        for( var i = 0; i < baipaiDataList.length; ++i ) {
            var baipai_object = null;
            var baipai_data = baipaiDataList[i];
            if( baipai_data.type == 0 || baipai_data.type == 10) {
                continue;
            }
            if( this.getIsCCG( baipai_data.type ) ) {
                baipai_object = new JLGData();
                var isqc = baipai_data.cardsList.length>3;
                for(var k=0; k<baipai_data.cardsList.length; ++k){
                    this.convertData(baipai_object.idAndCnts, baipai_data.cardsList[k], isqc);
                }
                if(baipai_object.idAndCnts.length<3)
                {
                    var idAndCnt = {};
                    idAndCnt.cnt = 1;
                    var xiaoji = baipai_object.findXJTwoCnt();
                    xiaoji.cnt--;
                    idAndCnt.id = xiaoji.id;
                    baipai_object.idAndCnts.push(idAndCnt);
                    baipai_object.sortArr();
                }
                baipai_object.down_pai_num = baipai_object.getShowPaiList().length;
            } else {
                baipai_object = new BaipaiData();
                baipai_object.down_pai_num = 3; //吃 碰 明杠 暗杠 下层牌数=3
            }
            this.copyObj(baipai_object.cardIds, baipai_data.cardsList );
            baipai_object.index += index;
            baipai_object.mj_index += mj_index;
            baipai_object.type = this.transBaiPaiType( baipai_data.type );
            ++index;
            mj_index += baipai_object.down_pai_num;

            this.baipai_data_list.push( baipai_object );

            if(baipai_data.type == BaipaiType.LZB){
                for(let k = 0; k < baipai_data.cardsList.length; k++){
                    this.zhangBaoList.push(baipai_data.cardsList[k].id);
                }
            }
        }
    },

    translateXiList(xilist){
        let _list = [0,0,0,0,0,0,0];
        xilist.forEach((id)=>{
            if(Math.floor(id/4) == 0){//一饼
                _list[0]++;
            }else if(Math.floor(id/4) == 8){//九饼
                _list[1]++;
            }else if(Math.floor(id/4) == 9){//一条
                _list[2]++;
            }else if(Math.floor(id/4) == 17){//九条
                _list[3]++;
            }else if(Math.floor(id/4) == 18){//一万
                _list[4]++;
            }else if(Math.floor(id/4) == 26){//九万
                _list[5]++;
            }else if(Math.floor(id/4) == 27){//红中
                _list[6]++;
            }
        })
        return _list;
    },

    checkXi(xiList){
        if(this.canliangxi && cc.dd._.isArray(xiList) && xiList.length == 3){
            let RoomMgr = require('jlmj_room_mgr').RoomMgr;
            let isnormalxi = RoomMgr.Instance()._Rule.isnormalxi;

            let isChongfu = RoomMgr.Instance()._Rule.ismultliangxi;

            let _list = this.translateXiList(xiList);

            let temp_baipai = [];
            if(!isChongfu){//亮喜去重，有一万或者一饼、九万或者九饼或者九条就不能再亮包含这些牌的喜
                for(let i = 0; i < this.baipai_data_list.length; i++){
                    let item = this.baipai_data_list[i];
                    if(item.cardIds.length == 3 && item.type != BaipaiType.PENG){
                        let temp = this.translateXiList(item.cardIds);
                        temp_baipai.push(temp);
                    }
                }
            }

            if(!isChongfu && this.checkChongFu2(_list, temp_baipai)){
                return false;
            }

            if(this.checkChongFu2(_list, XI_PAI_TYPE)){
                if(isnormalxi){
                    let result = true;
                    for(let i = 0; i < _list.length; i++){
                        if(_list[i] > 1){
                            result = false;
                            break;
                        }
                    }
                    return result;
                }else{
                    return true;
                }
            }
        }
        return false;
    },

    setLiangxi(xiList){
        if(this.xiList){
            this.xiList.xi_cardList = xiList;
        }
    },

    // checkGangXi(msg){
    //     if(!msg.cangang || !msg.gangcards || !msg.gangcards.gangcardList){
    //         this.canxi = false;
    //         this.cangang = false;
    //         return ;
    //     }
    //
    //     if(msg.canbugang){
    //         this.canxi = false;
    //         this.cangang = true;
    //         return;
    //     }
    //
    //     this.xiList = {};
    //
    //     this.xiList.isnewdealstyle = msg.gangcards.isnewdealstyle || false;
    //     this.xiList.cardList = [];
    //     if(!this.xiList.isnewdealstyle){//当是点杠时才有这个中心牌
    //         this.xiList.centerId =  msg.gangcards.centercard.id;
    //     }
    //
    //     let length = msg.gangcards.gangcardList.length;
    //
    //     let yibing = [];
    //     let yiwan = [];
    //     let jiubing = [];
    //     let jiuwan = [];
    //     let jiutiao = [];
    //
    //     let yitiao = [];
    //     let hongzhong = [];
    //
    //     for(let i = msg.gangcards.gangcardList.length - 1; i >= 0; i--){
    //         let info = msg.gangcards.gangcardList[i];
    //
    //         if(Math.floor(info.id/4) == 0){
    //             length--;
    //             yibing.push(info.id);
    //         }else if(Math.floor(info.id/4) == 8){
    //             length--;
    //             jiubing.push(info.id);
    //         }else if(Math.floor(info.id/4) == 9){
    //             length--;
    //             yitiao.push(info.id);
    //         }else if(Math.floor(info.id/4) == 17){
    //             length--;
    //             jiutiao.push(info.id);
    //         }else if(Math.floor(info.id/4) == 18){
    //             length--;
    //             yiwan.push(info.id);
    //         }else if(Math.floor(info.id/4) == 26){
    //             length--;
    //             jiuwan.push(info.id);
    //         }else if(Math.floor(info.id/4) == 27){
    //             length--;
    //             hongzhong.push(info.id);
    //         }
    //     }
    //
    //     [this.canxi, this.xiList.cardList] = this.checkXi(yibing, jiubing, yitiao, jiutiao, yiwan, jiuwan, hongzhong, msg.canliangxi);
    //
    //     this.cangang = length >= 4 || this.checkGang(yibing.length, jiubing.length, yitiao.length, jiutiao.length, yiwan.length, jiuwan.length, hongzhong.length);
    // },

    /**
     * 检查喜牌
     * @param yibing 一饼
     * @param jiubing 九饼
     * @param yitiao 一条
     * @param jiutiao 九条
     * @param yiwan 一万
     * @param jiuwan 九万
     * @param hongzhong 红中
     * @returns {boolean}
     */
    // checkXi(yibing, jiubing, yitiao, jiutiao, yiwan, jiuwan, hongzhong, canliangxi){
    //     canliangxi = canliangxi || false;
    //     let info = [yibing, jiubing, yitiao, jiutiao, yiwan, jiuwan, hongzhong];
    //     let xiList = [];
    //     let RoomMgr = require('jlmj_room_mgr').RoomMgr;
    //     let isnormalxi = RoomMgr.Instance()._Rule.isnormalxi;
    //
    //     let isChongfu = RoomMgr.Instance()._Rule.ismultliangxi;
    //
    //     // let hasYao = false;
    //     // let hasJiu = false;
    //     // if(!isChongfu){//亮喜去重，有一万或者一饼、九万或者九饼或者九条就不能再亮包含这些牌的喜
    //     //     for(let i = 0; i < this.baipai_data_list.length; i++){
    //     //         let item = this.baipai_data_list[i];
    //     //         if(item.cardIds.length == 3 && item.type != BaipaiType.PENG){
    //     //             item.cardIds.forEach((id)=>{
    //     //                 if(Math.floor(id/4) == 0){//一饼
    //     //                     hasYao = true;
    //     //                 }else if(Math.floor(id/4) == 8){//九饼
    //     //                     hasJiu = true;
    //     //                 }else if(Math.floor(id/4) == 17){//九条
    //     //                     hasJiu = true;
    //     //                 }else if(Math.floor(id/4) == 18){//一万
    //     //                     hasYao = true;
    //     //                 }else if(Math.floor(id/4) == 26){//九万
    //     //                     hasJiu = true;
    //     //                 }
    //     //             })
    //     //         }
    //     //     }
    //     // }
    //
    //     let temp_baipai = [];
    //     if(!isChongfu){//亮喜去重，有一万或者一饼、九万或者九饼或者九条就不能再亮包含这些牌的喜
    //         for(let i = 0; i < this.baipai_data_list.length; i++){
    //             let item = this.baipai_data_list[i];
    //             if(item.cardIds.length == 3 && item.type != BaipaiType.PENG){
    //
    //                 let temp = [0,0,0,0,0,0,0];
    //
    //                 item.cardIds.forEach((id)=>{
    //                     if(Math.floor(id/4) == 0){//一饼
    //                         temp[0]++;
    //                     }else if(Math.floor(id/4) == 8){//九饼
    //                         temp[1]++;
    //                     }else if(Math.floor(id/4) == 9){//一条
    //                         temp[2]++;
    //                     }else if(Math.floor(id/4) == 17){//九条
    //                         temp[3]++;
    //                     }else if(Math.floor(id/4) == 18){//一万
    //                         temp[4]++;
    //                     }else if(Math.floor(id/4) == 26){//九万
    //                         temp[5]++;
    //                     }else if(Math.floor(id/4) == 27){//红中
    //                         temp[6]++;
    //                     }
    //                 })
    //
    //                 temp_baipai.push(temp);
    //             }
    //         }
    //     }
    //
    //     for(let i = 0; i < XI_PAI_TYPE.length; i++){
    //         let _type = XI_PAI_TYPE[i];
    //
    //         // if(!isChongfu && this.checkChongFu(_type, hasYao, hasJiu)){
    //         //     continue;
    //         // }
    //
    //         if(!isChongfu && this.checkChongFu2(_type, temp_baipai)){
    //             continue;
    //         }
    //
    //         let result = [];
    //
    //         let _count = 0;
    //         for(let j = 0; j < _type.length; j++){
    //             if(_type[j] == 1){
    //                 _count++;
    //                 if(info[j].length >= _type[j]){//牌数量达到喜牌要求就+1
    //                     result.push([j, 1]);
    //                 }
    //             }else if(_type[j] > 1){//正常喜牌要排除这部分
    //                 _count++;
    //                 if(info[j].length >= _type[j] && !isnormalxi){
    //                     result.push([j, _type[j]]);
    //                 }
    //             }
    //         }
    //
    //         if(result.length == _count && _count > 0){//达到喜牌要求总数量就是true
    //             let temp = [];
    //             result.forEach((index)=>{
    //                 if(info[index[0]].length >= index[1]){
    //                     for(let k = 0; k < index[1]; k++){
    //                         temp.push(info[index[0]][k]);
    //                     }
    //                 }
    //             })
    //             xiList.push(temp);
    //         }
    //
    //
    //     }
    //
    //
    //     return [xiList.length > 0 && canliangxi, xiList];
    // },

    // checkGang(yibing, jiubing, yitiao, jiutiao, yiwan, jiuwan, hongzhong){
    //     return yibing == 4 || jiubing == 4 || yitiao == 4 || jiutiao == 4 || yiwan == 4 || jiuwan == 4 || hongzhong == 4;
    // },

    /**
     * 设置是否能自动出牌   现在是服务器实现的
     */
    setAutoChuPai:function (msg) {
        if(this.getIsTing() && this.hasMoPai()){
            if(!this.canhu && !this.cangang && !this.canliangzhang){
                this.require_PlayerED.notifyEvent(this.require_PlayerEvent.AUTO_CHU_PAI,[this, this.getMoPai()]);
            }
        }
    },

    /**
     * 清理
     */
    clear: function () {
        if(this._isUserPlayer) {
            this.liangZhangList = [];
        }

        this._super();
    },

    /**
     * 清理，但是不清理等待状态
     */
    clearPai: function () {
        if(this._isUserPlayer) {
            this.liangZhangList = [];
        }

        this._super();
    },

    /**
     * 检查重复喜牌
     * @param xiType
     * @param hasYao
     * @param hasJiu
     * @returns {boolean}
     */
    // checkChongFu(xiType, hasYao, hasJiu){
    //     if(hasYao){
    //         if(xiType[0] > 0 || xiType[4] > 0){
    //             return true;
    //         }
    //     }
    //
    //     if(hasJiu){
    //         if(xiType[1] > 0 || xiType[3] > 0 || xiType[5] > 0){
    //             return true;
    //         }
    //     }
    //     return false;
    // },

    checkChongFu2(xiType, baipai){
        let result = false;
        let _str = xiType.toString();
        for(let i = 0; i < baipai.length; i++){
            if(_str === baipai[i].toString()){
                result = true;
                break;
            }
        }
        return result;
    },

    guo: function () {
        this.canliangxi = false;
        this._super();
    },

    initMJComponet(){
        return require("mjComponentValue").fzmj;
    }
});


module.exports = {
    PlayerEvent:base_mj_player_data.PlayerEvent,
    PlayerED:base_mj_player_data.PlayerED,
    PlayerData:sh_PlayerData,
    PlayerState:base_mj_player_data.PlayerState,
};