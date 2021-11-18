//
//  WXApiManager.m
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//
#include <string>
#include "WxTool.h"
//#include "Data/GameData.h"
//#include "Data/DataManager.h"
#include "cocos2d.h"
using namespace cocos2d;

#import "WXApiRequestHandler.h"
#import "WXApiManager.h"
#import "Constant.h"
#import "WechatAuthSDK.h"
//#import "UMSocialScreenShoter.h"
#import "Const.h"
#import "WXApi.h"

#define TEMP_BUFFER_SIZE 128

@implementation WxTool

+ (bool) IsWXAppInstalled{
    return [WXApi isWXAppInstalled];
}

+ (void) SendWXAuthReq
{
    UIViewController* viewController = NULL;
    [WXApiRequestHandler sendAuthRequestScope: @"snsapi_userinfo"
                                        State:@"123"
                                       OpenID: kAuthOpenID
                             InViewController: viewController];
}

+ (void) SendAppContent:(NSString *)roomPassword
                  title:(NSString *)title
            description:(NSString *)description
           shareLinkUrl:(NSString *)shareLinkUrl
{
    Byte* pBuffer = (Byte *)malloc(TEMP_BUFFER_SIZE);
    memset(pBuffer, 0, TEMP_BUFFER_SIZE);
    NSData* data = [NSData dataWithBytes:pBuffer length:TEMP_BUFFER_SIZE];
    free(pBuffer);
    
    NSString * buildNameStr =@"shenjing://roomid:";
    
    NSString * cmdUrl = [buildNameStr stringByAppendingString:roomPassword];
    
    UIImage *thumbImage = [UIImage imageNamed:@"WxShare.png"];
    [WXApiRequestHandler sendAppContentData:data
                                    ExtInfo: cmdUrl
                                     ExtURL: shareLinkUrl
                                      Title: title
                                Description: description
                                 MessageExt:kAppMessageExt
                              MessageAction:kAppMessageAction
                                 ThumbImage:thumbImage
                                    InScene: WXSceneSession];
}




+ (void) InnerSendLinkURL:(NSString *)url
                    title:(NSString *)title
                 tcontent:(NSString *)tcontent
              targetScene:(int) targetScene
{
    
    
    UIImage *thumbImage = [UIImage imageNamed:@"WxShare.png"];
    [WXApiRequestHandler sendLinkURL: url
                             TagName:@""
                               Title: title
                         Description: tcontent
                          ThumbImage:thumbImage
                             InScene: (WXScene)targetScene];
}

+ (void) SendLinkURL:(NSString *)url
               title:(NSString *)title
             content:(NSString *)content
{
    NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
    NSString *icon = [[infoPlist valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
    UIImage *thumbImage = [UIImage imageNamed:icon];
    [WXApiRequestHandler sendLinkURL: url
                             TagName:@""
                               Title: title
                         Description: content
                          ThumbImage:thumbImage
                             InScene: WXSceneSession];//发到>>微信聊天界面
}

+ (void) ShareLinkTimeline:(NSString *)url
                     title:(NSString *)title
                   content:(NSString *)content
{
    
    UIImage *thumbImage = [UIImage imageNamed:@"WxShare.png"];
    [WXApiRequestHandler sendLinkURL: url
                             TagName:@""
                               Title: title
                         Description: content
                          ThumbImage:thumbImage
                             InScene: WXSceneTimeline];//发到>>微信朋友圈
}

+ (void) InnerSendScreenShot:(int) targetScene
{
    //    UIImage *imageScreen = [[UMSocialScreenShoterCocos2d screenShoter] getScreenShot];
    
    std::string writePath = FileUtils::getInstance()->getWritablePath();
    //
    NSString* str = [NSString stringWithUTF8String:writePath.c_str()];
    //
    NSString* imageName = [str stringByAppendingString:@"screenshot.png"];
    //
    //    NSString *resourcePath = [[NSBundle mainBundle] resourcePath];
    //    NSString *imagepath = [resourcePath stringByAppendingPathComponent:@"screenshot.png"];
    //
    //UIImage *imageScreen = [UIImage imageWithContentFile:str1];
    //NSString *filePath = [[NSBundle mainBundle] pathForResource:str1 ofType:@"png"];
    NSData *imageData = [NSData dataWithContentsOfFile:imageName];
    //    //UIImagePNGRepresentation(imageScreen);
    
    
    //UIImage *thumbImage = [UIImage imageNamed:@"icon.png"];
    
    //缩放截图为thumb
    CGSize size = {350,200};
    UIGraphicsBeginImageContext(size);
    UIImage *imageScreen = [UIImage imageWithData:imageData];
    [imageScreen drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage* thumbImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    //    NSData *imageData = UIImagePNGRepresentation(imageScreen);
    
    [WXApiRequestHandler sendImageData:(NSData *)imageData
                               TagName:@""
                            MessageExt:nil
                                Action:nil
                            ThumbImage:thumbImage
                               InScene: (WXScene)targetScene];
    
    
    
    /*
     std::string writePath = FileUtils::getInstance()->getWritablePath();
     
     NSString* str = [NSString stringWithUTF8String:writePath.c_str()];
     
     NSString* imageName = [str stringByAppendingString:@"screenshot.png"];
     
     NSString *resourcePath = [[NSBundle mainBundle] resourcePath];
     NSString *imagepath = [resourcePath stringByAppendingPathComponent:@"screenshot.png"];
     
     WXMediaMessage *message = [WXMediaMessage message];
     
     [message setThumbImage:[UIImage imageNamed:imagepath]];
     
     
     // 缩略图
     WXImageObject *imageObject = [WXImageObject object];
     
     // NSString *filePath = [[NSBundle mainBundle] pathForResource:resourcePath ofType:@"png"];//URLForResource
     imageObject.imageData = [NSData dataWithContentsOfFile:imageName];
     UIImage* image = [UIImage imageWithData:imageObject.imageData];
     message.mediaObject = imageObject;
     // message.thumbData =  UIImagePNGRepresentation(image);
     SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
     req.bText = NO;
     req.message = message;
     req.scene = WXSceneSession;
     [WXApi sendReq: req];
     */
}

+ (void)SendScreenShot
{
    std::string writePath = FileUtils::getInstance()->getWritablePath();
    NSString* str = [NSString stringWithUTF8String:writePath.c_str()];
    NSString* imageName = [str stringByAppendingString:@"screen_capture.png"];
    NSData *imageData = [NSData dataWithContentsOfFile:imageName];
    
    CGSize size = {350,200};
    UIGraphicsBeginImageContext(size);
    UIImage *imageScreen = [UIImage imageWithData:imageData];
    [imageScreen drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage* thumbImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    [WXApiRequestHandler sendImageData:(NSData *)imageData
                               TagName:@""
                            MessageExt:nil
                                Action:nil
                            ThumbImage:thumbImage
                               InScene: WXSceneSession];
}

+ (void)SendImageToFriend:(NSString *)path
{
    NSData *imageData = [NSData dataWithContentsOfFile:path];
    
    CGSize size = {350,200};
    UIGraphicsBeginImageContext(size);
    UIImage *imageScreen = [UIImage imageWithData:imageData];
    [imageScreen drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage* thumbImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    [WXApiRequestHandler sendImageData:(NSData *)imageData
                               TagName:@""
                            MessageExt:nil
                                Action:nil
                            ThumbImage:thumbImage
                               InScene: WXSceneSession];
}

+ (void) SendImageToTimeline:(NSString *)path
{
    NSData *imageData = [NSData dataWithContentsOfFile:path];
    
    CGSize size = {350,200};
    UIGraphicsBeginImageContext(size);
    UIImage *imageScreen = [UIImage imageWithData:imageData];
    [imageScreen drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage* thumbImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    [WXApiRequestHandler sendImageData:(NSData *)imageData
                               TagName:@""
                            MessageExt:nil
                                Action:nil
                            ThumbImage:thumbImage
                               InScene: WXSceneTimeline];
}

+ (void) SendScreenShotTimeline
{
    std::string writePath = FileUtils::getInstance()->getWritablePath();
    NSString* str = [NSString stringWithUTF8String:writePath.c_str()];
    NSString* imageName = [str stringByAppendingString:@"screen_capture.png"];
    NSData *imageData = [NSData dataWithContentsOfFile:imageName];
    
    CGSize size = {350,200};
    UIGraphicsBeginImageContext(size);
    UIImage *imageScreen = [UIImage imageWithData:imageData];
    [imageScreen drawInRect:CGRectMake(0, 0, size.width, size.height)];
    UIImage* thumbImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    [WXApiRequestHandler sendImageData:(NSData *)imageData
                               TagName:@""
                            MessageExt:nil
                                Action:nil
                            ThumbImage:thumbImage
                               InScene: WXSceneTimeline];
}

+ (void) JumpToWeixinPay:(NSString *)partnerId
                prepayId:(NSString *)prepayId
                nonceStr:(NSString *)nonceStr
               timeStamp:(NSString *)timeStamp
                 package:(NSString *)package
                    sign:(NSString *)sign
{
    //    NSString * partnerIdStr =  [NSString stringWithFormat:@"%s",  partnerId.c_str() ];
    //    NSString * prepayIdStr =  [NSString stringWithFormat:@"%s",  prepayId.c_str() ];
    //    NSString * nonceStrStr =  [NSString stringWithFormat:@"%s",  nonceStr.c_str() ];
    //    NSString * timeStampStr =  [NSString stringWithFormat:@"%s",  timeStamp.c_str() ];
    //    NSString * packageStr =  [NSString stringWithFormat:@"%s",  package.c_str() ];
    //    NSString * signStr =  [NSString stringWithFormat:@"%s",  sign.c_str() ];
    //
    //    [WXApiRequestHandler jumpToWeixinPay:partnerIdStr
    //                            PrepayId:prepayIdStr
    //                            NonceStr:nonceStrStr
    //                            TimeStamp:timeStampStr
    //                            Package:packageStr
    //                            Sign: signStr
    //                    ];
    
}
@end
