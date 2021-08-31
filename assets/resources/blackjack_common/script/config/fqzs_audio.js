var data_fqzs_audio =
{
    items:
        [
            { key: 10001, desc: "开始下注动画时播放一次", audio_name: "begame_StartBet" },
            { key: 10002, desc: "背景音乐:重复播放", audio_name: "begame_background" },
            { key: 10003, desc: "3,2,1倒计时时每个数字播放一次", audio_name: "begame_111" },
            { key: 10004, desc: "筹码下注动画音效,顺序重复播放1", audio_name: "begame_BetCoin1" },
            { key: 10005, desc: "筹码下注动画音效,顺序重复播放2", audio_name: "begame_BetCoin2" },
            { key: 10006, desc: "筹码下注动画音效,顺序重复播放3", audio_name: "begame_BetCoin3" },
            { key: 10007, desc: "筹码下注动画音效,顺序重复播放4", audio_name: "begame_BetCoin4" },
            { key: 10008, desc: "筹码下注动画音效,顺序重复播放5", audio_name: "begame_BetCoin5" },
            { key: 10009, desc: "结束下注时播放音效", audio_name: "begame_Clock" },
            { key: 10010, desc: "跑圈开始", audio_name: "begame_RUN1" },
            { key: 10011, desc: "跑圈转圈", audio_name: "begame_RUN2" },
            { key: 10012, desc: "跑圈结束", audio_name: "begame_RUN3" },
            { key: 10013, desc: "鲨鱼", audio_name: "begame_ShuGuo_1" },
            { key: 10014, desc: "燕子", audio_name: "begame_ShuGuo_2" },
            { key: 10015, desc: "鸽子", audio_name: "begame_ShuGuo_3" },
            { key: 10016, desc: "孔雀", audio_name: "begame_ShuGuo_4" },
            { key: 10017, desc: "老鹰", audio_name: "begame_ShuGuo_5" },
            { key: 10018, desc: "狮子", audio_name: "begame_ShuGuo_6" },
            { key: 10019, desc: "猴子", audio_name: "begame_ShuGuo_7" },
            { key: 10020, desc: "熊猫", audio_name: "begame_ShuGuo_8" },
            { key: 10021, desc: "兔子", audio_name: "begame_ShuGuo_9" },
            { key: 10022, desc: "等待时间背景音乐重复播放", audio_name: "begame_WaitBGM" },
            { key: 10023, desc: "特殊事件音效", audio_name: "4027" },
            { key: 10024, desc: "大赢家动画音效", audio_name: "16021" },
            { key: 10025, desc: "特殊事件第二次和第三次中奖音效，与10011结合使用", audio_name: "begame_sgj_end_07" }
        ],

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem: function (filter) {
        var result = null;
        for (var i = 0; i < this.items.length; ++i) {
            if (filter(this.items[i])) {
                result = this.items[i];
                return result;
            }
        }
        return result;
    },

    /**
     * 查找第一个符合filter的list
     * @param filter
     * @returns {*}
     */
    getItemList: function (filter) {
        var list = [];
        this.items.forEach(function (item) {
            if (filter(item)) {
                list.push(item);
            }
        });
        return list;
    },
};

module.exports = data_fqzs_audio;