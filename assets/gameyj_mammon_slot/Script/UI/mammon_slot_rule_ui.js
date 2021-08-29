// create by wj 2019/1/4
var SlotCfg = require('SlotCfg');
const slot_audio = require('slotaudio');
var AudioManager = require('AudioManager').getInstance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_nCurrPage : 1,
        m_oPrePageBtn: cc.Node,
        m_oNextPageBtn: cc.Node,
        m_oPageView: cc.PageView,
        m_oRootNode: cc.Node,
    },

    onLoad: function(){
        var InAct = this.m_oRootNode.getComponent(cc.Animation);
        InAct.play('rule_In');
    },

    setIndicator: function(){
        var indicator = this.m_oPageView.getComponentInChildren('custom_indicator');
        indicator.updatePageNum();
    },

    //点击规则按钮
    onClickRuleInfo: function(event, data){
        AudioManager.playSound(SlotCfg.AudioMammonPath + 1025032);
        var type = parseInt(data);
        this.m_nCurrPage += type;
        this.m_oPageView.scrollToPage(this.m_nCurrPage - 1);
    },

    //滑动pageview
    onSlicPageView: function(event, data){
        this.m_nCurrPage = this.m_oPageView.getCurrentPageIndex() + 1;
        this.updateOpBtnShow();
    },

    //更新按钮现实
    updateOpBtnShow: function(){
        if(this.m_nCurrPage <= 1){
            this.m_nCurrPage = 1;
            this.m_oPrePageBtn.active = false;
            this.m_oPrePageBtn.getComponent(cc.Button).interactable = false;

        }else if(this.m_nCurrPage >= 4){
            this.m_nCurrPage = 4;
            this.m_oNextPageBtn.active = false;
            this.m_oNextPageBtn.getComponent(cc.Button).interactable = false;
        }else{
            this.m_oPrePageBtn.active = true;
            this.m_oNextPageBtn.active = true;
            this.m_oPrePageBtn.getComponent(cc.Button).interactable = true;
            this.m_oNextPageBtn.getComponent(cc.Button).interactable = true;
        }
    },


    onClose: function(event, data){
        hall_audio_mgr.com_btn_click();
        var OutAct = this.m_oRootNode.getComponent(cc.Animation);
        OutAct.play('rule_out');
        var self = this;
        OutAct.on('finished', function(){
            cc.dd.UIMgr.destroyUI(self.node);
        });
    },
});
