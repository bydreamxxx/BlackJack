<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta name="format-detection" content="telephone=no" />
<link rel="stylesheet" href="css1.css" type="text/css" media="screen" />
    <script type="text/javascript" src="jquery-1.9.1.min.js"></script>

<script type="text/javascript">
adaptation(750);
//适配
function adaptation(size){
    if(document.documentElement.clientWidth>size){
        document.documentElement.style.fontSize=size/7.5+'px';
    }else{
        document.documentElement.style.fontSize=document.documentElement.clientWidth/7.5+'px';
    }
}
$(window).resize(function(){
    adaptation(750);
})
</script>
</head><body>
<div style="display:none" id="infoDiv" da-order_sn="0"></div>
<div class="frame_wapbox">
    <div class="gray_ceng"></div>
    <div id="tips" class="gray_ceng_zf">
        
    </div>
    <div id="arrow" class="gray_ceng_jiao">
    
    </div>
</div>
<script type="text/javascript">
$(document).ready(function() {
    // 支付页面回跳转
    $('.no_payjump').click(function() {
/*
WeixinJSBridge.invoke('closeWindow',{},function(res){
       alert(res.err_msg);
 });*/
        history.go(-1);
        
    });
});
</script>

<script src="utils.js"></script>
<script type="text/javascript">
  

// var roomid = GetQueryString("roomid");
// var clubid = GetQueryString("clubid");
// var delaytime = GetQueryString("delaytime");
// var shareParam = roomid || 0
// if(clubid!=null)
// {
//   shareParam = roomid+'_'+clubid+'_'+delaytime
// }
//   window.location.href ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92e3c6930a07a7a2&redirect_uri=http%3A%2F%2Fh5.yuejiegame.com%2F&response_type=code&scope=snsapi_userinfo&state="+shareParam+"#wechat_redirect";
      window.location.href ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92e3c6930a07a7a2&redirect_uri=http%3A%2F%2Fxlqp.yuejiegame.cn%2F&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect";



  function GetQueryString(name)
  {
       var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
       var r = window.location.search.substr(1).match(reg);
       if(r!=null)return  unescape(r[2]); return null;
  }

</script>
</body>
</html>