var data_fish_audio =
{
    items:
        [
            { key: 1, desc: "背景音乐", audio_name: "7001" },
            { key: 2, desc: "普通点击", audio_name: "7002" },
            { key: 3, desc: "开炮", audio_name: "7006" },
            { key: 4, desc: "金币不足", audio_name: "7007" },
            { key: 5, desc: "头像圆盘", audio_name: "7008" },
            { key: 6, desc: "渔网音效", audio_name: "7009" },
            { key: 7, desc: "获得金币", audio_name: "7010" },
            { key: 8, desc: "鱼潮背景", audio_name: "7016" },
            { key: 9, desc: "鱼潮来了", audio_name: "7017" },
            { key: 10, desc: "加号", audio_name: "7037" },
            { key: 11, desc: "减号", audio_name: "7038" }
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

module.exports = data_fish_audio;