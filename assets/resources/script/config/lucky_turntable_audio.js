var data_lucky_turntable_audio =
{
    items:
        [
            { key: 10001, desc: "背景音乐", audio_name: "audio_bgm_1" },
            { key: 10002, desc: "点击按钮", audio_name: "audio_button_click" },
            { key: 10003, desc: "撤销下注", audio_name: "audio_cancel_bet" },
            { key: 10004, desc: "滚珠进洞", audio_name: "audio_dongdd" },
            { key: 10005, desc: "滚珠转动", audio_name: "audio_wheel" },
            { key: 10006, desc: "玩家赢分", audio_name: "audio_win" },
            { key: 10007, desc: "玩家下注声", audio_name: "audio_xiazhu" }
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

module.exports = data_lucky_turntable_audio;