const { ccclass, menu, property, requireComponent } = cc._decorator;
import LanguageComponent from './LanguageComponent';

@ccclass
@menu("多语言/label")
@requireComponent(cc.Label)
export default class LanguageLabel extends LanguageComponent {
    @property
    prefix = "";
    @property
    suffix = "";
    @property
    text = "";

    changeLanguage() {
        let label = this.getComponent(cc.Label);
        if (label) {
            label.string = this.prefix + LanguageMgr.getText(this.text) + this.suffix;
        } else {
            cc.log(`${this.node.name}挂载的节点没有label组件！`);
        }
    }
}
