var cost_room_cards_config = require('cost_room_cards');

cc.Class({
    extends: require('base_mj_create_room'),

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_qs: { default: [], type: cc.Toggle, tooltip: '圈数', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        txt_jushu_list: [cc.Label],
        text_fangka_list: [cc.Label],
    },

    /**
     * 选择规则
     */
    getGroup: function (target, data) {

        var group = null;

        switch (data) {
            case "rs1":
                this.m_objRuleIndex.rs = 4;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.ACMJ_FRIEND && item.player_num == 4;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num+'圈';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X'+conf[i].cost+')';//FangKaDesc[i];
                }
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 3;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.ACMJ_FRIEND && item.player_num == 3;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num+'圈';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X'+conf[i].cost+')';//FangKaDesc[i];
                }
                break;
            case "rs3":
                this.m_objRuleIndex.rs = 2;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.ACMJ_FRIEND && item.player_num == 2;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num+'局';//JuShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X'+conf[i].cost+')';//FangKaDesc[i];
                }
                break;
            case "qs1":
                this.m_objRuleIndex.qs = 0;
                group = this.p_qs;
                break;
            case "qs2":
                this.m_objRuleIndex.qs = 1;
                group = this.p_qs;
                break;
            case "qs3":
                this.m_objRuleIndex.qs = 2;
                group = this.p_qs;
                break;
            case "wf1":
                this.m_objRuleIndex.wf[0] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf[1] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf3":
                this.m_objRuleIndex.wf[2] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf4":
                this.m_objRuleIndex.wf[3] = target.isChecked;
                group = this.p_wf;
                break;
            case "fzb1":
                this.m_objRuleIndex.fzb = target.isChecked;
                group = this.p_fzb;
                break;
            case "yy":
                this.m_objRuleIndex.yy = target.isChecked;
                group = this.p_yy;
                break;
            case "club":
                this.m_objRuleIndex.club = target.isChecked;
                group = this.p_club;
                break;
        }

        return group;
    },

    /**
     * 设置人数
     */
    setRS: function () {
        this.initToggleColor(this.p_rs);
        switch (this.m_objRuleIndex.rs) {
            case 4:
                this.setCheckedToggle(this.p_rs[0], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_rs[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_rs[2], true);
                break;
        }
    },

    /**
     * 设置圈数
     */
    setQS: function () {
        this.initToggleColor(this.p_qs);
        switch (this.m_objRuleIndex.qs) {
            case 2:
                this.setCheckedToggle(this.p_qs[0], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_qs[1], true);
                break;
            case 8:
                this.setCheckedToggle(this.p_qs[2], true);
                break;
        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);

        this.setCheckedToggle(this.p_wf[0], this.m_objRuleIndex.wf[0]);
        this.setCheckedToggle(this.p_wf[1], this.m_objRuleIndex.wf[1]);
        this.setCheckedToggle(this.p_wf[2], this.m_objRuleIndex.wf[2]);
        this.setCheckedToggle(this.p_wf[3], this.m_objRuleIndex.wf[3]);
    },

    /**
     * 初始化数据
     */
    initData: function () {
        // 规则数据
        this.m_objRuleIndex = {
            // 房费
            ff: 1,
            // 圈数
            qs: 2,
            // 人数
            rs: 4,
            // 玩法
            wf: [false, false, true, false],
            // 防作弊
            fzb: true,
            //俱乐部限定
            club: false,
            //语音
            yy:false,
        };
    },

    /**
     * 初始化视图
     */
    setCustomView: function () {
        this.setRS();
        this.setQS();
        this.setWF();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getXLGameRule(data, qsOrJs){
        var rule = new cc.pb.room_mgr.xl_game_rule();
        var pbData = new cc.pb.room_mgr.acheng_req_createdesk();

        pbData.setPaytype(data.ff);
        pbData.setBoardscout(qsOrJs);
        pbData.setUsercountlimit(data.rs);

        pbData.setReservedList([String(data.wf[0]), String(data.wf[1]), String(data.wf[2]), String(data.wf[3])]);

        pbData.setIsuncheat(data.fzb);

        pbData.setGps(data.fzb);
        pbData.setIsyuyin(data.yy);

        rule.setMjAchengRule(pbData);

        return rule;
    },



    setXLGameRule(rule){
        let _rule = rule.rule.mjAchengRule;
        _rule.ishongzhongmaitianfei = _rule.reservedList[0] === 'true';
        _rule.isguadafeng = _rule.reservedList[1] === 'true';
        _rule.isduibao = _rule.reservedList[2] === 'true';
        _rule.iskaipaizha = _rule.reservedList[3] === 'true';


        let qsOrJs = 0;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.ACMJ_FRIEND && item.player_num == _rule.usercountlimit;
        }.bind(this));

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            if(conf[i].circle_num == _rule.boardscout){
                if(i == 0){
                    qsOrJs = 2;
                }else if( i == 1){
                    qsOrJs = 4;
                }else{
                    qsOrJs = 8;
                }
                break;
            }
        }

        this.m_objRuleIndex = {
            // 房费
            ff: _rule.paytype,
            // 圈数
            qs: qsOrJs,
            // 人数
            rs: _rule.usercountlimit,
            // 玩法
            wf: [_rule.ishongzhongmaitianfei, _rule.isguadafeng, _rule.isduibao, _rule.iskaipaizha],
            // 防作弊
            fzb: _rule.gps,
            //俱乐部限定
            club: _rule.gps,
        };

        this.initView();

        //////////////////////////必须添加的部分//////////////////////////
        this.p_qs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_rs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_wf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        ///////////////////////////////////////////////////////////
    },

    getGameType(){
        return cc.dd.Define.GameType.ACMJ_FRIEND;
    },

    getGame(){
        return 'acmj';
    }
});
