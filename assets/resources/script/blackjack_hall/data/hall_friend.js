var hall_prefab = require('hall_prefab_cfg');

var FriendED = new cc.dd.EventDispatcher();

var FriendEvent = cc.Enum({
    FRIEND_REFRESH: 'friend_refresh',
    OPEN_FRIEND_CHAT: 'open_friend_chat',
    OPEN_LOOKUP_FRIEND:  'open_lookup_friend',
    OPEN_LOOKUP_REQUESTER: 'open_lookup_requester',
    OPEN_LOOKUP_STRANGER: 'open_lookup_stranger',
    FRIEND_SEARCH_RESULT: 'friend_search_result',
    FRIEND_DETAIL: 'friend_detail',
    REQUEST_FRIEND_REFRESH: 'reqest_friend_refresh',
    FRIEND_CHAT_UPDATE: 'friend_chat_update',
    FRIEND_HALL_RED_POINT: 'friend_hall_red_point',
    FRIEND_SEND_EMOJI: 'friend_send_emoji',
});

// 聊天记录长度
const HISTORY_LEN = 20

var FriendData = cc.Class({
    statics: {
        m_instance: null,
        

        Instance: function () {
            if (this.m_instance == null) {
                this.m_instance = new FriendData();
            }
            return this.m_instance;
        },

        Destroy: function () {
            if (this.m_instance) {
                this.m_instance = null;
            }
        },
        
    },
    properties: {
        // 朋友列表
        _friendList: [],
        // 朋友详情
        _friendDetail: null,
        //聊天记录
        _chatHistory: null,
        // 大厅红点
        hallRedCount: 0,
    },
    ctor: function () {
        this.loadLocalChat()
    },
    // 添加聊天记录
    addChatMsg(uid, msg) {
        if(!this._chatHistory[uid]) {
            this._chatHistory[uid] = []
        }
        this._chatHistory[uid].push(msg)
        FriendED.notifyEvent(FriendEvent.FRIEND_CHAT_UPDATE, uid);

        // 保存聊天记录
        this.saveLoaclChat()
        // 未打开界面，红点提示
        let friendUI = cc.dd.UIMgr.getUI(hall_prefab.BJ_HALL_FRIEND)
        if(!friendUI && msg.toUserId) {
            this.hallRedCount = this.hallRedCount+1
            FriendED.notifyEvent(FriendEvent.FRIEND_HALL_RED_POINT, this.hallRedCount);
        }
    },
    // 通过id获取聊天记录
    getChatMsgByUid(uid) {
        if(this._chatHistory[uid]) {
            return this._chatHistory[uid]
        }
        return []
    },
    // 初始化朋友信息
    initFriendList: function(data)  {
        this._friendList.splice(0, this._friendList.length);
        data.friendInfo2.forEach( (item)=> {
            this._friendList.push(item)
        });
        FriendED.notifyEvent(FriendEvent.FRIEND_REFRESH, null);
    },
    // 朋友详情
    setFriendDetail: function(data)  {
        this._friendDetail = data
        FriendED.notifyEvent(FriendEvent.FRIEND_DETAIL, data);
    },
    // 查找结果
    setSearched:function(data)  {
        FriendED.notifyEvent(FriendEvent.FRIEND_SEARCH_RESULT, data);
    },
    // 添加好友
    onAddFriendItem(data) {
        // data.list((item)=>{
        //     this._friendList.push(item)
        // })
        FriendED.notifyEvent(FriendEvent.REQUEST_FRIEND_REFRESH, data);
    },
    // 保存本地聊天记录
    saveLoaclChat() {
        let history = {}
        let keys = Object.keys(this._chatHistory)
        for(let i=0; i<keys.length; i++) {
            let key = keys[i]
            let length = this._chatHistory[key].length
            let start = (length - HISTORY_LEN)< 0 ? 0: (length - HISTORY_LEN)
            history[key] = this._chatHistory[key].slice(start)
        }
        cc.sys.localStorage.setItem('chat', JSON.stringify(history))
    },
    // 加载本地聊天记录
    loadLocalChat() {
        this._chatHistory = {}
        let msg = cc.sys.localStorage.getItem('chat')
        if(!msg) {
            return
        }
        let history = JSON.parse(msg)
        let keys = Object.keys(history)
        for(let i=0; i<keys.length; i++) {
            let key = keys[i]
            this._chatHistory[key] = history[key]
        }
    },

    // 获取朋友列表
    getFriendList() {
        return this._friendList
    },
    // 获取简要信息
    getFriendBriefInfo(uid) {
        for(let i=0; i<this._friendList.length;  i++) {
            if(this._friendList[i].uid===uid) {
                return this._friendList[i]
            }
        }
    }
    
});

module.exports = {
    FriendED: FriendED,
    FriendEvent: FriendEvent,
    FriendData: FriendData,
}

