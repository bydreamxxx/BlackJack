const { ccclass, menu, property, requireComponent } = cc._decorator;
import LanguageComponent from './LanguageComponent';

@ccclass
@menu("多语言/sprite")
@requireComponent(cc.Sprite)
export default class LanguageSprite extends LanguageComponent {
    @property(cc.SpriteFrame)
    zh = null;
    @property(cc.SpriteFrame)
    en = null;

    changeLanguage() {
        if (LanguageMgr.getKind() == "EN") {
            this.getComponent(cc.Sprite).spriteFrame = this.en;
        } else if (LanguageMgr.getKind() == "ZH") {
            this.getComponent(cc.Sprite).spriteFrame = this.zh;
        }
    }
}
