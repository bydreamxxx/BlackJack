var Zorder = cc.Enum({
    zhuozi:                             0,          //桌子
    room_num:                           1,          //房号
    jlmj_zhinan:                        2,          //东南西北
    jlmj_player_right_ui:               3,          //玩家牌-右
    jlmj_player_up_ui:                  4,          //玩家牌-上
    jlmj_paiqiang_layeout:              5,          //牌墙
    jlmj_player_left_ui:                6,          //玩家牌-左
    jlmj_player_down_ui:                7,          //玩家牌-下
    jlmj_play_ani_d:                    8,          //打牌特效-下
    jlmj_play_ani_u:                    9,          //打牌特效-上
    jlmj_play_ani_r:                    10,          //打牌特效-右
    jlmj_play_ani_l:                    11,          //打牌特效-左
    jlmj_zhishiqi:                      12,          //指示器
    sys_func:                           13,          //系统功能
    dianchi:                            14,          //电池
    leftInfo:                           15,          //左上角节点-圈数,剩余牌数
    baopai:                             16,          //宝牌
    ani_node:                           17,          //
    btn_invite:                         18,          //邀请
    btn_ready:                          19,          //准备
    jlmj_playerHead_down:               20,          //玩家头像-下
    jlmj_playerHead_right:              21,          //玩家头像-右
    jlmj_playerHead_up:                 22,          //玩家头像-上
    jlmj_playerHead_left:               23,          //玩家头像-左
    jlmj_xiaoji_cnt_down:               24,          //小鸡次数-下
    jlmj_xiaoji_cnt_right:              25,          //小鸡次数-右
    jlmj_xiaoji_cnt_up:                 26,          //小鸡次数-上
    jlmj_xiaoji_cnt_left:               27,          //小鸡次数-左
    tuoguannode:                        28,          //
    shezhiMenuLayer:                    29,          //返回-设置-规则
    jlmj_lockScene_layer:               30,          //锁屏层
});

cc.Class({
    extends: cc.Component,

    properties: {
        scene_nodes: { default:[], type:[cc.Node], tooltip:'场景节点' },
    },

    // use this for initialization
    onLoad: function () {

        //场景层级
        this.scene_nodes.forEach(function (node) {
           if( !cc.dd._.isUndefined(node) && !cc.dd._.isNull(node) ){
                node.zIndex = Zorder[node.name];
           }
        });

        var loadFunc = function () {

            //牌墙
            cc.dd.ResLoader.loadPrefab("gameyj_mj/jilin/py/prefabs/jlmj_paiqiang_layeout",function (prefab) {
                var jlmj_paiqiang_layeout = cc.instantiate(prefab);
                jlmj_paiqiang_layeout.zIndex = Zorder.jlmj_paiqiang_layeout;
                jlmj_paiqiang_layeout.parent = this.node;
                cc.log('吉林麻将游戏场景加载','牌墙');
            }.bind(this));

        }.bind(this);

        // setTimeout(loadFunc,100);
    },


});
