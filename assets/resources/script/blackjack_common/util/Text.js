const AppCfg = require('AppConfig');
var TextCfgZhCHS = require( "TextCfgZhCHS" );
var TextCfgZhCHT = require( "TextCfgZhCHT" );
var TextCfgEnUS = require( "TextCfgEnUS" );

var text = null

const LanguageType = {
	zhCHS: 1,
	zhCHT: 2,
	enUS:  3,
};

switch( AppCfg.LANGUAGE ) {
	case LanguageType.zhCHS:
		text = TextCfgZhCHS;
		break;
	case LanguageType.zhCHT:
		text = TextCfgZhCHT;
		break;
	case LanguageType.enUS:
		text = TextCfgEnUS;
		break;
	default:
		text = TextCfgZhCHS;
		break;
};

module.exports = text;