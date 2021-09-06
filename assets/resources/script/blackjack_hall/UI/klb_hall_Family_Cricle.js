//create by wj 2019/05/13
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_nCurrPage : 1,
        m_oPrePageBtn: cc.Node,
        m_oNextPageBtn: cc.Node,
        m_oPageView: cc.PageView,
        m_ntime: 0,
        m_oLabel: cc.Label,
    },

    setIndicator: function(){
        var indicator = this.m_oPageView.getComponentInChildren('custom_indicator');
        indicator.updatePageNum();
    },

    update: function(dt){
        this.m_ntime += dt
        if(this.m_ntime >= 5){
            this.m_nCurrPage += 1;
            if(this.m_nCurrPage > 5){
                this.m_nCurrPage = 1;
                this.m_oPageView.scrollToTopLeft(0.1);
                this.m_oPageView.getComponentInChildren('custom_indicator').showIdx(0);
                this.updateOpBtnShow();

            }else{
                this.m_oPageView.scrollToPage(this.m_nCurrPage - 1);
                this.updateOpBtnShow();
            }
            this.m_ntime = 0;
        }
    },

    //点击规则按钮
    onClickRuleInfo: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.m_ntime = 0;
        var type = parseInt(data);
        this.m_nCurrPage += type;
        if(this.m_nCurrPage < 1)
            this.m_nCurrPage = 5;
        else if(this.m_nCurrPage > 5)
            this.m_nCurrPage = 1;
        this.m_oPageView.scrollToPage(this.m_nCurrPage - 1);
        this.updateOpBtnShow();
    },

    //更新按钮现实
    updateOpBtnShow: function(){
        var str = ''
        switch(this.m_nCurrPage){
            case 1:
                str = '独立的亲友圈信息，简洁清晰，一目了然'
                break;
            case 2:
                str = '1:1还原现实牌桌，快速约局，实时观战'
                break;
            case 3:
                str = '多种玩法，随时切换，畅快刺激'
                break;
            case 4:
                str = '专属聊天室，实时沟通，发布喊话'
                break;
            case 5:
                str = '限时红包活动！！在我的圈子，红包尽情抢！'
                break;
        }
        this.m_oLabel.string = str;
        // if(this.m_nCurrPage <= 1){
        //     this.m_nCurrPage = 1;
        //     this.m_oPrePageBtn.active = false;
        //     this.m_oPrePageBtn.getComponent(cc.Button).interactable = false;
        //     this.m_oNextPageBtn.active = true;
        //     this.m_oNextPageBtn.getComponent(cc.Button).interactable = true;
        // }else if(this.m_nCurrPage >= 5){
        //     this.m_nCurrPage = 5;
        //     this.m_oNextPageBtn.active = false;
        //     this.m_oNextPageBtn.getComponent(cc.Button).interactable = false;
        // }else{
        //     this.m_oPrePageBtn.active = true;
        //     this.m_oNextPageBtn.active = true;
        //     this.m_oPrePageBtn.getComponent(cc.Button).interactable = true;
        //     this.m_oNextPageBtn.getComponent(cc.Button).interactable = true;
        // }
    },

    setFunc(func){
        this.func = func;
    },

    onClose: function(event, data){
        hall_audio_mgr.com_btn_click();
        if(this.func){
            this.func();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
