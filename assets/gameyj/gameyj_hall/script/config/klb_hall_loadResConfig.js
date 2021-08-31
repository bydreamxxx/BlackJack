
/**
 *  配置加载时的资源
 */
var dd = cc.dd;
if(!dd.ResLoadCell)
    dd.ResLoadCell = require("ResLoader").ResLoadCell;;
var loadCellList = [];

// 这个是通用
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_GameItem',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_GameListPage',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_GameTag',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_VipGameListPage',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_Room',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_ShopListPage',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_ShopItem',cc.Prefab));

loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_Bag',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_BagItem',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/klb_hall_ItemTips',cc.Prefab));

// loadCellList.push(new dd.ResLoadCell('gameyj_common/prefab/com_user_info',cc.Prefab));
// loadCellList.push(new dd.ResLoadCell('gameyj_common/atlas/userInfo',cc.SpriteAtlas));

// loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/jlmj_hall_NoticeItem',cc.Prefab));
// loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/jlmj_hall_zhanjiItem',cc.Prefab));
//loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/klb_hall_createRoom',cc.SpriteAtlas));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/gameIcon',cc.SpriteAtlas));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/more',cc.SpriteAtlas));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/setting',cc.SpriteAtlas));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/room',cc.SpriteAtlas));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/itemIcon',cc.SpriteAtlas));
loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/shangcheng',cc.SpriteAtlas));

loadCellList.push(new dd.ResLoadCell("gameyj_mj/jilin/py/prefabs/jlmj_create_room",cc.Prefab));

// 这个是通用
loadCellList.push(new dd.ResLoadCell('gameyj_common/prefab/PropItem',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_common/prefab/Marquee', cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_common/prefab/PropUI',cc.Prefab));
loadCellList.push(new dd.ResLoadCell("gameyj_common/prefab/klb_friend_group_redbag", cc.Prefab));
loadCellList.push(new dd.ResLoadCell("gameyj_common/prefab/klb_friend_group_invite_answer", cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_common/prefab/com_prompt_box',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_common/prefab/com_user_info',cc.Prefab));
loadCellList.push(new dd.ResLoadCell('gameyj_common/atlas/userInfo',cc.SpriteAtlas));

// loadCellList.push(new dd.ResLoadCell('gameyj_hall/prefabs/jlmj_hall_zhanjiItem',cc.Prefab));
loadCellList.push(new dd.ResLoadCell("gameyj_mj/jilin/py/atlas/setting",cc.SpriteAtlas));

module.exports={
    LoadCellList:loadCellList,
}
