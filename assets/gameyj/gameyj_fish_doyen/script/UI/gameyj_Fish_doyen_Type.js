// create by wj 2019/10/12
// var CFish = require('FishNode').CFish;
const FishType = require('DoyenFishType');
const data_fishtype = require('qka_fish_master_type');
cc.Class({
    extends: cc.Component,

    properties: {
        itemWith: 197,
        itemHeight: 150,
        off_With: 30,
        off_Height: 30,
        m_ItemNode: cc.Node,
        m_Content: cc.Node,
        atlasFish: cc.SpriteAtlas,
    },

    onLoad: function (list) {
        this.fishList = data_fishtype.getItemList(function (item) {
            if (item.fish_show_type == 1)
                return item;
        })

        var compare = function (a, b) {//比较函数
            if (a.key < b.key) {
                return -1;
            } else if (a.key > b.key) {
                return 1;
            } else {
                return 0;
            }
        }
        this.fishList.sort(compare);

        for (var i = 0; i < this.fishList.length; i++) {
            var fish = this.fishList[i];
            if (fish) {
                var fishNode = cc.instantiate(this.m_ItemNode);
                fishNode.parent = this.m_Content;
                fishNode.active = true;

                var betTxt = fishNode.getChildByName('bet').getComponent(cc.Label);
                var fishname = fishNode.getChildByName('name').getComponent(cc.Label);
                var fishAnchor = fishNode.getChildByName('fishAnchor'); //鱼位置点
                fishNode.tagname = fish.key;
                fishAnchor.getComponent(cc.Sprite).spriteFrame = this.atlasFish.getSpriteFrame('bydr_tj_f' + (i + 1));
                betTxt.string = fish.fish_mtp_power + '倍';
                fishname.string = fish.name;

                fishNode.on('click', this.onSelectItem.bind(this), this);
            }
        }

        this.onSelectItem(null, 1);
    },

    onSelectItem: function (event, data) {
        var idx = data;
        if (event)
            idx = event.target.tagname;

        var cfg = data_fishtype.getItem(function (item) {
            if (item.key == idx)
                return item;
        })

        if (this.selected) {
            this.selected.active = false;
        }

        var name = cc.find('left/ani/bg/name', this.node).getComponent(cc.Label);
        var des = cc.find('left/ani/des', this.node).getComponent(cc.Label);
        var sp = cc.find('left/ani/bg/sp', this.node).getComponent(cc.Sprite);
        if (event) {
            var selected = cc.find('selected', event.target)
            selected.active = true;
            this.selected = selected;
        }

        name.string = cfg.name;
        des.string = cfg.Exhibition_describe;
        sp.spriteFrame = this.atlasFish.getSpriteFrame('bydr_tj_f' + idx);
    },

    onClose: function () {
        AudioManager.playSound(FishType.fishAuidoPath + '7002', false);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
