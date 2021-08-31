// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        horseLAtls1: cc.SpriteAtlas, //马的左动画图集
        knightLAtls1: cc.SpriteAtlas, //骑手左动画图集
        horseLAtls2: cc.SpriteAtlas, //马的左动画图集
        knightLAtls2: cc.SpriteAtlas, //骑手左动画图集
        horseLAtls3: cc.SpriteAtlas, //马的左动画图集
        knightLAtls3: cc.SpriteAtlas, //骑手左动画图集
        horseLAtls4: cc.SpriteAtlas, //马的左动画图集
        knightLAtls4: cc.SpriteAtlas, //骑手左动画图集
        horseLAtls5: cc.SpriteAtlas, //马的左动画图集
        knightLAtls5: cc.SpriteAtlas, //骑手左动画图集
        horseLAtls6: cc.SpriteAtlas, //马的左动画图集
        knightLAtls6: cc.SpriteAtlas, //骑手左动画图集
        shadowLAtls: cc.SpriteAtlas, //阴影左图集

        horseRAtls1: {default: null, type: cc.SpriteAtlas, visible: false},//马的右动画图集
        horseAtls1: {default: [], type: cc.SpriteAtlas, visible: false},//'马的转弯图集'
        knightRAtls1: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightWAtls1: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightAtls1: {default: [], type: cc.SpriteAtlas, visible: false},//'骑手转弯图集'
        horseRAtls2: {default: null, type: cc.SpriteAtlas, visible: false},//马的右动画图集
        horseAtls2: {default: [], type: cc.SpriteAtlas, visible: false},//马的转弯图集
        knightRAtls2: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightWAtls2: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightAtls2: {default: [], type: cc.SpriteAtlas, visible: false},//骑手转弯图集
        horseRAtls3 : {default: null, type: cc.SpriteAtlas, visible: false},//马的右动画图集
        horseAtls3: {default: [], type: cc.SpriteAtlas, visible: false},//马的转弯图集
        knightRAtls3: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightWAtls3: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightAtls3: {default: [], type: cc.SpriteAtlas, visible: false},//骑手转弯图集
        horseRAtls4: {default: null, type: cc.SpriteAtlas, visible: false},//马的右动画图集
        horseAtls4: {default: [], type: cc.SpriteAtlas, visible: false},//马的转弯图集
        knightRAtls4: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightWAtls4: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightAtls4: {default: [], type: cc.SpriteAtlas, visible: false},//骑手转弯图集
        horseRAtls5: {default: null, type: cc.SpriteAtlas, visible: false},//马的右动画图集
        horseAtls5: {default: [], type: cc.SpriteAtlas, visible: false},//马的转弯图集
        knightRAtls5: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightWAtls5: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightAtls5: {default: [], type: cc.SpriteAtlas, visible: false},//骑手转弯图集
        horseRAtls6: {default: null, type: cc.SpriteAtlas, visible: false},//马的右动画图集
        horseAtls6: {default: [], type: cc.SpriteAtlas, visible: false},//马的转弯图集
        knightRAtls6: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightWAtls6: {default: null, type: cc.SpriteAtlas, visible: false}, //骑手右动画图集
        knightAtls6: {default: [], type: cc.SpriteAtlas, visible: false},//骑手转弯图集
        shadowRAtls: {default: null, type: cc.SpriteAtlas, visible: false}, //阴影右图集
        shadowAtls: {default: [], type: cc.SpriteAtlas, visible: false},//阴影转弯图集
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._list = [0, 1, 2, 'R', 'W'];
        for(let i = 1; i <= 6; i++){
            this.loadAtlsList(i, 0, 'horse');
            this.loadAtlsList(i, 0, 'knight');
        }
        this.loadAtlsList('', 0, 'shadow');
    },

    loadAtlsList(id, index, type){
        if(index >= this._list.length){
            return;
        }
        if(type != 'knight' && index == this._list.length - 1){
            return;
        }
        let count = this._list[index];
        let path = `gameyj_horse_racing/atals/${type}${id}`;
        if(cc.dd._.isNumber(count)){
            path += `_${count}`
        }else{
            path += count;
        }
        cc.dd.ResLoader.loadGameStaticRes(path, cc.SpriteAtlas, function (atlas) {
            if(!cc.isValid(this.node)){
                return;
            }
            if(cc.dd._.isNumber(count)){
                this[`${type}Atls${id}`].push(atlas);
            }else{
                this[`${type}${count}Atls${id}`] = atlas;
            }
            this.loadAtlsList(id, index + 1, type);
        }.bind(this));
    },

    /**
     *
     * @param id
     * @param spriteAtlasType 传入012，0 == horse, 1 == knight, 2 == shadow
     * @param type 传入'L', 'R', 'A', 'W', ''
     * @returns {*}
     */
    getSpriteAtlas(id, spriteAtlasType, type){
        if(spriteAtlasType == 0){
            return this[`horse${type}Atls${id}`];
        }else if(spriteAtlasType == 1){
            return this[`knight${type}Atls${id}`];
        }else{
            return this[`shadow${type}Atls`];
        }
    }

    // update (dt) {},
});
