/**
 * Created by shen on 2017/8/19.
 * ui层接受数据层发出事件基类
 */


var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var HallCommonData = HallCommonObj.HallCommonData;
var FortuneHallManager = require('FortuneHallManager').Instance();
var FORTUNEHALLED = FortuneHallManager.FORTUNEHALLED;
var FORTUNEHALLEvent = FortuneHallManager.FORTUNEHALLEvent;
var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;

cc.Class({
    extends: cc.Component,

    properties: {


    },

    // use this for initialization
    onLoad: function () {
        WxED.addObserver(this);
        HallCommonEd.addObserver(this);
        FORTUNEHALLED.addObserver(this);
        shopEd.addObserver(this);
    },

    onDestroy:function () {
        WxED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        FORTUNEHALLED.removeObserver(this);
        shopEd.removeObserver(this);
    },


    /**
     * 初始化大厅数据
     * @param data
     * @private
     */
    _commonInit:function (data) {
        this.initHead(data.openId, data.headUrl);
        this.commonInit(data);
    },

    /**
     * 获取个人数据单列
     * @returns {*}
     */
    getCommonData:function () {
        return HallCommonData.getInstance();
    },

    /**
     * 获取道具数据单列
     * @returns {*}
     */
    getPropData:function () {
    },

    /**************************************
     * begin:子类可以重写的函数
     **************************************/
    /**
     * ui主动请求刷新
     */
    freshCommonView:function () {
        HallCommonData.getInstance().freshView();
    },

    /**
     * ui主动请求刷新
     */
    freshPropView:function () {
    },

    /**
     * 初始化大厅数据,可重写
     * @param data
     */
    commonInit:function (data) {

    },

    /**
     * 初始化道具数据,可重写
     */
    propInit:function () {

    },

    /**
     * 账号设置修改成功
     * @param data
     */
    accountUpdate:function (data) {
        cc.log('HallOnEvent::账号设置修改成功!');
    },

    /**
     * 实名认证成功
     * @param data
     */
    realNameAuthen:function (data) {
        cc.log('HallOnEvent::实名认证成功!');
    },

    /**
     * 手机绑定成功
     * @param data
     */
    bindTelNum:function (data) {
        cc.log('HallOnEvent::手机绑定成功!');
    },

    /**
     * 手机解绑成功
     * @param data
     */
    unbindTel:function (data) {
        cc.log('HallOnEvent::手机解绑成功!');
    },

    /**
     * 获取任务列表
     * @param data
     */
    taskInfo:function (data) {

    },

    /**
     * 获取抽奖结果
     * @param id
     */
    getLuckId:function (id) {

    },

    /**
     * 微信分享成功
     */
    sharedSuccess:function (data) {

    },

    /**
     * 商品购买成功
     */
    onShopSuccess:function () {

    },

    /**
     * 更新道具
     */
    propUpdate:function () {

    },

    /**
     * 更新任务
     * @param data
     */
    taskUpdate:function (data) {

    },

    /**
     * 已领取奖励
     */
    receiveReward:function () {
    },

    /**
     * 获奖名单
     * @param data
     */
    updateWinners:function (data) {

    },

    /**
     * 红包兑换结果
     * @param data
     */
    changeResult:function (data) {

    },

    /**
     * 跑马灯
     * @param data
     */
    onMarquee:function (data) {

    },
    /**
     * 跑马灯默认信息
     */
    onDefaultMarquee:function(data){

    },

    /**
     * 更新昵称
     * @param data
     */
    updateNick:function (data) {

    },

    /**
     * 更新性别
     * @param data
     */
    updateSex:function (data) {

    },
    /**
     * 下载头像
     * @param openid
     * @param headurl
     * @private
     */
    initHead:function (headsp, openid, headurl) {
        cc.dd.SysTools.loadWxheadH5(headsp, headurl);
    },
    /**
     * 获取微信头像精灵帧
     */
    _getWxHeadFrame: function(openId){
        var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + openId;
        var texture = cc.textureCache.addImage( headFilePath );
        if ( texture ) {
            return new cc.SpriteFrame(texture);
        }else{
            cc.error("无微信头像文件,openid:"+openId);
        }
    },
    /**
     * 设置头像
     */
    onSetHeadSp:function (sp, openid) {

    },

    /**
     * 设置金币 房卡
     */
    onSetMoneyAndCards:function (money, roomcards) {

    },

    updateVip: function () {

    },

    updatePlayer: function () {

    },

    updateChargeFlag: function () {

    },

    updateFirstBuy: function (){

    },

    /**
     * 更新红点显示
     */
    updateFalg: function(){

    },

    /***************************************
     * end:子类可以重写的函数
     **************************************/

    onEventMessage:function (event,data) {
        switch (event){
            case WxEvent.DOWNLOAD_HEAD:
                cc.log('玩家头像下载完毕!!');
                this.onSetHeadSp(this._getWxHeadFrame(data[0]), data[0]);
                break;
            case WxEvent.SHARE:
                this.sharedSuccess(data);
                break;
            case HallCommonEvent.INIT:
                this._commonInit(data);
                break;
            case HallCommonEvent.ACCOUNT_UPDATE:
                this.accountUpdate(data);
                break;
            case HallCommonEvent.REAL_NAME_AUTHEN:
                this.realNameAuthen(data);
                break;
            case HallCommonEvent.TEL_BIND:
                this.bindTelNum(data);
                break;
            case HallCommonEvent.TEL_UNBIND:
                this.unbindTel(data);
                break;
            case HallCommonEvent.TASK_INFO:
                this.taskInfo(data);
                break;
            case HallCommonEvent.TASK_UPDATE:
                this.taskUpdate(data);
                break;
            case HallCommonEvent.GET_LUCK_ID:
                this.getLuckId(data);
                break;
            case HallCommonEvent.ON_SHOP_SUCCESS:
                this.onShopSuccess();
                break;
            case HallCommonEvent.RECEIVE_REWARD:
                this.receiveReward();
                break;
            case HallCommonEvent.SET_WINNERS:
                this.updateWinners(data);
                break;
            case HallCommonEvent.CHANGE_RED_BAG:
                this.changeResult(data);
                break;
            case HallCommonEvent.UPDATE_NICK:
                this.updateNick(data);
                break;
            case HallCommonEvent.UPDATE_SEX:
                this.updateSex(data);
                break;
            case HallCommonEvent.MARQUEE:
                this.onMarquee(data);
                break;
            case HallCommonEvent.GET_BROADCAST_CONFIG:
                this.onDefaultMarquee(data);
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.onSetMoneyAndCards(data.getCoin(), data.getRoomCard());
                break;
            case HallCommonEvent.HALL_UPDATE_VIP:
                this.updateVip();
                break;
            case HallCommonEvent.HALL_UPDATE_PLAYER:
                this.updatePlayer();
                break;
            case FORTUNEHALLEvent.CHARGE_FLAG_CHANGE_COIN:
                this.updateChargeFlag();
                break;
            case HallCommonEvent.HALL_UPDATE_VIP:
                this.updateVip();
                break;
            case HallCommonEvent.UPDATA_PropData:
                this.updateFalg();
                break;
            case HallCommonEvent.HALL_UPDATE_FLAG:
                this.updateFalg();
                break;
            case shopEvent.REFRESH_DATA:
                this.updateFirstBuy();
            default:
                break;
        }
    },
});
