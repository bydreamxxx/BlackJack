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
    FRIEND_APPLY_LIST: 'friend_apply_list',
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
        // 申请列表
        _applyList: [],
        // 搜索列表
        _searchList: [],
        // 朋友详情
        _friendDetail: null,
        //聊天记录
        _chatHistory: null,
        // 未读消息记录
        _unreadChatTimes: null,
        // 大厅红点
        hallRedCount: 0,
    },
    ctor: function () {
        this.loadLocalChat()
        this.loadUnreadChatTime()
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
        if(!friendUI && msg.fromUserId) {
            this.hallRedCount = this.hallRedCount+1
            FriendED.notifyEvent(FriendEvent.FRIEND_HALL_RED_POINT, this.getHallRedCount());
        }
    },
    // 通过id获取聊天记录
    getChatMsgByUid(uid) {
        if(this._chatHistory[uid]) {
            return this._chatHistory[uid]
        }
        return []
    },
    // 获取未读消息数量
    getUnreadChatCount(uid) {
        if(!this._chatHistory[uid] || this._chatHistory[uid].length <=0 ) {
            return 0
        }
        let chatCount = 0
        let lastTime = this._unreadChatTimes[uid]? this._unreadChatTimes[uid]: 0
        for(let i=0; i<this._chatHistory[uid].length; i++) {
            if(this._chatHistory[uid][i].time > lastTime) {
                chatCount++
            }
        }
        return chatCount
    },
    // 获取大厅红点数量
    getHallRedCount() {
        let redCount = 0
        for(let i=0; i<this._friendList.length; i++) {
            redCount += this.getUnreadChatCount(this._friendList[i].uid)
        }
        redCount += this._applyList.length
        return redCount
    },
    // 初始化朋友信息
    initFriendList: function(data)  {
        this._friendList.splice(0, this._friendList.length);
        data.listList.forEach( (item)=> {
            this._friendList.push(item)
        });
        FriendED.notifyEvent(FriendEvent.FRIEND_REFRESH, null);
    },
    // 申请列表
    setApplyList: function(data) {
        this.hallRedCount = this.hallRedCount - this._applyList.length
        if(this.hallRedCount < 0) {
            this.hallRedCount = 0
        }
        this._applyList.splice(0, this._applyList.length);
        data.listList.forEach( (item)=> {
            this._applyList.push(item)
        });
        this.hallRedCount = this.hallRedCount + this._applyList.length
        FriendED.notifyEvent(FriendEvent.FRIEND_HALL_RED_POINT, this.getHallRedCount());

        FriendED.notifyEvent(FriendEvent.FRIEND_APPLY_LIST, null);
    },
    // 好友请求
    beAddFriend: function(data) {
        let index = this._applyList.findIndex(item=>{
            return item.uid === data.info.info.uid
        })
        if(index < 0) {
            this.hallRedCount = this.hallRedCount+1
            this._applyList.push(data.info)
        }
        // 未打开界面，红点提示
        let friendUI = cc.dd.UIMgr.getUI(hall_prefab.BJ_HALL_FRIEND)
        if(!friendUI) {
            // this.hallRedCount = this.hallRedCount+1
            FriendED.notifyEvent(FriendEvent.FRIEND_HALL_RED_POINT, this.getHallRedCount());
        }
        FriendED.notifyEvent(FriendEvent.FRIEND_APPLY_LIST, null);
    },
    // 被好友删除
    beDelFriend: function(data) {
        let index = this._friendList.findIndex((item)=>{
            return item.uid === data.friendId
        })
        if(index >= 0) {
            let item = this._friendList[index]
            cc.dd.PromptBoxUtil.show('friend_text16', undefined, undefined, undefined, item.name);
            this._friendList.splice(index, 1)
            FriendED.notifyEvent(FriendEvent.FRIEND_REFRESH, null);
        }
    },
    // 移除申请列表
    removeReplyFriend: function(uid) {
        let index = this._applyList.findIndex((item)=>{
            return item.info.uid === uid
            // return item.friendId ===  uid
        })
        if(index>=0) {
            this._applyList.splice(index, 1)
            this.hallRedCount = this.hallRedCount - 1
        }
        FriendED.notifyEvent(FriendEvent.FRIEND_HALL_RED_POINT, this.getHallRedCount());
    },
    // 朋友详情
    setFriendDetail: function(data)  {
        this._friendDetail = data
        FriendED.notifyEvent(FriendEvent.FRIEND_DETAIL, data);
    },
    // 查找结果,type:0搜索好友，1推荐好友
    setSearched:function(data, type)  {
        this._searchList.splice(0, this._searchList.length);
        data.listList.forEach( (item)=> {
            this._searchList.push(item)
        });
        FriendED.notifyEvent(FriendEvent.FRIEND_SEARCH_RESULT, type);
    },
    getSearchList() {
        return this._searchList
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
    // 保存最后一条已读消息时间
    saveUnreadChatTime(uid, time) {
        let lastTime = this._unreadChatTimes[uid]
        if(!lastTime) {
            lastTime = 0
        }
        if(time > lastTime) {
            lastTime = time
        }
        this._unreadChatTimes[uid] = lastTime
        cc.sys.localStorage.setItem('unreadChat', JSON.stringify(this._unreadChatTimes))
    },
    // 加载最后一条已读消息时间
    loadUnreadChatTime() {
        this._unreadChatTimes = {}
        let data = cc.sys.localStorage.getItem('unreadChat')
        if(!data) {
            return
        }
        let chatTimes = JSON.parse(data)
        let keys = Object.keys(chatTimes)
        for(let i=0; i<keys.length; i++) {
            let key = keys[i]
            this._unreadChatTimes[key] = chatTimes[key]
        }
    },

    // 获取朋友列表
    getFriendList() {
        return this._friendList
    },
    // 获取申请列表
    getApplyList() {
        return this._applyList
    },
    // 获取简要信息
    getFriendBriefInfo(uid) {
        for(let i=0; i<this._friendList.length;  i++) {
            if(this._friendList[i].uid===uid) {
                return this._friendList[i]
            }
        }
        for(let i=0; i<this._applyList.length;  i++) {
            if(this._applyList[i].info.uid===uid) {
                return this._applyList[i].info
            }
        }
        for(let i=0; i<this._searchList.length;  i++) {
            if(this._searchList[i].uid===uid) {
                return this._searchList[i]
            }
        }
    },
    // 是否好友
    isFriend(uid) {
        return this._friendList.findIndex((item)=>{
            return item.uid===uid
        }) >= 0
    }
    
});

module.exports = {
    FriendED: FriendED,
    FriendEvent: FriendEvent,
    FriendData: FriendData,
}

