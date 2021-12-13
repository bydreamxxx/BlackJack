const { ccclass, menu, property, requireComponent, executeInEditMode } = cc._decorator;
import LanguageComponent from './LanguageComponent';

@ccclass
@menu("多语言/label")
@executeInEditMode(true)
@requireComponent(cc.Label)
export default class LanguageLabel extends LanguageComponent {
    @property({tooltip:"前缀(非多语言)"})
    prefix = "";
    @property({tooltip:"后缀(非多语言)"})
    suffix = "";
    @property({tooltip:"多语言文本"})
    text = "";

    changeLanguage() {
        let label = this.getComponent(cc.Label);
        if (label) {
            label.string = LanguageMgr.getText(this.prefix) + LanguageMgr.getText(this.text) + LanguageMgr.getText(this.suffix);
        } else {
            cc.log(`${this.node.name}挂载的节点没有label组件！`);
        }
    }

    setText(text, prefix, suffix){
        this.text = text ? text : "";
        this.prefix = prefix ? prefix : "";
        this.suffix = suffix ? suffix : "";

        this.changeLanguage();

        if(arguments.length > 3){
            let label = this.getComponent(cc.Label);
            if (label) {
                let str = label.string;

                for(let i = 3; i < arguments.length; i++){
                    let re = new RegExp('\\{' + (i - 3) + '\\}','gm');
                    str = str.replace(re, arguments[i]);
                }

                label.string = str;
            }
        }
    }
}
