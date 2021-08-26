
var shaderUtils = {
shaderPrograms: {},

	setShader: function(sprite, shaderName) {
		var glProgram = this.shaderPrograms[shaderName];
		if (!glProgram) {
			glProgram = new cc.GLProgram();
			var vert = require(cc.js.formatStr("%s.vert", shaderName));
			var frag = require(cc.js.formatStr("%s.frag", shaderName));
			// glProgram.initWithString(vert, frag);
			if (!cc.sys.isNative) {  
				glProgram.initWithVertexShaderByteArray(vert, frag);
				glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);  
				glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);  
				glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);  
			}else
			{
				glProgram.initWithString(vert,frag);
			}
			glProgram.link();  
			glProgram.updateUniforms();
			this.shaderPrograms[shaderName] = glProgram;
		}
		if(this.defaultShader == null)
			this.defaultShader = sprite._sgNode.getShaderProgram();
		sprite._sgNode.setShaderProgram(glProgram);
		return glProgram;
    },
	
    clearShader:function(sprite)
    {
		if(this.defaultShader)
        	sprite._sgNode.setShaderProgram(this.defaultShader);
    },
}
module.exports = shaderUtils;

