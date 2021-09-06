var _default_vert = require("ccShader_Default_Vert");
var _default_vert_no_mvp = require("ccShader_Default_Vert_noMVP");
var _blur_edge_detail_frag = require("ccShader_Blur_Edge_Detail_Frag");

cc.Class({
    extends: cc.Component,

    properties: {
            
    },

    onLoad(){
        this.node.scaleY = -this.node.scaleY;
        this.setRender();
    },

    start(){
        this._use();
    },

    onEnable: function () {
        if(this.needReloadRenderTexture){
            this.needReloadRenderTexture = false;

            this.setRender();
        }
    },

    onDisable(){
        this.needReloadRenderTexture = true;
    },

    setRender(){
        this.node.parent.active = false;
        let canvas = cc.find('Canvas');
        let renderTexture = null;
        if(cc.sys.isNative){//应对包含mask的截图，native与web参数不同
            renderTexture = cc.RenderTexture.create(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        }else{
            renderTexture = cc.RenderTexture.create(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH_STENCIL);
        }

        this.node.parent._sgNode.addChild(renderTexture);
        renderTexture.begin();
        canvas._sgNode.visit();
        renderTexture.end();

        let spriteFrame = renderTexture.getSprite().getSpriteFrame();
        spriteFrame.insetTop = 1;
        spriteFrame.insetBottom = 1;
        spriteFrame.insetLeft = 1;
        spriteFrame.insetRight = 1;

        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;

        //native 的某些prefab需要延时remove
        setTimeout(()=>{
            renderTexture.removeFromParent(true);
        }, 1);

        this.node.parent.active = true;
    },

    _use: function()
    {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _blur_edge_detail_frag);
            this._program.link();
            this._program.updateUniforms();
        }else{
            this._program.initWithVertexShaderByteArray(_default_vert, _blur_edge_detail_frag);

            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }

        this._uniWidthStep = this._program.getUniformLocationForName( "widthStep" );
        this._uniHeightStep = this._program.getUniformLocationForName( "heightStep" );
        this._uniStrength = this._program.getUniformLocationForName( "strength" );

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat( this._uniWidthStep , ( 1.0 / this.node.getContentSize().width ) );
            glProgram_state.setUniformFloat( this._uniHeightStep , ( 1.0 / this.node.getContentSize().height ) );
            glProgram_state.setUniformFloat(  this._uniStrength, 1.0 );
        }else{
            this._program.setUniformLocationWith1f( this._uniWidthStep, ( 1.0 / this.node.getContentSize().width ) );
            this._program.setUniformLocationWith1f( this._uniHeightStep, ( 1.0 / this.node.getContentSize().height ) );

            /* 模糊 0.5     */
            /* 模糊 1.0     */
            /* 细节 -2.0    */
            /* 细节 -5.0    */
            /* 细节 -10.0   */
            /* 边缘 2.0     */
            /* 边缘 5.0     */
            /* 边缘 10.0    */
            this._program.setUniformLocationWith1f( this._uniStrength, 1.0 );
        }
        
        this.setProgram( this.node._sgNode, this._program );
    },
    setProgram:function (node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        }else{
            node.setShaderProgram(program);    
        }
        
    
        var children = node.children;
        if (!children)
            return;
    
        for (var i = 0; i < children.length; i++)
            this.setProgram(children[i], program);
    }

});
