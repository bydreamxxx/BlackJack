// 朋友
var FriendData = require('hall_friend').FriendData.Instance();
var FriendED = require('hall_friend').FriendED;
var FriendEvent = require('hall_friend').FriendEvent;
 
module.exports = {
    // 添加朋友成功
    on_msg_add_friend_succ: function(msg) {
        FriendData.onAddFriendItem(msg)
        cc.dd.PromptBoxUtil.show('friend_text9', undefined, undefined, undefined, msg.list.name);
    },
    // 聊天返回
    on_msg_chat_friend_ret: function(msg) {
        FriendData.addChatMsg(msg.fromUserId, msg)
    },
    // 朋友列表
    on_msg_friend_list_ret:  function(msg) {
        FriendData.initFriendList(msg)
    },
    // 朋友详情
    on_msg_friend_detail_info_ret: function(msg) {
        if(msg.code===0){
            FriendData.setFriendDetail(msg.detail)
        } else if(msg.code===1){
            cc.dd.PromptBoxUtil.show('friend_text1');
        } 
    },
    // 查找朋友 
    on_msg_lookup_friend_ret: function(msg) {
        FriendData.setSearched(msg)
    },
    // 有好友请求
    on_msg_be_add_friend: function(msg) {
        FriendData.beAddFriend(msg)
    },
    // 请求添加朋友结果
    on_msg_add_friend_ret: function( msg) {
        if(msg.code===0){
            cc.dd.PromptBoxUtil.show('friend_text0');
        } else if(msg.code===1){
            cc.dd.PromptBoxUtil.show('friend_text1');
        } else if(msg.code===2){
            cc.dd.PromptBoxUtil.show('friend_text2');
        } else if(msg.code===3){
            cc.dd.PromptBoxUtil.show('friend_text3');
        }
    },
    // 回复添加朋友结果
    on_msg_reply_add_friend_ret: function(msg) {
        if(msg.code===0){
            // cc.dd.PromptBoxUtil.show('friend_text0');
        } else if(msg.code===1){
            cc.dd.PromptBoxUtil.show('friend_text1');
        } else if(msg.code===2){
            cc.dd.PromptBoxUtil.show('friend_text2');
        } else if(msg.code===3){
            cc.dd.PromptBoxUtil.show('friend_text3');
        }
    },
    // 删除朋友结果
    on_msg_del_friend_ret: function(msg) {
        if(msg.code===0){
            cc.dd.PromptBoxUtil.show('friend_text8');
            
            var msg = new cc.pb.friend.msg_friend_list_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_list_req, msg, "msg_friend_list_req", true);
        }
    },
    //  赠送金币结果
    on_msg_send_friend_coin_ret: function(msg) {
        if(msg.code===0){
            cc.dd.PromptBoxUtil.show('friend_text4');
        } else if(msg.code===1){
            cc.dd.PromptBoxUtil.show('friend_text5');
        } else if(msg.code===2){
            cc.dd.PromptBoxUtil.show('friend_text6');
        } else if(msg.code===3){
            cc.dd.PromptBoxUtil.show('friend_text7');
        }
    },
    //  请求列表
    on_msg_friend_apply_list_ret: function(msg) {
        FriendData.setApplyList(msg)
    },
    // 离线消息
    on_msg_friend_messages_list_ret: function(msg) {
        for(let i=0; i<msg.listList.length; i++) {
            let data = msg.listList[i]
            FriendData.addChatMsg(data.fromUserId, data)
        }
    },
    // 修改签名
    on_msg_friend_modify_mood_ret: function(msg) {
        if(msg.code===0){
            cc.dd.PromptBoxUtil.show('friend_text12');
        }
    },
    // 被好友删除
    on_msg_be_del_friend_ret: function(msg) {

    },
    // 修改好友备注返回
    on_msg_friend_set_remarks_ret: function(msg) {
        if(msg.code===0){
            cc.dd.PromptBoxUtil.show('friend_text14');
        } else if(msg.code===1){
            cc.dd.PromptBoxUtil.show('friend_text5');
        } else if(msg.code===2){
            cc.dd.PromptBoxUtil.show('friend_text15');
        }
    }
 };
 