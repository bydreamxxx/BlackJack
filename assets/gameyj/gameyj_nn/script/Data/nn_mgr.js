var nn_audio_cfg = require('nn_audio_cfg');
var AudioManager = require('AudioManager');
var nn_Mgr = cc.Class({

    s_nn_mgr: null,
    statics: {
        Instance: function () {
            if (!this.s_nn_mgr) {
                this.s_nn_mgr = new nn_Mgr();
            }
            return this.s_nn_mgr;
        },

        Destroy: function () {
            if (this.s_nn_mgr) {
                this.s_nn_mgr.clear();
                this.s_nn_mgr = null;
            }
        },
    },

    autoBetRet() {
        if (this.checkGameUI()) {
            this.gameUI.initAutobetButton();
        }
    },

    /**
     * 抢庄返回
     * @param {Number} userId 
     * @param {Number} bet 
     * @param {Number} view 
     */
    bankRet(userId, bet, view, sex) {
        if (this.checkGameUI()) {
            var sprite = this.gameUI.getBankSpriteFrame(bet);
            this.gameUI.playerUI[view].bankRet(bet, sprite);
            if (view == 0)
                this.playSound(sex, 0, bet);
        }
    },

    playerAuto(msg) {
        if (this.checkGameUI()) {
            this.gameUI.playerAuto(msg);
        }
    },

    /**
     * 抢庄结果
     * @param {Number} bankerId 
     * @param {Number} view 
     */
    bankComp(bankerId, view) {
        if (this.checkGameUI()) {
            //this.gameUI.clearBankUI();
            this.gameUI.clearTimer();
            this.gameUI.bankComp(bankerId);
            //this.gameUI.playerUI[view].bankComp();
        }
    },

    /**
     * 加倍返回
     * @param {Number} userId 
     * @param {Number} bet 
     * @param {Number} view 
     */
    betRet(userId, bet, view, sex) {
        if (this.checkGameUI()) {
            var sprite = this.gameUI.getBetSpriteFrame(bet);
            this.gameUI.playerUI[view].betRet(bet, sprite);
            if (view == 0)
                AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.BET, false);
        }
    },

    clear: function () {
        this.gameUI = null;
    },

    /**
     * 初始化数据
     */
    ctor: function () {
        this.gameUI = null;
    },

    /**
     * 游戏步骤切换
     * @param {Number} status 
     */
    changeStatus(status) {
        if (this.checkGameUI()) {
            this.gameUI.updateStatus(status);
        }
    },

    //检查游戏脚本
    checkGameUI() {
        return this.gameUI != null;
    },

    //完成组牌
    completedGroup(userId, type, view) {
        if (this.checkGameUI()) {
            this.gameUI.playerUI[view].groupRet(type);
        }
    },

    //解散返回
    dissolveRet(msg) {
        if (this.checkGameUI()) {
            this.gameUI.showDissolve(msg);
        }
    },

    //解散结果
    dissolveResult(msg) {
        if (this.checkGameUI()) {
            this.gameUI.showDissolveResult(msg);
        }
    },

    //游戏开局
    gameStart() {
        if (this.checkGameUI()) {
            this.gameUI.gameStart();
        }
    },

    /**
     * 玩家准备
     * @param {Number} userId 
     */
    playerReady(userId) {
        if (this.checkGameUI()) {
            if (userId == cc.dd.user.id) {
                this.gameUI.resetGameUI();
            }
        }
    },

    //播放音效
    playSound(sex, type, kind) {
        var path = '';
        var cfg = null;
        if (sex == 1) {//男
            cfg = nn_audio_cfg.MAN;
        }
        else {
            cfg = nn_audio_cfg.WOMAN;
        }
        switch (type) {
            case 0://抢庄
                path = cfg.QIANGZHUANG[kind];
                break;
            case 1://牌型
                path = cfg.PAIXING[kind];
                break;
        }
        AudioManager.getInstance().playSound(path, false);
    },


    /** 
     * 重连游戏
    */
    reconnectGame() {
        if (this.checkGameUI()) {
            this.gameUI.reconnectGame();
        }
    },

    /**
     * 玩家离开
     * @param {Number} view 
     */
    removePlayerUI(view) {
        // if (this.checkGameUI()) {
        //     this.gameUI.playerUI[view].resetUI();
        //     this.gameUI.playerUI[view].showUI(false);
        // }
    },

    /**
     * 开牌
     */
    scanPoker(msg) {
        if (this.checkGameUI()) {
            this.gameUI.clearTimer();
            this.gameUI.playerUI[0].showOp(-1);
            this.gameUI.scanPoker(msg);
        }
    },

    /**
     * 发牌
     */
    sendPoker(msg) {
        if (this.checkGameUI()) {
            this.gameUI.sendPoker(msg);
        }
    },

    /**
     * 第二次发牌
     */
    send2ndPoker(msg) {
        if (this.checkGameUI()) {
            this.gameUI.send2ndPoker(msg);
        }
    },

    /**
     * 设置游戏脚本
     * @param {cc.Component} component 
     */
    setGameUI(component) {
        this.gameUI = component;
    },

    /**
     * 设置牌面
     * @param {cc.Node} node 
     * @param {Number} cardValue 
     * @param {cc.SpriteAtlas} paiAtlas
     */
    setPoker(node, cardValue, paiAtlas) {
        if (paiAtlas == null) {
            paiAtlas = this.gameUI.pokerAtlas;
        }
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = node.getChildByName('hua_xiao');
        var hua_da = node.getChildByName('hua_da');
        var num = node.getChildByName('num');
        if (value == 2) value = 16;
        if (value == 1) value = 14;
        if (value < 17) {
            switch (flower) {
                case 1:
                    flower = 4;
                    break;
                case 2:
                    flower = 3;
                    break;
                case 3:
                    flower = 2;
                    break;
                case 4:
                    flower = 1;
                    break;
            }
        }
        switch (value) {
            case 0:
                node.getChildByName('beimian').active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 16:
                node.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                node.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }
    },
    //背面牌
    setPokerBack(node, cardValue, paiAtlas) {
        if (paiAtlas == null) {
            paiAtlas = this.gameUI.pokerAtlas;
        }
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = node.getChildByName('hua_xiao');
        var hua_da = node.getChildByName('hua_da');
        var num = node.getChildByName('num');
        if (value == 2) value = 16;
        if (value == 1) value = 14;
        if (value < 17) {
            switch (flower) {
                case 1:
                    flower = 4;
                    break;
                case 2:
                    flower = 3;
                    break;
                case 3:
                    flower = 2;
                    break;
                case 4:
                    flower = 1;
                    break;
            }
        }
        switch (value) {
            case 0:
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 16:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }
    },

    /**
     * 玩家准备
     * @param {Number} userId 
     */
    setReady(userId) {
        if (this.checkGameUI()) {
            this.gameUI.setReady(userId);
        }
    },

    /**
     * 结算
     * @param {*} list 
     */
    showResult(list) {
        if (this.checkGameUI()) {
            this.gameUI.showResult(list);
        }
    },

    /**
     * 战绩
     * @param {*} msg 
     */
    showResultTotal(msg) {
        if (this.checkGameUI()) {
            this.gameUI.showResultTotal(msg);
        }
    },

    /**
    * 刷新玩家头像
    * @param {Number} id 
    */
    updatePlayerHead(id) {
        // if (this.checkGameUI()) {
        //     var view = nn_data.Instance().getViewById(id);
        //     var player = nn_data.Instance().getPlayerById(id);
        //     if (view > -1 && player) {
        //         this.gameUI.playerUI[view].updateHead(player);
        //         this.gameUI.playerUI[view].showUI(true);
        //     }
        // }
    },

    //更新玩家数量
    updateRoomPlayerNum() {
        if (this.checkGameUI()) {
            this.gameUI.updateRoomPlayerNum();
        }
    },


});
module.exports = nn_Mgr;