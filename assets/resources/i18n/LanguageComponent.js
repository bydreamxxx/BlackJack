let languageMgr = require("LanguageMgr");
let LanguageEd = languageMgr.LanguageEd;
let LanguageEvent = languageMgr.LanguageEvent;

const { ccclass, property, disallowMultiple } = cc._decorator;
@ccclass
@disallowMultiple
export default class LanguageComponent extends cc.Component {
    onLoad() {
        LanguageEd.addObserver(this);
    }

    onDestroy() {
        LanguageEd.removeObserver(this);
    }

    start() {
        this.changeLanguage();
    }

    changeLanguage() {
        cc.warn(`changeLanguage 需要被实现 ${this.node.name}`);
    }

    onEventMessage(event, data) {
        switch (event) {
            case LanguageEvent.CHANGE_LANGUAGE:
                this.changeLanguage();
                break;
        }
    }
};

