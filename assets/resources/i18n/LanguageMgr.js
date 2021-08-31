const LanguageEvent = cc.Enum({
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE'
});
const LanguageEd = new cc.dd.EventDispatcher();

const LanguangeConfig = require('LanguangeConfig');

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

    languageJson: null,
    kind: '',

    ctor() {
        this.languageJson = LanguangeConfig;

        let kind = "ZH";

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
    getText(text, param) {
        if (this.languageJson && this.languageJson[text]) {
            let str = this.languageJson[text][this.kind] || "";
            if (param && param["$param"] !== undefined) {
                str = str.replace("$param", param["$param"].toString());
            }
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