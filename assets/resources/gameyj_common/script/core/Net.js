/**
 * Created by kory on 16/9/22.
 */
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var DingRobot = require('DingRobot');
var Platform = require('Platform');
var AppCfg = require('AppConfig');
var AES = require('aes');
var allowGameShield = false;
cc.allowGameShield = allowGameShield;
const maxHwRetry = 3;
/**
 * 事件类型
 */
var NetEvent = cc.Enum({
    OPENING: 'net_opening',                       //正在连接
    OPEN: 'net_open',                          //连接成功
    REOPEN: 'net_reopen',                        //重连成功
    OPEN_TIMEOUT: 'net_open_timeout',                  //连接超时

    HEART_TIMEOUT: 'net_heart_timeout',                 //心跳超时
    CLOSE: 'net_close',                         //连接断开
    ERROR: 'net_error',                         //网络出错

    INTERNET_DISCONNECT: 'net_internet_disconnect',           //互联网未连接

    KICK_BY_SERVER: 'net_kick_by_server',                 //服务器踢了
});

var LocalUrlType = {
    NORMAL_URL: 'last_normal_url',
    VIP_URL: 'last_vip_url',
};

/**
 * 事件管理
 */
var ED = require("EventDispatcher");
var NetED = new ED;

var user = require("com_user_data");
var SparkMD5 = require('spark-md5');
var SECRET_KEY = new Uint8Array([0x93, 0x46, 0x78, 0x20]); //MD5签名密钥
var dd = cc.dd;

/**
 * 配置
 */
var OPEN_TIMEOUT_TIME = 20 * 1000;
var HEART_TIME = 5 * 1000;                          //心跳间隔
var HEART_TIMEOUT_TIME = 25 * 1000;                 //心跳超时
var OPEN_LIST_TIMEOUT_TIME = 5 * 1000;              //网关列表连接 单个网关超时

const MAX_SEQ = 100000;
const CHECK_TIMES = 4;  //样本次数
const COMP_TIMES = 2;   //达标次数
var SEQ_LIST = [];
var CUR_SEQ = 0;
/**
 * 心跳
 */

var HeartCheck = cc.Class({

    ctor: function (...params) {
        this.net = params[0];
        this.heartTime = HEART_TIME;
        this.heartId = null;
        this.timeout = HEART_TIMEOUT_TIME;
        this.timeoutId = null;
        this.heartMsg = null;
    },

    getHeartMsg: function () {
        if (this.heartMsg == null) {
            this.heartMsg = new cc.pb.common.cm_hearbeat();
        }
        if (CUR_SEQ > MAX_SEQ) {
            CUR_SEQ = 0;
            this.not1st = true;
        }
        this.heartMsg.setSeqId(CUR_SEQ);
        return this.heartMsg;
    },

    recvHP: function (msg) {
        if (this.checkSeq(msg.seqId)) {
            SEQ_LIST[msg.seqId] = true;
        }
        this.resetTimeout();
    },

    start: function () {
        if (!this.net.isHeartEnable()) {
            return;
        }
        var self = this;
        this.heartId = setInterval(function () {
            this.sendHeartPac();
        }.bind(this), this.heartTime);
        this.resetTimeout();
    },

    resetTimeout: function () {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(function () {
            this.net.onHeartTimeout();
        }.bind(this), this.timeout);
    },

    stop: function () {
        clearInterval(this.heartId);
        clearTimeout(this.timeoutId);
        this.not1st = false;
        CUR_SEQ = 0;
        if (cc.dd.user.id) {
            var msg = { userId: cc.dd.user.id, isWeak: true };
            RoomED.notifyEvent(RoomEvent.player_signal_state, [msg]);
        }
    },

    checkSeq: function (seq) {
        return seq == (CUR_SEQ - 1);
    },

    //发送心跳包  检测信号不良
    sendHeartPac: function () {
        this.checkSignal();
        this.net.sendMsg(this.net.getHeartID(), this.getHeartMsg(), "cm_hearbeat", true);
        //cc.log('心跳发送:' + CUR_SEQ);
        SEQ_LIST[CUR_SEQ++] = null;
    },

    //检查信号
    checkSignal() {
        var cur = CUR_SEQ;
        var signal_weak = false;
        if (cur < CHECK_TIMES && !this.not1st) {//总共发送数量 < 样本数
            var count = 0;
            for (var i = 0; i < cur; i++) {
                if (SEQ_LIST[i]) {
                    ++count;
                }
            }
            if (count / cur < 0.5) {//信号不良
                signal_weak = true;
            }
        }
        else {
            var cnt = 0;
            for (var i = 0; i < CHECK_TIMES; i++) {
                var idx = cur - i - 1;
                idx = idx > -1 ? idx : (idx + MAX_SEQ + 1);
                if (SEQ_LIST[idx]) {
                    ++cnt;
                }
            }
            if (cnt < COMP_TIMES) {//信号不良
                signal_weak = true;
            }
        }
        //cc.log(signal_weak ? '信号不良' : '信号正常');
        if (cc.dd.user.id) {
            var msg = { userId: cc.dd.user.id, isWeak: signal_weak };
            RoomED.notifyEvent(RoomEvent.player_signal_state, [msg]);
        }
    },
});

var Net = cc.Class({

    ctor: function () {
        this.game_type = cc.dd.Define.MahjongMode.FRIEND;
        this.gameSocket = null;
        this.s_net = null;
        this.url = null;
        this.name = "";
        this.checkTimeOutId = 0;
        this.heartCheck = null;
        this.isOpenTimeOut = false;
        this.isHeartTimeOut = false;
        this.connect_cnt = 0;
        this.hwCnt = 0;
        this.header = null;
        this.kicked = false;

        this.recvFuncs = {};
        this.regRecvFunc();
        this.heartCheck = new HeartCheck(this);
    },

    /**
     * 设置游戏类型
     * @param type
     */
    setGameType: function (type) {
        this.game_type = type;
    },

    /**
     *   获取心跳协议ID
     */

    getHeartID: function () {
        return 0;
    },

    /**
     *   是否启动心跳
     */

    isHeartEnable: function () {
        return true;
    },

    /**
    * 网络接受处理接口
    */
    regRecvFunc: function () {

    },

    /**
     * 网络连接
     * @param url
     * @param onconnect
     */
    connect: function (url) {
        this.close();
        this.url = url;
        //cc.log(this.name + ":" + "正在连接" + url);
        if (this.checkInternet()) {
            this.isVipUrl = false;
            this.createConnet(this.url, this.onOpen.bind(this), this.onmessage.bind(this),
                this.onerror.bind(this), this.onclose.bind(this));
        }
    },

    /**
     * 连接隐藏网关
     * @param {*} url 
     */
    connectVip(wsurl, isvip) {
        cc.log('开始连接vip网关');
        if (!wsurl) {
            wsurl = this.getLocalConnectedUrl(true);
            if (wsurl) {
                isvip = true;
            }
        }
        var url = wsurl;
        if (!url) {//本地没有记录
            this.connectLocal();
            return;
        }
        this.close();
        this.url = url;
        //cc.log(this.name + ":" + "正在连接" + url);
        if (this.checkInternet()) {
            this.isVipUrl = isvip || false;
            this.createConnet(this.url, this.onOpen.bind(this), this.onmessage.bind(this),
                this.onviperror.bind(this), this.onclose.bind(this));
        }
    },
    onviperror(event) {
        if (this.gameSocket) {
            clearTimeout(this.checkListTimeOutId);
            if (this.isOpenTimeOut || this.isHeartTimeOut) {
                return;
            }
            cc.log("连接vip网关出错,开始切换网关...");
            this.close();
            this.connectLocal();
        }
    },
    /**
     * 连接本地普通网关
     */
    connectLocal() {
        cc.log('开始连接本地普通网关');
        var url = this.getLocalConnectedUrl(false);
        if (!url) {
            this.getWGList();
            return;
        }
        this.close();
        this.url = url;
        //cc.log(this.name + ":" + "正在连接本地记录网关" + url);
        if (this.checkInternet()) {
            this.isVipUrl = false;
            this.createConnet(this.url, this.onOpen.bind(this), this.onmessage.bind(this),
                this.onlocalerror.bind(this), this.onclose.bind(this));
        }
    },
    onlocalerror(event) {
        if (this.gameSocket) {
            clearTimeout(this.checkListTimeOutId);
            if (this.isOpenTimeOut || this.isHeartTimeOut) {
                return;
            }
            //cc.log(this.gameSocket.url + "连接本地记录网关出错,开始切换网关...");
            this.close();
            this.getWGList();
        }
    },

    /** 
     * 从CDN获取网关列表
    */
    getWGList() {
        if (this.checkInternet()) {
            cc.log('开始获取网关列表');
            var timeout = 10000;//ms
            var CDNUrl = Platform.serFileUrl[AppCfg.PID];
            cc.dd.NetWaitUtil.show('获取服务器列表...');
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.timeout = timeout;
            xhr.ontimeout = function () {
                if (xhr.readyState == 4) {
                    return;
                }
                xhr.abort(); //重置 
                // //重新请求
                // xhr.open("GET", CDNUrl, true);
                // xhr.send();
                this.onGetWGList(null);
            }.bind(this);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    cc.dd.NetWaitUtil.close();
                    if (xhr.status === 200 || xhr.status === 304) {
                        this.onGetWGList(xhr.response);
                    } else {
                        cc.error('获取服务器列表失败  err status:' + xhr.status);
                        this.onGetWGList(null);
                    }
                }
                else {

                }
            }.bind(this);
            xhr.open("GET", CDNUrl, true);
            xhr.send();
            this.clearWGTimer();
            this.getWGTimer = setTimeout(function () {
                xhr.abort(); //重置 
                this.onGetWGList(null);
            }.bind(this), timeout);
        }
    },

    clearWGTimer() {
        if (this.getWGTimer) {
            clearTimeout(this.getWGTimer);
            this.getWGTimer = null;
        }
    },

    onGetWGList(response) {
        this.clearWGTimer();
        var list = [
            'ws://39.106.22.191:3801',
            'ws://47.94.135.182:3801',
            //'ws://39.106.112.209:3801',
            //'ws://39.105.0.171:3801',
            //'ws://47.93.37.139:3801',
            //'ws://39.96.76.38:3801',
            //'ws://47.94.240.174:3801',
            //'ws://39.96.16.112:3801',
            //'ws://39.107.224.87:3801',
            //'ws://47.94.17.109:3801',
        ];
        if (response) {
            list = this.decodeWGList(response);
        }
        cc.dd.NetWaitUtil.show('正在连接...');
        this.connectWGList(list);
    },

    decodeWGList(str) {
        var jsonStr = AES.Decrypt(str);
        var obj = JSON.parse(jsonStr);
        for (var i = 0; i < obj.length; i++) {
            obj[i] = 'ws://' + obj[i];
        }
        return obj;
    },

    /**
     * 连接网关列表
     */
    connectWGList: function (list) {
        this.wgList = list || this.wgList;
        if (this.wgList && this.wgList.length) {
            var random = Math.floor(Math.random() * this.wgList.length);
            this.url = this.wgList[random];
            this.close();
            //cc.log(this.name + ":" + "正在连接" + this.url);
            if (this.checkInternet()) {
                this.isVipUrl = false;
                this.createQuickConnect(this.url, this.onOpen.bind(this), this.onmessage.bind(this),
                    this.onlisterror.bind(this), this.onclose.bind(this));
                this.wgList.splice(random, 1);
            }
        }
        else {
            cc.dd.DialogBoxUtil.show(1, cc.dd.strConfig.net_open_time_out, cc.dd.strConfig.net_retry, null,
                function () {
                    this.connectVip();
                }.bind(this), null);
            cc.log('网关列表错误 wglist:' + this.wgList);
        }
    },

    /**
     * 创建快速连接 用于网关列表遍历
     * @param {*} url 
     * @param {*} opencall 
     * @param {*} messagecall 
     * @param {*} errorcall 
     * @param {*} closecall 
     */
    createQuickConnect(url, opencall, messagecall, errorcall, closecall) {
        if (url) {
            this._originurl = url;
            if (this.hwCnt > maxHwRetry)
                allowGameShield = false;
            if (cc.sys.isNative && allowGameShield && cc.pid == 3) {
                this.hwCnt += 1;
                url = this.getSecuryUrl('login', url);
            }
            NetED.notifyEvent(NetEvent.OPENING, [this.name, this.game_type]);
            this.connect_cnt += 1;
            //cc.log(this.name, '开始连接网络_', this.connect_cnt, '    ' + url);
            this.isOpenTimeOut = false;
            this.isHeartTimeOut = false;
            this.gameSocket = new WebSocket(url);
            this.gameSocket.onopen = opencall;
            this.gameSocket.onmessage = messagecall;
            this.gameSocket.onerror = errorcall;
            this.gameSocket.onclose = closecall;
            this.checkListTimeOut();
        } else {
            cc.error("无网络连接信息");
        }
    },
    onlisterror(event) {
        if (this.gameSocket) {
            clearTimeout(this.checkListTimeOutId);
            if (this.isOpenTimeOut || this.isHeartTimeOut) {
                return;
            }
            //cc.log(this.gameSocket.url + "  网络出错,开始切换网关...");
            this.close();
            this.connectWGList();
        }
    },
    checkListTimeOut: function () {
        this.checkListTimeOutId = setTimeout(function () {
            if (this.isConnected()) {
                return;
            }
            this.onOpenListTimeOut();
        }.bind(this), OPEN_LIST_TIMEOUT_TIME);
    },
    onOpenListTimeOut: function () {
        if (this.gameSocket) {
            this.isOpenTimeOut = true;
            //cc.log(this.gameSocket.url + ":" + "连接超时");
            this.connectWGList();
        }
    },

    //获取游戏盾地址
    getSecuryUrl(group, url) {
        var prefix = 'ws://';
        var ipport = url.replace(prefix, '');
        var list = ipport.split(':');
        var ip = list[0];
        var port = parseInt(list[1]);
        var hwurl = cc.dd.native_systool.getHWUrl(group, port, ip);
        return prefix + hwurl;
    },

    /**
     * 网络重连
     */
    reconnect: function (url) {
        this.close();
        if (!cc.dd._.isUndefined(url) && !cc.dd._.isNull(url)) {
            this.url = url;
        }
        if (cc.pid == 3)
            this.getWGList();
        else
            if (this.checkInternet()) {
                this.createConnet(this.url, this.onReOpen.bind(this), this.onmessage.bind(this),
                    this.onerror.bind(this), this.onclose.bind(this));
            }
        // cc.log(this.name + ":" + "正在重连连接" + this.url);
        // if (this.checkInternet()) {
        //     this.createConnet(this.url, this.onReOpen.bind(this), this.onmessage.bind(this),
        //         this.onerror.bind(this), this.onclose.bind(this));
        // }
    },

    /**
     * 创建连接
     */
    createConnet: function (url, opencall, messagecall, errorcall, closecall) {
        this.kicked = false;
        if (url) {
            this._originurl = url;
            if (this.hwCnt > maxHwRetry)
                allowGameShield = false;
            if (cc.sys.isNative && allowGameShield && cc.pid == 3) {
                this.hwCnt += 1;
                url = this.getSecuryUrl('login', url);
            }
            NetED.notifyEvent(NetEvent.OPENING, [this.name, this.game_type]);
            this.connect_cnt += 1;
            cc.log(this.name, '开始连接网络_', this.connect_cnt);
            this.isOpenTimeOut = false;
            this.isHeartTimeOut = false;
            this.gameSocket = new WebSocket(url);
            this.gameSocket.onopen = opencall;
            this.gameSocket.onmessage = messagecall;
            this.gameSocket.onerror = errorcall;
            this.gameSocket.onclose = closecall;
            this.checkOpenTimeOut();
        } else {
            cc.error("无网络连接信息");
        }
    },

    /**
     * 检测连接超时
     */
    checkOpenTimeOut: function () {
        this.checkTimeOutId = setTimeout(function () {
            if (this.isConnected()) {
                return;
            }
            this.onOpenTimeOut();
        }.bind(this), OPEN_TIMEOUT_TIME);
    },

    /**
     * 网络连接成功
     * @param event
     */
    onOpen: function (event) {
        if (this.gameSocket) {
            clearTimeout(this.checkTimeOutId);
            this.heartCheck.start();
            cc.log(this.name + ":" + "连接成功");
            this.hwCnt = 0;
            cc._hwRetryCnt = 0;
            this.saveLocalConnectedUrl(this._originurl, this.isVipUrl);
            NetED.notifyEvent(NetEvent.OPEN, [this.name, this.game_type]);
        }
    },

    /**
     * 重连连接成功
     * @param event
     */
    onReOpen: function (event) {
        if (this.gameSocket) {
            clearTimeout(this.checkTimeOutId);
            this.heartCheck.start();
            cc.log(this.name + ":" + "重连成功");
            NetED.notifyEvent(NetEvent.REOPEN, [this.name, this.game_type]);
        }
    },

    /**
     * 连接超时
     */
    onOpenTimeOut: function () {
        if (this.gameSocket) {
            this.isOpenTimeOut = true;
            cc.log(this.name + ":" + "连接超时");
            this.close();
            if (!cc.dd.native_systool.isNetAvailable()) {
                return;
            }
            NetED.notifyEvent(NetEvent.OPEN_TIMEOUT, [this.name, this.game_type]);
        }
    },

    /**
     * 心跳超时
     */
    onHeartTimeout: function () {
        if (this.gameSocket) {
            this.isHeartTimeOut = true;
            cc.log(this.name + ":" + "心跳超时");
            if (!cc.dd.native_systool.isNetAvailable()) {
                return;
            }
            NetED.notifyEvent(NetEvent.HEART_TIMEOUT, [this.name, this.game_type]);
            //this.close();
        }
    },

    /**
     * 网络出错
     * @param event
     */
    onerror: function (event) {
        if (this.gameSocket) {
            clearTimeout(this.checkTimeOutId);
            cc.log(this.name + ":" + "网络出错");
            if (this.isOpenTimeOut || this.isHeartTimeOut) {
                return;
            }
            if (!cc.dd.native_systool.isNetAvailable()) {
                return;
            }
            NetED.notifyEvent(NetEvent.ERROR, [this.name, this.game_type]);
        }
    },

    /**
     * 网络关闭
     * @param event
     */
    onclose: function (event) {
        if (this.gameSocket) {
            clearTimeout(this.checkTimeOutId);
            this.heartCheck.stop();
            cc.log(this.name + ":" + "连接已断开");
            if (this.isOpenTimeOut || this.isHeartTimeOut || this.kicked) {
                return;
            }
            if (!cc.dd.native_systool.isNetAvailable()) {
                return;
            }
            NetED.notifyEvent(NetEvent.CLOSE, [this.name, this.game_type]);
        }
    },

    /**
     * 关闭网络
     */
    close: function () {
        if (this.gameSocket != null) {
            cc.log(this.name + ":" + "断开连接");
            this.gameSocket.onopen = null;
            this.gameSocket.onmessage = null;
            this.gameSocket.onerror = null;
            this.gameSocket.onclose = null;
            if (this.getSocketState() != WebSocket.CLOSED) {
                this.gameSocket.close();
            }
        }
        this.gameSocket = null;
        clearTimeout(this.checkTimeOutId);//关闭检测连接超时
        this.heartCheck.stop();
    },

    onKick: function (code) {
        this.kicked = true;
        this.close();
        NetED.notifyEvent(NetEvent.KICK_BY_SERVER, [this.name, code, this.game_type]);
    },

    getHeader: function () {
        if (this.header == null) {
            this.header = new cc.pb.common.ProtoHeader();
        }
        return this.header;
    },

    /**
     * 发送消息
     * @param id
     * @param msg
     * @param log_tag 日志标识
     */
    sendMsg: function (id, msg, log_tag, noHead) {
        if (!this.checkInternet()) {
            return;
        }
        if (noHead == null || !noHead) {
            var header = this.getHeader();
            header.setUserid(user.Instance().id);
            msg.setHeader(header);
        }
        msg = msg.getContent();
        this.send(id, msg);
        if (id != this.getHeartID()) {
            cc.log("【网络-发送】" + log_tag + ' id=' + id);
            // dd.dumper(msg.toObject());
            dd.dumper(msg);
            // DingRobot.push_log("【网络-发送】" + log_tag + '\n' + dd.obj2string(msg.toObject()));
            DingRobot.push_log("【网络-发送】" + log_tag + '\n' + dd.obj2string(msg));
        }
    },

    /**
     * 发送消息
     * @param id
     * @param msg
     */
    send: function (id, msg) {
        if (!this.isConnected()) {
            cc.error("网络未连接", id);
            if (this.gameSocket != null) {
                NetED.notifyEvent(NetEvent.ERROR, [this.name, this.game_type]);
            }
            return;
        }

        var msgBuf = this.encode(id, msg);
        if (!msgBuf) {
            cc.error("消息编码错误 id=", id);
            return;
        }

        var buf = new ArrayBuffer(2 + msgBuf.length + 4);
        var bytes = new Uint8Array(buf)

        //填充header
        var dataLen = buf.byteLength;
        var msgId = id;
        bytes[0] = (msgId & 0xff00) >> 8;
        bytes[1] = (msgId & 0x00ff);

        //添上MD5_Key
        for (var i = 0; i < SECRET_KEY.byteLength; i++) {
            bytes[2 + i] = SECRET_KEY[i];
        }

        //填充proto message
        for (var i = 0; i < msgBuf.length; i++) {
            bytes[2 + SECRET_KEY.byteLength + i] = msgBuf[i];
        }

        //计算MD5签名
        var sign = SparkMD5.ArrayBuffer.hash(buf); //SparkMD5.hashBinary(string);

        var md5 = [];
        for (var x = 0; x < sign.length - 1; x += 2) {
            md5.push(parseInt(sign.substr(x, 2), 16));
        }

        bytes[2 + 0] = md5[4];
        bytes[2 + 1] = md5[6];
        bytes[2 + 2] = md5[8];
        bytes[2 + 3] = md5[10];

        this.gameSocket.send(bytes);
    },

    /**
     * 接受消息
     * @param event
     */
    onmessage: function (event) {
        if (cc.sys.isNative) {
            this.onReceiveData(event.data);
        } else {
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function (progressEvent) {
                var arrayBuffer = this.result;
                self.onReceiveData(arrayBuffer);
            };
            fileReader.readAsArrayBuffer(event.data);
        }
    },

    /**
     * 接受消息
     * @param data
     */
    onReceiveData: function (data) {
        var bytes = new Uint8Array(data);
        var msgId = 0;
        msgId = (bytes[0] << 8) + bytes[1];
        // cc.error(`onReceiveData msgId ${msgId} ${bytes[0]} ${bytes[1]}`);
        // if(msgId == 2609){
        //     this.tempbytes = {bytes: Array.from(bytes), id: msgId};
        //     this.tempbytes.bytes.splice(0, 2);
        //     cc.error(`msgId length ${this.tempbytes.bytes.length}`);
        //     return;
        // }
        // if(this.tempbytes){
        //     if(msgId > 10000){
        //         let list = Array.from(bytes);
        //         this.tempbytes.bytes = this.tempbytes.bytes.concat(list);
        //         cc.error(`msgId length ${list.length}`);
        //         return;
        //     }
        //
        //     this.recvData(this.tempbytes.id, new Uint8Array(this.tempbytes.bytes));
        //     this.tempbytes = null;
        // }
        var body = new Uint8Array(data, 2, data.byteLength - 2);
        this.recvData(msgId, body);
    },

    /**
     * 二进制消息转成json对象
     * @param recv_parser
     * @returns {*}
     */
    binary2Object: function (recv_parser) {
        // var msg = recv_parser.deserializer.deserializeBinary(recv_parser.data).toObject();

        // cmd_wx_login_by_code_req :2900,
        // cmd_wx_login_by_refresh_token_req :2901,
        // cmd_common_login_ack :2902,
        // cmd_common_token_ack :2903,
        // cmd_common_refresh_notify :2904,
        // cmd_common_refresh_req :2905,
        let proto_list = [];
        proto_list[2902] = cc.proto.login.lookupType("common_login_ack");
        proto_list[2903] = cc.proto.login.lookupType("common_token_ack");
        var msg = proto_list[recv_parser.id].decode(recv_parser.data);

        cc.log("【网络-接收】" + recv_parser.log_tag);
        dd.dumper(msg);
        DingRobot.push_log("【网络-接收】" + recv_parser.log_tag + '\n' + dd.obj2string(msg));
        return msg;
    },

    /**
     * 接受数据
     * @param id
     * @param data
     */
    recvData: function (id, data) {
        var func = this.recvFuncs[id];
        if (func) {
            func = func.bind(this);
            func(data);
        } else {
            cc.error("协议id[%d]未注册网络recv回调", id);
        }
    },

    /**
     * 是否网络连接
     * @returns {boolean}
     */
    isConnected: function () {
        return (this.getSocketState() === WebSocket.OPEN);
    },

    /**
     * 获取网络状态
     * @returns {number}
     */
    getSocketState: function () {
        var state = WebSocket.CLOSED;
        try {
            if (this.gameSocket != null) {
                state = this.gameSocket.readyState;
                if (state != WebSocket.OPEN) {
                    cc.log('网络问题state=', state);
                }
            }
        } catch (e) {
            cc.error("[%s] getSocketState exception:%s", this.gameSocket.url, e);
        }
        return state;
    },

    /**
     * 互联网是否可用
     */
    isInternetAvailable: function () {
        if (cc.sys.isNative && cc.sys.isMobile) { //真机
            return cc.dd.native_systool.isNetAvailable();
        } else {  //模拟器,浏览器
            return true;
        }
    },

    /**
     * 检测互联网连接
     */
    checkInternet: function () {
        if (!this.isInternetAvailable()) {
            cc.log(this.name + ":" + "互联网未连接");
            NetED.notifyEvent(NetEvent.INTERNET_DISCONNECT, [this.name, this.game_type]);
            return false;
        } else {
            return true;
        }
    },

    /**
     * 保存成功连接到本地
     */
    saveLocalConnectedUrl: function (url, isVip) {
        if (AppCfg.PID != 3) {
            return;
        }
        if (isVip) {
            cc.sys.localStorage.setItem(LocalUrlType.VIP_URL, JSON.stringify(url));
        }
        else {
            cc.sys.localStorage.setItem(LocalUrlType.NORMAL_URL, JSON.stringify(url));
        }
    },
    getLocalConnectedUrl: function (isvip) {
        var url = null;
        if (isvip) {
            var json = cc.sys.localStorage.getItem(LocalUrlType.VIP_URL);
            if (json) {
                url = JSON.parse(json);
            }
        }
        else {
            var json = cc.sys.localStorage.getItem(LocalUrlType.NORMAL_URL);
            if (json) {
                url = JSON.parse(json);
            }
        }
        return url;
    },
});

module.exports = {
    Net: Net,
    NetED: NetED,
    NetEvent: NetEvent,
};
