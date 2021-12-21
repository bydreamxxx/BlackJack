const LanguageEvent = cc.Enum({
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE'
});
const LanguageEd = new cc.dd.EventDispatcher();

const LanguangeConfig = require('language');

const LanguageMgr = cc.Class({
    statics: {
        s_instance: null,
        // 获取单例对象
        getInstance: function () {
            if (!this.s_instance) {
                this.s_instance = new LanguageMgr();
            }
            return this.s_instance;
        },
    },

    kind: '',

    ctor() {
        let kind = "en";

        if (cc.sys.localStorage.getItem("lanAndCountry")) {
            kind = cc.sys.localStorage.getItem("lanAndCountry");
        } else {
            //todo native实现

        }

        this.setKind(kind);
    },
    setKind(kind) {
        this.kind = kind;
    },
    getKind() {
        return this.kind;
    },
    changeLanguage(kind) {
        if (this.kind != kind) {
            this.setKind(kind);
            cc.sys.localStorage.setItem("lanAndCountry", kind);
            LanguageEd.notifyEvent(LanguageEvent.CHANGE_LANGUAGE);
        }
    },
    getText(text) {
        let config = LanguangeConfig.getItem(function(item){
            if(item.keyword == text)
                return item;
        });

        if (config) {
            let str = config[this.kind] || "";
            return str;
        } else if (text == "") {
            return "";
        } else {
            cc.log(`文本${text}没有多语言`);
            return text;
        }
    }
});
module.exports = {
    LanguageMgr: LanguageMgr,
    LanguageEvent: LanguageEvent,
    LanguageEd: LanguageEd
}