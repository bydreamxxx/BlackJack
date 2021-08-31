/**
 * Created by Mac_Li on 2017/9/4.
 */

/**
 *  配置加载时的资源
 */
var dd = cc.dd;

var loadCellList = [];

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
