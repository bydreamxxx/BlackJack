var data_xiyou_audio =
{
    items:
        [
            { key: 1, desc: "背景音乐", audio_name: "dhxy_bgm" },
            { key: 2, desc: "普通点击", audio_name: "dhxy_dianji" },
            { key: 3, desc: "跑灯", audio_name: "dhxy_paodeng" },
            { key: 4, desc: "大奖跑灯", audio_name: "dhxy_dajiangpaodeng" },
            { key: 5, desc: "倒计时", audio_name: "dhxy_daojishi" },
            { key: 6, desc: "下注缓慢音效", audio_name: "dhxy_xiazu" },
            { key: 7, desc: "下注急促音效", audio_name: "dhxy_xiazu2" },
            { key: 8, desc: "本局开始", audio_name: "dhxy_kaishi" },
            { key: 9, desc: "赢分", audio_name: "dhxy_yingfen" },
            { key: 10, desc: "输分", audio_name: "dhxy_shufen" },
            { key: 11, desc: "大炮", audio_name: "dhxy_dapao" },
            { key: 12, desc: "白晶晶语音", audio_name: "dhxy_baijingjing" },
            { key: 13, desc: "牛魔王语音", audio_name: "dhxy_niumowang" },
            { key: 14, desc: "铁扇公主语音", audio_name: "dhxy_tieshangongzhu" },
            { key: 15, desc: "唐三藏语音", audio_name: "dhxy_tangsanzang" },
            { key: 16, desc: "猪八戒语音", audio_name: "dhxy_zhubajie" },
            { key: 17, desc: "紫霞仙子语音", audio_name: "dhxy_zixiaxianzi" },
            { key: 18, desc: "春三十娘语音", audio_name: "dhxy_chunsanshiniang" },
            { key: 19, desc: "至尊宝语音", audio_name: "dhxy_zhizunbao" },
            { key: 20, desc: "月光宝盒语音", audio_name: "dhxy_yueguangbaohe" },
            { key: 21, desc: "月光宝盒--惜败", audio_name: "dhxy_xibai" },
            { key: 22, desc: "月光宝盒--跑灯", audio_name: "dhxy_yueguangpaodeng" }
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

module.exports = data_xiyou_audio;