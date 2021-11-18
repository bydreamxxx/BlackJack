/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#include "ScriptingCore.h"
#import "RootViewController.h"
#import "SDKWrapper.h"
#import "platform/ios/CCEAGLView-ios.h"
#import "WXApi.h"
#import "cocos-analytics/CAAgent.h"
#import "WXApi.h"
#import "WXApiManager.h"
#import "Const.h"
#import "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <Bugly/Bugly.h>
//#import <UMCommon/UMCommon.h>  // 公共组件是所有友盟产品的基础组件，必选
//#import <UMPush/UMessage.h>  // Push组件
//#import <UMCommonLog/UMCommonLogHeaders.h>
#import "XianliaoApiManager.h"

using namespace cocos2d;

@implementation AppController

Application* app = nullptr;
@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
NSString *wxinvite = @"";
/*
 App初始化
 */
- (void) appInit{
    //保持屏幕常亮
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    NSString *appid = [[NSBundle mainBundle].infoDictionary objectForKey:@"WX_appid"];
    //向微信注册
    if([WXApi registerApp:appid withDescription:@""]){
        NSLog(@"微信注册成功");
    }else{
        NSLog(@"微信注册失败");
    }
    [WXApiManager sharedManager].delegate = self;
    //闲聊注册
    [XianliaoApiManager registerApp:@"OnGPpDavD9iAI68d"];
    [XianliaoApiManager getAppFromXianliao:^(NSString *roomToken, NSString *roomId, NSNumber *openId) {
        wxinvite = [roomId copy];
//        NSString *appString = [NSString stringWithFormat:@"roomToken:%@,roomId:%@, openId:%@", roomToken, roomId, openId];
//        NSLog(@"%@", appString);
//        std::string jsCallStr = cocos2d::StringUtils::format("cc.XLCallback(\"%s\",\"%s\")", [roomToken UTF8String], [roomId UTF8String]);
//        if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId()){
//            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
//        }
//        else{
//            Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
//                se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
//            });
//        }
    }];
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[SDKWrapper getInstance] application:application didFinishLaunchingWithOptions:launchOptions];
    [Bugly startWithAppId:@"450520c207"];
    [CAAgent enableDebug:NO];
    // Add the view controller's view to the window and display.
    float scale = [[UIScreen mainScreen] scale];
    CGRect bounds = [[UIScreen mainScreen] bounds];
    window = [[UIWindow alloc] initWithFrame: bounds];
    
    // cocos2d application instance
    app = new AppDelegate(bounds.size.width * scale, bounds.size.height * scale);
    app->setMultitouch(true);
    
    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
#ifdef NSFoundationVersionNumber_iOS_7_0
    _viewController.automaticallyAdjustsScrollViewInsets = NO;
    _viewController.extendedLayoutIncludesOpaqueBars = NO;
    _viewController.edgesForExtendedLayout = UIRectEdgeAll;
#else
    _viewController.wantsFullScreenLayout = YES;
#endif
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    
    //APP初始化
    [self appInit];
    //run the cocos2d-x game scene
    app->start();
    
    return YES;
}

- (void) initNimSdk{
    NSString *appKey        = @"d9ed676fd7ddd98444f45eb8b3504dfd";
    //    NSString *appKey        = @"dfa7001d309450b6e9e15f9649c27012";
    NIMSDKOption *option    = [NIMSDKOption optionWithAppKey:appKey];
    option.apnsCername      = nil;
    option.pkCername        = nil;
    [[NIMSDK sharedSDK] registerWithOption:option];
    m_gameChat = [[GameChat alloc] init];
    id<NIMChatManager> chatManager = [[NIMSDK sharedSDK] chatManager];
    [chatManager addDelegate:m_gameChat];
    id<NIMLoginManager> loginMgr = [[NIMSDK sharedSDK] loginManager];
    [loginMgr addDelegate:m_gameChat];
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr addDelegate:m_gameChat];
}
- (void)applicationWillResignActive:(UIApplication *)application {
    std::string jsCallStr = cocos2d::StringUtils::format("cc.SystemOnPause()");
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    app->onPause();
    [[SDKWrapper getInstance] applicationWillResignActive:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
//    std::string jsCallStr = cocos2d::StringUtils::format("cc.wx_enter_room_id = \"%s\"; cc.loginWithWX();", [ROOM_ID UTF8String]);
//    ROOM_ID = @"";
//    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
//    {
//        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
//    }
//    else
//    {
//        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
//
//            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
//        });
//    }
    std::string jsCallStr2 = cocos2d::StringUtils::format("cc.SystemOnResume();cc.dealWithWXInviteInfo(\"%s\");cc.loginWithWX()", [wxinvite UTF8String]);
    wxinvite = @"";
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr2.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr2](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr2.c_str());
        });
    }
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    app->onResume();
    [[SDKWrapper getInstance] applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    auto glview = (__bridge CCEAGLView*)(Director::getInstance()->getOpenGLView()->getEAGLView());
    [glview setIsBackground:YES];
    [[SDKWrapper getInstance] applicationDidEnterBackground:application];
    [CAAgent onPause];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    auto glview = (__bridge CCEAGLView*)(Director::getInstance()->getOpenGLView()->getEAGLView());
    [glview setIsBackground:NO];
    auto currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject];
    [[SDKWrapper getInstance] applicationWillEnterForeground:application];    
    [CAAgent onResume];
}

- (void)applicationWillTerminate:(UIApplication *)application {

    [[SDKWrapper getInstance] applicationWillTerminate:application];
    delete app;
    app = nil;
    [CAAgent onDestroy];
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    if([XianliaoApiManager handleOpenURL:url]){
        return YES;
    }
    return  [WXApi handleOpenURL:url delegate:[WXApiManager sharedManager]];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    NSLog(@"MySelf OpenURL");
    if([url.host isEqualToString:@"xlqp.wxinvaite.app"]){
        wxinvite = url.query;
        wxinvite = (NSString *)CFURLCreateStringByReplacingPercentEscapesUsingEncoding(NULL,
                                                                                       (__bridge CFStringRef)wxinvite,
                                                                                       CFSTR(""),
                                                                                       CFStringConvertNSStringEncodingToEncoding(NSUTF8StringEncoding));
    }
    if(wxinvite == NULL){
        wxinvite = @"";
    }
//        NSArray*array = [url.query componentsSeparatedByString:@"&"];
//        for (NSString *query in array) {
//            NSArray*_array = [query componentsSeparatedByString:@"="];
//            if (_array.count == 2) {
//                NSString* key = [_array objectAtIndex:0];
//                NSString* value = [_array objectAtIndex:1];
//                if([key isEqualToString:@"room_id"]){
//                    NSScanner *scanner = [NSScanner scannerWithString:value];
//                    int val;
//                    if([scanner scanInt:&val] && [scanner isAtEnd]){
//                        ROOM_ID=value;
//                    }else{
//                        ROOM_ID=@"";
//                    }
//                }else if([key isEqualToString:@"relativesid"]){
//                    NSScanner *scanner = [NSScanner scannerWithString:value];
//                    int val;
//                    if([scanner scanInt:&val] && [scanner isAtEnd]){
//                        CLUB_ID=value;
//                    }else{
//                        CLUB_ID=@"";
//                    }
//                }
//            }
//        }
    if([XianliaoApiManager handleOpenURL:url]){
        return YES;
    }
    //直接调用微信接口
    return [WXApi handleOpenURL:url delegate:[WXApiManager sharedManager]];
}
//-(BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//    NSArray*array = [url.query componentsSeparatedByString:@"&"];
//    for (NSString *query in array) {
//        NSArray*_array = [query componentsSeparatedByString:@"="];
//        if (_array.count == 2) {
//            NSString* key = [_array objectAtIndex:0];
//            NSString* value = [_array objectAtIndex:1];
//            if([key isEqualToString:@"room_id"]){
//                
//                NSScanner *scanner = [NSScanner scannerWithString:value];
//                int val;
//                if([scanner scanInt:&val] && [scanner isAtEnd]){
//                    ROOM_ID=value;
//                }else{
//                    ROOM_ID=@"";
//                }
//            
//                break;
//            }
//        }
//    }
//    return YES;
//}
#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}

#if __has_feature(objc_arc)
#else
- (void)dealloc {
    [window release];
    [_viewController release];
    id<NIMChatManager> chatManager = [[NIMSDK sharedSDK] chatManager];
    [chatManager removeDelegate:m_gameChat];
    id<NIMLoginManager> loginMgr = [[NIMSDK sharedSDK] loginManager];
    [loginMgr removeDelegate:m_gameChat];
    id<NIMMediaManager> mediaMgr = [[NIMSDK sharedSDK] mediaManager];
    [mediaMgr removeDelegate:m_gameChat];
    [super dealloc];
}
#endif
#pragma mark - WXApiManagerDelegate
- (void)managerDidRecvGetMessageReq:(GetMessageFromWXReq *)req {
    // 微信请求App提供内容， 需要app提供内容后使用sendRsp返回
}
- (void)managerDidRecvShowMessageReq:(ShowMessageFromWXReq *)req {
    WXMediaMessage *msg = req.message;
    //显微信请求App显示内容
    NSString *strTitle = [NSString stringWithFormat:@"微信请求App显示内容"];
    NSString *strMsg = nil;
    if ([msg.mediaObject isKindOfClass:[WXAppExtendObject class]]) {
        WXAppExtendObject *obj = msg.mediaObject;
        const char* sUrl = [obj.extInfo UTF8String];
        strMsg = [NSString stringWithFormat:@"openID: %@, 标题：%@ \n描述：%@ \nurl：%@\n附带信息：%@ \n文件大小:%lu bytes\n附加消息:%@\n", req.openID, msg.title,
                  msg.description, obj.url, obj.extInfo, (unsigned long)obj.fileData.length, msg.messageExt];
        // 微信分享的App信息（点击一键进房）
        //        DD::jsb::CallJSFunction("WeixinLaunchApp", 1, sUrl);
        std::string jsCallStr = cocos2d::StringUtils::format("cc.WeixinLaunchApp(\"%s\");", sUrl);
        if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
        {
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        }
        else
        {
            Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
                se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
            });
        }
        //        DataManager::sharedDataManager()->getGameData()->weixinLaunchUrl = sUrl;
        //        DataManager::sharedDataManager()->getGameData()->isLaunchFromWeixin = true;
        //        EventManager::sharedEventManager()->notifyEventFinished(EventTypeWxEnterRoom);
    }
    else if ([msg.mediaObject isKindOfClass:[WXWebpageObject class]]) {
        WXWebpageObject *obj = msg.mediaObject;
        strMsg = [NSString stringWithFormat:@"openID: %@, 标题：%@ \n描述：%@ \n网页地址：%@\n", req.openID, msg.title, msg.description, obj.webpageUrl];
    }
    //    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:strTitle
    //                                                    message:strMsg
    //                                                   delegate:self
    //                                          cancelButtonTitle:@"OK"
    //                                          otherButtonTitles:nil, nil];
    //    [alert show];
    //    [alert release];
}
- (void)managerDidRecvLaunchFromWXReq:(LaunchFromWXReq *)req {
    WXMediaMessage *msg = req.message;
    //从微信启动App
    NSString *strTitle = [NSString stringWithFormat:@"从微信启动"];
    NSString *strMsg = [NSString stringWithFormat:@"openID: %@, messageExt:%@", req.openID, msg.messageExt];
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:strTitle
                                                    message:strMsg
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil, nil];
    [alert show];
    [alert release];
}
- (void)managerDidRecvMessageResponse:(SendMessageToWXResp *)response {
    NSString *sCode = [NSString stringWithFormat:@"%d", response.errCode];
    //    DD::jsb::CallJSFunction("WeixinShareCallback", 1, [sCode UTF8String]);
    std::string jsCallStr = cocos2d::StringUtils::format("cc.WeixinShareCallback(\"%s\");", [sCode UTF8String]);
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
    //    NSString *strTitle = [NSString stringWithFormat:@"发送媒体消息结果"];
    //    NSString *strMsg = [NSString stringWithFormat:@"errcode:%d", response.errCode];
    //    CCLog("[WXApi] %s :%s", [strTitle UTF8String], [strMsg UTF8String]);
    //    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:strTitle
    //                                                    message:strMsg
    //                                                   delegate:self
    //                                          cancelButtonTitle:@"OK"
    //                                          otherButtonTitles:nil, nil];
    //    [alert show];
    //    [alert release];
}
- (void)managerDidRecvAddCardResponse:(AddCardToWXCardPackageResp *)response {
}
- (void)managerDidRecvChooseCardResponse:(WXChooseCardResp *)response {
}
- (void)managerDidRecvAuthResponse:(SendAuthResp *)response {
    std::string jsCallStr = cocos2d::StringUtils::format("cc.onResponseWxCode(\"%d\",\"%s\");", response.errCode,[response.code UTF8String]);
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
}
- (void)managerDidRecvWeixinPayResponse:(PayResp *)response {
    //支付返回结果，实际支付结果需要去微信服务器端查询
    //    NSString *strMsg,*strTitle = [NSString stringWithFormat:@"支付结果"];
    //    PayResp *payResp = (PayResp *)response;
    //
    //    switch (response.errCode) {
    //        case WXSuccess:
    //            strMsg = @"支付结果：成功！";
    //            NSLog(@"支付成功－PaySuccess，retcode = %d returnKey = %@", response.errCode, payResp.returnKey);
    //            break;
    //
    //        case -1:
    //            NSLog(@"支付错误:%@. retKey:%@",response.errStr, payResp.returnKey);
    //            break;
    //
    //        case -2:
    //            NSLog(@"用户取消支付:%@. retKey:%@",response.errStr, payResp.returnKey);
    //            break;
    //
    //        default:
    //            strMsg = [NSString stringWithFormat:@"支付结果：失败！retcode = %d, retstr = %@", response.errCode,response.errStr];
    //            NSLog(@"错误，retcode = %d, retstr = %@", response.errCode,response.errStr);
    //            break;
    //    }
    //
    //
    //    const char* resultVal = [[NSString stringWithFormat:@"%d", response.errCode] UTF8String];
    //    DD::jsb::CallJSFunction("WeixinPayCallback", 1, resultVal);
    //
    //    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:strTitle message:strMsg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
    //    [alert show];
    //    [alert release];
}
+(void)getWXRoomID{
    std::string jsCallStr = cocos2d::StringUtils::format("cc.dealWithWXInviteInfo(\"%s\");", [wxinvite UTF8String]);
    wxinvite = @"";
    if (std::this_thread::get_id() == Director::getInstance()->getCocos2dThreadId())
    {
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
    else
    {
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([jsCallStr](){
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        });
    }
}
+(void)callWX{
    NSURL * url = [NSURL URLWithString:@"weixin://"];
    BOOL canOpen = [[UIApplication sharedApplication] canOpenURL:url];
    //先判断是否能打开该url
    if (canOpen)
    {   //打开微信
        [[UIApplication sharedApplication] openURL:url];
    }else {
    }
}
//iOS10以下使用这两个方法接收通知，
-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    //    [UMessage setAutoAlert:NO];
    //    if([[[UIDevice currentDevice] systemVersion]intValue] < 10){
    //        [UMessage didReceiveRemoteNotification:userInfo];
    //
    //        //    self.userInfo = userInfo;
    //        //    //定制自定的的弹出框
    //        //    if([UIApplication sharedApplication].applicationState == UIApplicationStateActive)
    //        //    {
    //        //        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"标题"
    //        //                                                            message:@"Test On ApplicationStateActive"
    //        //                                                           delegate:self
    //        //                                                  cancelButtonTitle:@"确定"
    //        //                                                  otherButtonTitles:nil];
    //        //
    //        //        [alertView show];
    //        //
    //        //    }
    //        completionHandler(UIBackgroundFetchResultNewData);
    //    }
}
- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
{
}
@end
