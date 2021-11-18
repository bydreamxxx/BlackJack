//
//  WXApiHandler.h
//  Texas-iPhone
//
//  Created by kory on 16/8/14.
//
//

#ifndef WxTool_h
#define WxTool_h

//#include <string>

@interface WxTool : NSObject

+ (bool) IsWXAppInstalled; //是否安装了微信

+ (void)SendScreenShot; //分享屏幕截图（给好友）

+ (void) SendScreenShotTimeline; //分享屏幕截图（到朋友圈）

+ (void)SendImageToFriend:(NSString *)path; //分享图片 给好友

+ (void)SendImageToTimeline:(NSString *)path; //分享图片 朋友圈

+ (void) SendWechatAuth; //微信登录


+ (void) SendAppContent:(NSString *)roomPassword
                  title:(NSString *)title
            description:(NSString *)description
           shareLinkUrl:(NSString *)shareLinkUrl;

//微信分享链接(聊天界面）
+ (void) SendLinkURL:(NSString *)url
               title:(NSString *)title
             content:(NSString *)content;

//微信分享链接(朋友圈）
+ (void) ShareLinkTimeline:(NSString *)url
                     title:(NSString *)title
                   content:(NSString *)content;


//拉起微信支付
+ (void) JumpToWeixinPay:(NSString *)partnerId
                prepayId:(NSString *)prepayId
                nonceStr:(NSString *)nonceStr
               timeStamp:(NSString *)timeStamp
                 package:(NSString *)package
                    sign:(NSString *)sign;


+ (void) InnerSendLinkURL:(NSString *)url
                    title:(NSString *)title
                 tcontent:(NSString *)tcontent
              targetScene:(int) targetScene;

+ (void) InnerSendScreenShot:(int) targetScene; //分享屏幕截图


@end
#endif /* WXApiHandler_h */
