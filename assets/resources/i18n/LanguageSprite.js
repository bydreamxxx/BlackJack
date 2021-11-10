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
    @property(cc.SpriteFrame)
    in = null;
    @property(cc.SpriteFrame)
    tc = null;

    changeLanguage() {
        if (LanguageMgr.getKind() == "en") {
            this.getComponent(cc.Sprite).spriteFrame = this.en;
        } else if (LanguageMgr.getKind() == "zh") {
            this.getComponent(cc.Sprite).spriteFrame = this.zh;
        }else if (LanguageMgr.getKind() == "in") {
            this.getComponent(cc.Sprite).spriteFrame = this.in;
        }else if (LanguageMgr.getKind() == "tc") {
            this.getComponent(cc.Sprite).spriteFrame = this.tc;
        }
    }
}
