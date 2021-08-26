const MEMBER_STATUS = {
    APPLY: -1,//申请列表
    MANAGER: 0,//管理列表
    SCORE: 1,//积分列表
    CHECK: -2//查看列表
}

const MEMBER = {
    OWNER: 1,//群主
    NORMAL: 2,//普通
    ADMIN: 3,//管理员
}

const FG_STATUS = {
    WAIT:0, //等待审核
    APPLY:1,//申请加入
    ENTER:2,//进入
    ADD:3,//创建
    JOIN:4,//加入
}

const TABLE_TYPE = {
    THREE: 0,
    FOUR: 1,
    BIG_FIVE: 2,
    BIG_NINE: 3,
    BIG_ELEVEN: 4,
    ONE: 5
}

module.exports = {
    MEMBER_STATUS: MEMBER_STATUS,
    MEMBER: MEMBER,
    FG_STATUS: FG_STATUS,
    TABLE_TYPE: TABLE_TYPE,
}