var cost_room_cards_config = require('cost_room_cards');

cc.Class({
    extends: require('base_mj_create_room'),

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_qs: { default: [], type: cc.Toggle, tooltip: '圈数', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_fd: { default: [], type: cc.Toggle, tooltip: '封顶', },
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
                    return item.id == cc.dd.Define.GameType.BCMJ_FRIEND && item.player_num == 4;
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
                    return item.id == cc.dd.Define.GameType.BCMJ_FRIEND && item.player_num == 3;
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
                    return item.id == cc.dd.Define.GameType.BCMJ_FRIEND && item.player_num == 2;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num+'圈';//JuShuDesc[i];
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
            case "fd1":
                this.m_objRuleIndex.fd = 0;
                group = this.p_fd;
                break;
            case "fd2":
                this.m_objRuleIndex.fd = 1;
                group = this.p_fd;
                break;
            case "fd3":
                this.m_objRuleIndex.fd = 2;
                group = this.p_fd;
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
            case "wf5":
                this.m_objRuleIndex.wf[4] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf6":
                this.m_objRuleIndex.wf[5] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf7":
                this.m_objRuleIndex.wf[6] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf8":
                this.m_objRuleIndex.wf[7] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf9":
                this.m_objRuleIndex.wf[8] = target.isChecked;
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
     * 设置封顶
     */
    setFD: function () {
        this.initToggleColor(this.p_fd);
        switch (this.m_objRuleIndex.fd) {
            case 0:
                this.setCheckedToggle(this.p_fd[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_fd[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_fd[2], true);
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
        this.setCheckedToggle(this.p_wf[4], this.m_objRuleIndex.wf[4]);
        this.setCheckedToggle(this.p_wf[5], this.m_objRuleIndex.wf[5]);
        this.setCheckedToggle(this.p_wf[6], this.m_objRuleIndex.wf[6]);
        this.setCheckedToggle(this.p_wf[7], this.m_objRuleIndex.wf[7]);
        this.setCheckedToggle(this.p_wf[8], this.m_objRuleIndex.wf[8]);
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
            //封顶
            fd: 1,
            // 玩法
            wf: [true, true, true, true, true, true, true, true, false],
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
        this.setFD();
        this.setWF();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getXLGameRule(data, qsOrJs){
        var rule = new cc.pb.room_mgr.xl_game_rule();
        var pbData = new cc.pb.room_mgr.baicheng_req_createdesk();

        pbData.setPaytype(data.ff);
        pbData.setBoardscout(qsOrJs);
        pbData.setUsercountlimit(data.rs);

        pbData.setIsjia5(data.wf[0]);
        pbData.setIsqingyise(data.wf[1]);
        pbData.setIsjihujipiao(data.wf[2]);
        pbData.setIsshoubayi(data.wf[4]);
        pbData.setIsbeikaobei(data.wf[5]);
        pbData.setIszerenzhi(data.wf[6]);
        pbData.setReservedList([String(data.wf[3]), String(data.wf[7]), String(data.wf[8]), String(data.fd)]);

        pbData.setIsuncheat(data.fzb);

        pbData.setGps(data.fzb);
        pbData.setIsyuyin(data.yy);

        rule.setMjBaichengRule(pbData);

        return rule;
    },



    setXLGameRule(rule){
        let _rule = rule.rule.mjBaichengRule;
        _rule.iszangang = _rule.reservedList[0] === 'true';
        _rule.isgangjiafan = _rule.reservedList[1] === 'true';
        _rule.isxiaojifeidan = _rule.reservedList[2] === 'true';
        let fengding = parseInt(_rule.reservedList[3]);
        _rule.fengding = cc.dd._.isNumber(fengding) && !isNaN(fengding) ? fengding : 1;

        let qsOrJs = 0;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.BCMJ_FRIEND && item.player_num == _rule.usercountlimit;
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
            //封顶
            fd: _rule.fengding,
            // 玩法
            wf: [_rule.isjia5, _rule.isqingyise, _rule.isjihujipiao, _rule.iszangang, _rule.isshoubayi, _rule.isbeikaobei, _rule.iszerenzhi, _rule.isgangjiafan, _rule.isxiaojifeidan],
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
        this.p_fd.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_wf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        ///////////////////////////////////////////////////////////
    },

    getGameType(){
        return cc.dd.Define.GameType.BCMJ_FRIEND;
    },

    getGame(){
        return 'bcmj';
    }
});
