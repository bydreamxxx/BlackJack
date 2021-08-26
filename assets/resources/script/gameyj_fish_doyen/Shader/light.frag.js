/* 垂直波浪 */

module.exports =  
`
varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D CC_Texture;
void main()            
{
    vec4 texColor =  texture2D(CC_Texture, v_texCoord);
    texColor[0] = texColor[0] * 2.0;                
    texColor[1] = texColor[1] * 2.0;                
    texColor[2] = texColor[2] * 2.0;            
    gl_FragColor = v_fragmentColor * texColor;
} 
`