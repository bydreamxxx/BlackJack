var Define = require("Define");
const dd = cc.dd;
if (!dd.Net) dd.Net = require("Net").Net;
const DISPATCH_CD = 20; //分发cd
var DingRobot = require('DingRobot');

const No_Log_Msg = [
    'cm_hearbeat',                      //心跳
    'config_shop_login_notify',         //商城配置
    'config_giftsbag_login_notify',     //礼包配置
    'msg_bank_bill_list_2c',            //转账记录
    'broadcast',                        //公告
    'msg_player_location_ack',          //GPS位置改变
    'msg_hearbeat_num',                 //心跳变动
    'msg_get_match_reward_pool_ret',    //刷新奖池
    'msg_get_match_reward_pool_req',    //奖池请求
    'msg_horse_update',
]

const TalkNet = cc.Class({

    extends: dd.Net,

    statics: {

        Instance: function () {
            if (!this.s_net) {
                this.s_net = new TalkNet();
            }
            return this.s_net;
        },

        Destroy: function () {
            if (this.s_net) {
                this.s_net.close();
                this.s_net = null;
            }
        },
    },

    ctor: function () {
        this.name = "talk_net"; //网络名称
        this.msg_list = []; //消息列表
        this.dispatch_id = null; //消息分发定时器id
        this.enable_dispatch = true; //消息分发开关
        this.set_enable_dispatch_id = null; //设置消息分发开关定时器id,此定时器只有一个

        // setTimeout(this.dispath_net_msg.bind(this), 200);    //部分手机此处不执行
    },

    /**
     * 网络重连
     */
    reconnect: function (url) {
        this.msg_list = []; //清空消息列表
        this.clearDispatchTimeout();
        this.startDispatch();
        this._super(url);
    },

    /**
     * 分发消息
     */
    dispatch_net_msg: function () {
        this.dispatch_id = setTimeout(this.dispatch_net_msg.bind(this), DISPATCH_CD);

        if (this.msg_list.length <= 0 || !this.enable_dispatch) {
            return;
        }
        var net_msg = this.msg_list.shift();
        var id = net_msg.id;
        var data = net_msg.data;
        var handlerFunc = this.getHandlerFunc(id);
        if (handlerFunc != null) {
            var recvfunc = handlerFunc.recvfunc;
            var handler = handlerFunc.handler;
            const msg = this.decode(recvfunc, data);
            if (!cc.dd._.isUndefined(recvfunc.func) && handler) {
                var func = handler[recvfunc.func_name].bind(handler);
                if (func) {
                    func(msg);
                }
                else {
                    cc.error('fun= ', recvfunc.func.name, ' 未实现');
                }
            } else {
                cc.error('id= ', id, ' 回调函数未实现');
            }
        } else {
            cc.error("协议id未注册网络recv回调, id=", id);
        }
    },

    /**
     * 暂停分发
     */
    pauseDispatch: function () {
        this.clearDispatchTimeout();
        this.enable_dispatch = false;
    },

    /**
     * 开始分发
     */
    startDispatch: function () {
        this.enable_dispatch = true;
    },

    /**
     * 设置分发延时,单位秒
     * @param timeout
     */
    dispatchTimeOut: function (timeout) {
        this.pauseDispatch();
        this.set_enable_dispatch_id = setTimeout(function () {
            this.startDispatch();
            this.set_enable_dispatch_id = null;
        }.bind(this), timeout * 1000);
    },

    /**
     * 取消分发延时
     */
    clearDispatchTimeout: function () {
        if (this.set_enable_dispatch_id) {
            clearTimeout(this.set_enable_dispatch_id);
            this.set_enable_dispatch_id = null;
        }
        this.startDispatch();
    },

    getHeartID: function () {
        return cc.netCmd.common.cmd_cm_hearbeat;
    },

    /**
     * 设置handler
     * @param name
     * @param handler
     */
    setHandler: function (name, handler) {
        this.handle_recvfunc_list.forEach(function (recvFunc) {
            if (recvFunc.name == name) {
                recvFunc.handler = handler;
            }
        });
    },

    /**
     * 额外注册
     * @param name
     * @param id
     * @param obj
     */
    addRecvfunc: function (name, id, obj) {
        this.handle_recvfunc_list.forEach(function (recvFunc) {
            if (recvFunc.name == name) {
                var recvfunc = recvFunc.recvFuncs;
                if (cc.dd._.isUndefined(recvfunc[id]) || cc.dd._.isNull(recvfunc[id])) {
                    recvfunc[id] = obj;
                }
            }
        });
    },

    /**
     * 网络接受处理接口
     */
    regRecvFunc: function (flag) {
        this.handle_recvfunc_list = [];
        this.handle_recvfunc_list.push(require('c_msg_login_func'));
        this.handle_recvfunc_list.push(require('c_msg_hall_func'));
        this.handle_recvfunc_list.push(require('c_msg_room_mgr_func'));
        this.handle_recvfunc_list.push(require('c_msg_bisai_func'));
        this.handle_recvfunc_list.push(require('c_msg_doudizhu_func'));
        this.handle_recvfunc_list.push(require('c_msg_common_func'));
        this.handle_recvfunc_list.push(require('c_msg_baoxianxiang_coin_func'));
        this.handle_recvfunc_list.push(require('c_msg_rank_func'));
        this.handle_recvfunc_list.push(require('c_msg_douniu_func'));
        this.handle_recvfunc_list.push(require('c_msg_slot_func'));
        this.handle_recvfunc_list.push(require('c_msg_fkps_func'));
        this.handle_recvfunc_list.push(require('c_msg_activity_collect_func'));
        this.handle_recvfunc_list.push(require('c_msg_match_func'));
        this.handle_recvfunc_list.push(require('c_msg_baoxianxiang_func'));

        this.handle_recvfunc_list.push(require('c_msg_pin3_func'));
        this.handle_recvfunc_list.push(require('c_msg_pk_func'));
        this.handle_recvfunc_list.push(require('c_msg_yq_pin3_func'));
        this.handle_recvfunc_list.push(require('c_msg_fqzs_func'));
        this.handle_recvfunc_list.push(require('c_msg_fish_func'));
        this.handle_recvfunc_list.push(require('c_msg_qka_fish_master_func'));
        this.handle_recvfunc_list.push(require('c_msg_game_rule_func'));
        this.handle_recvfunc_list.push(require('c_msg_paodekuai_func'));
        this.handle_recvfunc_list.push(require('c_msg_xiyou_func'));
        this.handle_recvfunc_list.push(require('c_msg_turn_func'));
        this.handle_recvfunc_list.push(require('c_msg_horse_func'));
        this.handle_recvfunc_list.push(require('c_msg_texas_func'))
    },

    getHandlerFunc: function (id) {
        var result = null;
        this.handle_recvfunc_list.forEach(function (handle_recvfunc) {
            if (handle_recvfunc) {
                var recvfunc = handle_recvfunc.recvFuncs;
                if (!cc.dd._.isUndefined(recvfunc[id]) && !cc.dd._.isNull(recvfunc[id])) {
                    result = {};
                    result.recvfunc = recvfunc[id];
                    result.handler = handle_recvfunc.handler;
                    result.name = handle_recvfunc.name;
                }
            } else {
                cc.log('==========erro=========');
            }

        });
        return result;
    },

    recvData: function (id, data) {
        if (id == this.getHeartID()) {
            var handlerFunc = this.getHandlerFunc(id);
            if (handlerFunc != null) {
                var recvfunc = handlerFunc.recvfunc;
                const msg = this.decode(recvfunc, data);
                this.heartCheck.recvHP(msg);
            }
            return;
        }
        this.msg_list.push({ id: id, data: data });
        if (!this.dispatch_id) {
            this.dispatch_net_msg();
        }
    },

    convertDataToObj: function (id, data) {
        var handlerFunc = this.getHandlerFunc(id);
        if (handlerFunc != null) {
            var recvfunc = handlerFunc.recvfunc;
            return this.decode(recvfunc, data);
        } else {
            cc.error("协议id未注册网络recv回调, id=", id);
            return null;
        }
    },

    excuteReplayMsg: function (id, msg) {
        var handlerFunc = this.getHandlerFunc(id);
        if (handlerFunc != null) {
            var recvfunc = handlerFunc.recvfunc;
            var handler = handlerFunc.handler;
            if (!cc.dd._.isUndefined(recvfunc.func)) {
                var func = handler[recvfunc.func_name].bind(handler);
                if (func) {
                    cc.log("解析回放数据:", recvfunc.logtag);
                    cc.log(msg);
                    func(msg);
                }
                else {
                    cc.error('fun= ', recvfunc.func.name, ' 未实现');
                }
            } else {
                cc.error('id= ', id, ' 回调函数未实现');
            }
        } else {
            cc.error("协议id未注册网络recv回调, id=", id);
            return null;
        }
    },

    /**
     * 消息编码
     * @param id
     * @param msg
     */
    encode: function (id, msg) {
        let handler_func = this.getHandlerFunc(id);
        if (!handler_func) {
            return null;
        }

        let proto_msg = cc.proto[handler_func.recvfunc.package_name].lookupType(handler_func.recvfunc.msg_name);
        msg = proto_msg.create(msg);
        return proto_msg.encode(msg).finish();
    },

    /**
     * 消息解码
     * @param recvfunc
     * @param data
     * @returns {Message.<{}>|Message<{}>}
     */
    decode: function (recvfunc, data) {
        var proto_msg = cc.proto[recvfunc.package_name].lookupType(recvfunc.msg_name);
        var msg = proto_msg.decode(data);

        if (No_Log_Msg.indexOf(recvfunc.msg_name) == -1) {
            cc.log("【TalkNet 网络-接收】" + recvfunc.logtag);
            dd.dumper(msg);
            DingRobot.push_log("【网络-接收】" + recvfunc.logtag + '\n' + dd.obj2string(msg));
        }
        return msg;
    },

});

module.exports = TalkNet;
