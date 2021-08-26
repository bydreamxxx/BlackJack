/**
 * 吉林麻将 金币场 数据
 * @type {Function}
 */

var instance = null;

var jlmj_desk_jbc_data = cc.Class({

    statics: {
        /**
         * 获取实例
         */
        getInstance: function() {
            if( cc.dd.Utils.isNull( instance ) ) {
                instance = new jlmj_desk_jbc_data();
            }
            return instance;
        },
    },

    /**
     * 构造函数
     */
    ctor: function() {
        // 房间类型
        this.m_nKey = 0;
        // 游戏ID
        this.m_nGameId = 0;
        // 房间ID
        this.m_nRoomid = 0;
        // 房间标题
        this.m_strTitle = "";
        // 规则底分
        this.m_nBaseScore = 0;
        // 低于分数进入
        this.m_nUnderScore = 0;
        // 高于分数进入
        this.m_nExceedScore = 0;
        // 低于玩家人数
        this.m_nUnderPlayerNum = 0;
        // 高于玩家人数
        this.m_nExceedPlayerNum = 0;
        // 描述房间信息
        this.m_strDesc = "";

        // 是否匹配中
        this.m_bIsMatching = false;
        // 是否已开始
        this.m_bIsStart = false;
        // 是否断线重连
        this.m_bIsReconnect = false;
    },

    /**
     * 销毁
     */
    destroy: function() {
        // 房间类型
        this.m_nKey = 0;
        // 游戏ID
        this.m_nGameId = 0;
        // 房间ID
        this.m_nRoomid = 0;
        // 房间标题
        this.m_strTitle = "";
        // 规则底分
        this.m_nBaseScore = 0;
        // 低于分数进入
        this.m_nUnderScore = 0;
        // 高于分数进入
        this.m_nExceedScore = 0;
        // 低于玩家人数
        this.m_nUnderPlayerNum = 0;
        // 高于玩家人数
        this.m_nExceedPlayerNum = 0;
        // 描述房间信息
        this.m_strDesc = "";

        // 是否匹配中
        this.m_bIsMatching = false;
        // 是否已开始
        this.m_bIsStart = false;
        // 是否断线重连
        this.m_bIsReconnect = false;

        if( !cc.dd.Utils.isNull( instance ) ) {
            instance = null;
        }
    },

    /**
     * 设置 金币场 数据
     * @param data
     */
    setData: function( data ) {
        this.m_nKey = data.key;
        this.m_nGameId = data.gameid;
        this.m_nRoomid = data.roomid;
        this.m_strTitle = data.titel;
        this.m_nBaseScore = data.basescore;
        this.m_nUnderScore = data.entermin;
        this.m_nExceedScore = data.entermax;
        this.m_nUnderPlayerNum = data.playernummin;
        this.m_nExceedPlayerNum = data.playernummax;
        this.m_strDesc = data.desc;

    },

    /**
     * 设置房间类型
     * @param value
     */
    setKey: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nKey = value;
        }
    },

    /**
     * 获取房间类型
     * @returns {*|number}
     */
    getKey: function() {
        return this.m_nKey;
    },

    /**
     * 设置游戏ID
     * @param value
     */
    setGameId: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nGameId = value;
        }
    },

    /**
     * 获取游戏ID
     * @returns {*|number}
     */
    getGameId: function() {
        return this.m_nGameId;
    },

    /**
     * 设置房间ID
     * @param value
     */
    setRoomId: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nRoomid = value;
        }
    },

    /**
     * 获取游戏ID
     * @returns {*|number}
     */
    getRoomId: function() {
        return this.m_nRoomid;
    },

    /**
     * 设置房间标题
     * @param value
     */
    setTitle: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_strTitle = value;
        }
    },

    /**
     * 获取房间标题
     * @returns {*|number}
     */
    getTitle: function() {
        return this.m_strTitle;
    },

    /**
     * 设置规则底分
     * @param value
     */
    setBaseScore: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nBaseScore = value;
        }
    },

    /**
     * 获取规则底分
     * @returns {*|number}
     */
    getBaseScore: function() {
        return this.m_nBaseScore;
    },

    /**
     * 设置低于分数
     * @param value
     */
    setUnderScore: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nUnderScore = value;
        }
    },

    /**
     * 获取低于分数
     * @returns {*|number}
     */
    getUnderScore: function() {
        return this.m_nUnderScore;
    },

    /**
     * 设置高于分数
     * @param value
     */
    setExceedScore: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nExceedScore = value;
        }
    },

    /**
     * 获取高于分数
     * @returns {*|number}
     */
    getExceedScore: function() {
        return this.m_nExceedScore;
    },

    /**
     * 设置低于人数
     * @param value
     */
    setUnderPlayerNum: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nUnderPlayerNum = value;
        }
    },

    /**
     * 获取低于人数
     * @returns {*|number}
     */
    getUnderPlayerNum: function() {
        return this.m_nUnderPlayerNum;
    },

    /**
     * 设置高于人数
     * @param value
     */
    setExceedPlayerNum: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_nExceedPlayerNum = value;
        }
    },

    /**
     * 获取高于人数
     * @returns {*|number}
     */
    getExceedPlayerNum: function() {
        return this.m_nExceedPlayerNum;
    },

    /**
     * 设置描述房间信息
     * @param value
     */
    setDesc: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_strDesc = value;
        }
    },

    /**
     * 获取描述房间信息
     * @returns {*|number}
     */
    getDesc: function() {
        return this.m_strDesc;
    },

    /**
     * 设置是否匹配中
     * @param value
     */
    setIsMatching: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_bIsMatching = value;
        }
    },

    /**
     * 获取是否匹配中
     * @returns {*|number}
     */
    getIsMatching: function() {
        return this.m_bIsMatching;
    },

    /**
     * 设置是否已开始
     * @param value
     */
    setIsStart: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_bIsStart = value;
        }
    },

    /**
     * 获取是否已开始
     * @returns {*|number}
     */
    getIsStart: function() {
        return this.m_bIsStart;
    },

    /**
     * 设置是否断线重连
     * @param value
     */
    setIsReconnect: function( value ) {
        if( !cc.dd.Utils.isNull( value ) ) {
            this.m_bIsReconnect = value;
        }
    },

    /**
     * 获取是否断线重连
     * @returns {*|number}
     */
    getIsReconnect: function() {
        return this.m_bIsReconnect;
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = jlmj_desk_jbc_data;
