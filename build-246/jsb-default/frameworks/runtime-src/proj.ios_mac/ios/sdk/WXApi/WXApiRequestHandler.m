
#import "WXApi.h"
#import "WXApiRequestHandler.h"
#import "WXApiManager.h"
#import "SendMessageToWXReq+requestWithTextOrMediaMessage.h"
#import "WXMediaMessage+messageConstruct.h"

@implementation WXApiRequestHandler

#pragma mark - Public Methods

+ (BOOL)sendImageData:(NSData *)imageData
              TagName:(NSString *)tagName
           MessageExt:(NSString *)messageExt
               Action:(NSString *)action
           ThumbImage:(UIImage *)thumbImage
              InScene:(enum WXScene)scene {
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = imageData;
    
    WXMediaMessage *message = [WXMediaMessage messageWithTitle:nil
                                                   Description:nil
                                                        Object:ext
                                                    MessageExt:messageExt
                                                 MessageAction:action
                                                    ThumbImage:thumbImage
                                                      MediaTag:tagName];
    
    SendMessageToWXReq* req = [SendMessageToWXReq requestWithText:nil
                                                   OrMediaMessage:message
                                                            bText:NO
                                                          InScene:scene];
    
    return [WXApi sendReq:req];
}

+ (BOOL)sendLinkURL:(NSString *)urlString
            TagName:(NSString *)tagName
              Title:(NSString *)title
        Description:(NSString *)description
         ThumbImage:(UIImage *)thumbImage
            InScene:(enum WXScene)scene {
    
    WXWebpageObject *object = [WXWebpageObject object];
    object.webpageUrl = urlString;
    
    WXMediaMessage *message = [WXMediaMessage messageWithTitle:title
                                                   Description:description
                                                        Object:object
                                                    MessageExt:nil
                                                 MessageAction:nil
                                                    ThumbImage:thumbImage
                                                      MediaTag:tagName];
    
    SendMessageToWXReq* req = [SendMessageToWXReq requestWithText:nil
                                                   OrMediaMessage:message
                                                            bText:NO
                                                          InScene:scene];
    return [WXApi sendReq:req];
}


+ (BOOL)sendAppContentData:(NSData *)data
                   ExtInfo:(NSString *)info
                    ExtURL:(NSString *)url
                     Title:(NSString *)title
               Description:(NSString *)description
                MessageExt:(NSString *)messageExt
             MessageAction:(NSString *)action
                ThumbImage:(UIImage *)thumbImage
                   InScene:(enum WXScene)scene {
    WXAppExtendObject *ext = [WXAppExtendObject object];
    ext.extInfo = info;
    ext.url = url;
    ext.fileData = data;

    WXMediaMessage *message = [WXMediaMessage messageWithTitle:title
                                                   Description:description
                                                        Object:ext
                                                    MessageExt:messageExt
                                                 MessageAction:action
                                                    ThumbImage:thumbImage
                                                      MediaTag:nil];
    
    SendMessageToWXReq* req = [SendMessageToWXReq requestWithText:nil
                                                   OrMediaMessage:message
                                                            bText:NO
                                                          InScene:scene];
    return [WXApi sendReq:req];

}

+ (BOOL)sendAuthRequestScope:(NSString *)scope
                       State:(NSString *)state
                      OpenID:(NSString *)openID
            InViewController:(UIViewController *)viewController {
    SendAuthReq* req = [[[SendAuthReq alloc] init] autorelease];
    req.scope = scope; // @"post_timeline,sns"
    req.state = state;
    req.openID = openID;
    
    viewController = [[UIApplication sharedApplication].keyWindow rootViewController];
    
    return [WXApi sendAuthReq:req
               viewController:viewController
                     delegate:[WXApiManager sharedManager]];
}

+ (BOOL)openUrl:(NSString *)url
{
    OpenWebviewReq *req = [[OpenWebviewReq alloc] init];
    req.url = url;
    return [WXApi sendReq:req];
}
    
    
+ (BOOL)jumpToBizWebviewWithAppID:(NSString *)appID
                      Description:(NSString *)description
                        tousrname:(NSString *)tousrname
                           ExtMsg:(NSString *)extMsg {
    [WXApi registerApp:appID withDescription:description];
    JumpToBizWebviewReq *req = [[[JumpToBizWebviewReq alloc]init]autorelease];
    req.tousrname = tousrname;
    req.extMsg = extMsg;
    req.webType = WXMPWebviewType_Ad;
    return [WXApi sendReq:req];
}
    
    
+ (NSString *)jumpToWeixinPay:(NSString *)partnerId
                PrepayId:(NSString *)prepayId
                NonceStr:(NSString *)nonceStr
                TimeStamp:(NSString *)timeStamp
                Package:(NSString *)package
                Sign:(NSString *)sign
{
    // V3&V4支付流程实现
    //调起微信支付
    PayReq* req             = [[[PayReq alloc] init]autorelease];
    req.partnerId           = partnerId;
    req.prepayId            = prepayId;
    req.nonceStr            = nonceStr;
    req.timeStamp           = [timeStamp intValue];
    req.package             = package;
    req.sign                = sign;
    [WXApi sendReq:req];
    //日志输出
    NSLog(@"jumpToWeixinPay >>>\n partid=%@\nprepayid=%@\nnoncestr=%@\ntimestamp=%@\npackage=%@\nsign=%@",
              partnerId,prepayId,nonceStr,timeStamp, package, sign );
    
    return @"";
}

@end
