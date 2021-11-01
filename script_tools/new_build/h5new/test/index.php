<?php

//1.将timestamp,nonce,toke按字典顺序排序
$timestamp = $_GET['timestamp'];
$nonce = $_GET['nonce'];
$token = '';
$signature = $_GET['signature'];
$array = array($timestamp,$nonce,$token);
//2.将排序后的三个参数拼接之后用sha1加密
$tmpstr = implode('',$array);
$tmpstr = sha1($tmpstr);
//3.将加密后的字符串与signature进行对比，判断该请求是否来自微信
if($tmpstr == $signature){
    header('content-type:text');
    echo $_GET['echostr'];
    exit;
}


// Header("Content-type: application/octet-stream;charset=utf-8");
require_once "jssdk.php";
$jssdk = new JSSDK("wx92e3c6930a07a7a2", "a3d56ab5ecbc30f0660f59fe643d35ae");
$signPackage = $jssdk->GetSignPackage();
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">

  <title>巷乐游戏</title>

  <!--http://www.html5rocks.com/en/mobile/mobifying/-->
  <meta name="viewport"
        content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1,maximum-scale=1"/>

  <!--https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html-->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="format-detection" content="telephone=no">

  <!-- force webkit on 360 -->
  <meta name="renderer" content="webkit"/>
  <meta name="force-rendering" content="webkit"/>
  <!-- force edge on IE -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <meta name="msapplication-tap-highlight" content="no">

  <!-- force full screen on some browser -->
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  <meta name="360-fullscreen" content="true"/>
  
  <!-- force screen orientation on some browser -->
  <meta name="screen-orientation" content="landscape"/>
  <meta name="x5-orientation" content="landscape">

  <!--fix fireball/issues/3568 -->
  <!--<meta name="browsermode" content="application">-->
  <meta name="x5-page-mode" content="app">

  <!--<link rel="apple-touch-icon" href=".png" />-->
  <!--<link rel="apple-touch-icon-precomposed" href=".png" />-->

  <link rel="stylesheet" type="text/css" href="style-mobile.72851.css"/>
    <link rel="stylesheet" type="text/css" href="postbirdAlertBox.css"/>

    <script src="https://unpkg.com/vconsole/dist/vconsole.min.js"></script>
    <script>
      // VConsole will be exported to `window.VConsole` by default.
      var vConsole = new window.VConsole();
    </script>

</head>
<body style="-webkit-touch-callout: none">
  <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
  <div id="splash">
    <div class="progress-bar stripes" style="display:none;">
      <span style="width: 0%"></span>
    </div>
  </div>
  <div id="pressShare" style="position:absolute;"></div>
<script src="src/settings.80340.js" charset="utf-8"></script>
<script src="main.80495.js" charset="utf-8"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
<script src="postbirdAlertBox.js"></script>
<script>

window.localStorage.setItem("SHARE_URL",'http://xlqp.yuejiegame.cn/share.php');
 wx.config({
   debug:  false,  //调式模式，设置为ture后会直接在网页上弹出调试信息，用于排查问题
   appId: '<?php echo $signPackage["appId"];?>',
   timestamp: <?php echo $signPackage["timestamp"];?>,
   nonceStr: '<?php echo $signPackage["nonceStr"];?>',
   signature: '<?php echo $signPackage["signature"];?>',
   jsApiList: [  //需要使用的网页服务接口
       'checkJsApi',  //判断当前客户端版本是否支持指定JS接口
       'updateTimelineShareData', //分享到朋友圈
       'updateAppMessageShareData', //分享给好友
       'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'closeWindow',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
   ]
 });
 wx.ready(function () {
            wx.updateTimelineShareData({
                title: '【巷乐游戏】', // 分享标题
                link: 'http://xlqp.yuejiegame.cn/share.php', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://xlqp.yuejiegame.cn/icon.png', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }

            });

            wx.updateAppMessageShareData({
                title: '【巷乐游戏】', // 分享标题
                desc: '超好玩的棋牌游戏', // 分享描述
                link: 'http://xlqp.yuejiegame.cn/share.php', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://xlqp.yuejiegame.cn/icon.png', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
}
);
 
wx.error(function (res) {
 alert(res.errMsg);  //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
});

</script>
</body>
</html>
