var Text = cc.dd.Text;
var item_cfg = require('item');
cc.Class({
    extends: cc.Component,

    properties: {

        //任务提示气泡
        title_node:cc.Node,
        title_txt:cc.Label,

        //宝箱动画，纹理
        task_open_frame:[cc.SpriteFrame],
        task_shut_frame:[cc.SpriteFrame],
        task_bg:cc.Node,
        task_ani:cc.Node,

        //进度条
        jingdutiao_node:cc.Node,
        jingdutiao_bg:cc.Node,
        jingdutiao_txt:cc.Label,

        //奖励显示气泡
        item_node:cc.Node,
        item_icon:cc.Sprite,
        item_txt:cc.Label,

        award_node:cc.Node,
        award_icon:cc.Sprite,
        award_txt:cc.Label,

        openBtn:cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {},

    setData:function (msg) {
        var node_w = this.jingdutiao_bg.width;
        this.task_msg = msg;
        this.task_ani.active = false;
        this.title_node.active = true;
        this.box_type = 0;
        this.ani_arr = ['tie','tong','yin','jin'];
        this.box_spr = this.task_bg.getComponent(cc.Sprite);
        this.box_ani = this.task_bg.getComponent(cc.Animation);
        this.item_ani = this.item_node.getComponent(cc.Animation);
        this.ani_node = this.task_ani.getComponent(dragonBones.ArmatureDisplay);

        this.box_type = msg.type;
        this.title_txt.string = msg.taskInfo;

        this.box_spr.spriteFrame = this.task_shut_frame[this.box_type];
        this.jingdutiao_bg.width = node_w * (msg.curCnt/msg.targetCnt);
        this.jingdutiao_txt.string = msg.curCnt + "/" + msg.targetCnt;

        this.jingdutiao_node.active = msg.curCnt < msg.targetCnt;
        this.openBtn.node.active = msg.curCnt >= msg.targetCnt;

        var award_items = this.task_msg.taskData.awardItems.split(",");

        this.item_data = item_cfg.getItem(function (item) {
            return item.key == award_items[0];
        }.bind(this));

        //this.title_txt.string = Text.TEXT_BAOXIANG_5 + this.item_data.memo+"X"+award_items[1];

        cc.dd.ResLoader.loadAtlas("gameyj_hall/atals/itemIcon",function(atlas){
            var sprite = atlas.getSpriteFrame(this.item_data.key);
            this.item_icon.spriteFrame = sprite;
            this.award_icon.spriteFrame = sprite;
        }.bind(this));

        this.item_txt.string = "X"+award_items[1];
        this.award_txt.string = award_items[1];
        this.item_node.active = false;
        this.award_node.active = false;
    },
    openBox:function () {
        this.title_node.active = false;
        this.openBtn.node.active = false;
        this.box_ani.play('mj_baoxiang');
        setTimeout(function () {
            this.box_spr.node.active = false;
            this.ani_node.node.active = true;

            this.ani_node.playAnimation(this.ani_arr[this.box_type],1);
            this.ani_node.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.lingquBaoXiang, this);
            this.ani_node.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.lingquBaoXiang, this);
        }.bind(this), 300);
        setTimeout(function () {
            this.item_node.active = true;
            this.item_ani.play('mj_baoxiang_item');
        }.bind(this), 600);

        var msg = new cc.pb.rank.msg_submit_task_2s();
        msg.setTaskId(this.task_msg.taskId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_submit_task_2s, msg, 'msg_submit_task_2s', true);
    },

    lingquBaoXiang:function () {
        this.box_spr.node.active = true;
        this.award_node.active = true;
        this.title_node.active = false;
        this.ani_node.node.active = false;
        this.jingdutiao_node.active = false;
        this.item_node.active = false;
        //this.box_spr.spriteFrame = this.task_open_frame[this.box_type];
    },

    onShowAwardInfo:function () {
        this.title_node.active = this.award_node.active;
        this.award_node.active = !this.award_node.active;
    },

    //start () {},

    // update (dt) {},
});
