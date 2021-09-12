// ShaderUtil.js
var ShaderUtil = {
    shaderPrograms: {},

    setShader: function (sprite, shaderName) {
        if (!cc.sys.isNative && cc.game.config.renderMode == 1)
            return;
        var glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
            glProgram = new cc.GLProgram();
            var vert = require(cc.js.formatStr("%s.vert", shaderName));
            var frag = require(cc.js.formatStr("%s.frag", shaderName));
            if (cc.sys.isNative) {
                glProgram.initWithString(vert, frag);
            } else {
                glProgram.initWithVertexShaderByteArray(vert, frag);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            }
            glProgram.link();
            glProgram.updateUniforms();
            this.shaderPrograms[shaderName] = glProgram;
        }
        sprite._sgNode.setShaderProgram(glProgram);
    },

    /**
     * 灰显
     */
    setGrayShader: function (parent) {
        var sprites = parent.getComponentsInChildren(cc.Sprite);
        for (var i = 0; i < sprites.length; i++) {
            this.setShader(sprites[i], 'gray');
        }
    },

     /**
     * 变暗
     */
    setDarkShader: function (parent) {
        var sprites = parent.getComponentsInChildren(cc.Sprite);
        for (var i = 0; i < sprites.length; i++) {
            this.setShader(sprites[i], 'dark');
        }
    },

    /**
     * 正常
     */
    setNormalShader: function (parent) {
        var sprites = parent.getComponentsInChildren(cc.Sprite);
        for (var i = 0; i < sprites.length; i++) {
            this.setShader(sprites[i], 'normal');
        }
    },

    /**
     * 高亮
     */
    setHighlightShader: function (parent) {
        if (!cc.sys.isNative)
            return;
        var sprites = parent.getComponentsInChildren(cc.Sprite);
        for (var i = 0; i < sprites.length; i++) {
            this.setShader(sprites[i], 'highlight');
        }
    },
};

module.exports = ShaderUtil;