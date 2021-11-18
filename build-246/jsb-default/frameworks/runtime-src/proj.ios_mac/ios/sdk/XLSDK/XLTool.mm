//
//  XLTool.m
//  xlqp-mobile
//
//  Created by luke on 2019/8/26.
//
#include <string>
#include "cocos2d.h"
using namespace cocos2d;

#import <Foundation/Foundation.h>
#import "XLTool.h"
#import "XianliaoApiManager.h"

@implementation XLTool
+(void) shareText:(NSString *)text{
    if([XianliaoApiManager isInstallXianliao]){
        XianliaoShareTextObject *textObject = [[XianliaoShareTextObject alloc] init];
        textObject.text = text;
        [XianliaoApiManager share:textObject fininshBlock:^(XianliaoShareCallBackType callBackType) {
            NSLog(@"XLTool:shareText:%ld", (long)callBackType);
        }];
    }
}

+(void) shareScreenshot{
    std::string writePath = FileUtils::getInstance()->getWritablePath();
    NSString* str = [NSString stringWithUTF8String:writePath.c_str()];
    NSString* imageName = [str stringByAppendingString:@"screen_capture.png"];
    NSData *imageData = [NSData dataWithContentsOfFile:imageName];
    
    XianliaoShareImageObject *imageObject = [[XianliaoShareImageObject alloc] init];
    imageObject.imageData = imageData;
    [XianliaoApiManager share:imageObject fininshBlock:^(XianliaoShareCallBackType callBackType) {
        NSLog(@"XLTool:shareScreenshot:%ld", (long)callBackType);
    }];
}

+(void) shareLink:(NSString *)url title:(NSString *)title content:(NSString *)content{
    XianliaoShareLinkObject *linkObject = [[XianliaoShareLinkObject alloc] init];
    linkObject.title = title;
    linkObject.linkDescription = content;
    linkObject.url = url;
    
    NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
    NSString *icon = [[infoPlist valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
    UIImage* image = [UIImage imageNamed:icon];
    linkObject.imageData = UIImagePNGRepresentation(image);
    [XianliaoApiManager share:linkObject fininshBlock:^(XianliaoShareCallBackType callBackType) {
        NSLog(@"XLTool:shareLink:%ld", (long)callBackType);
    }];
}

+(void)sendApp:(NSString *)roomToken roomId:(NSString *)roomId title:(NSString *)title text:(NSString *)text{
    XianliaoShareAppObject *appObject = [[XianliaoShareAppObject alloc] init];
    appObject.roomToken = roomToken;
    appObject.roomId = roomId;
    appObject.title = title;
    appObject.text = text;
    
    NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
    NSString *icon = [[infoPlist valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
    UIImage* image = [UIImage imageNamed:icon];
    appObject.imageData = UIImagePNGRepresentation(image);
    [XianliaoApiManager share:appObject fininshBlock:^(XianliaoShareCallBackType callBackType) {
        NSLog(@"XLTool:sendApp:%ld", (long)callBackType);
    }];
}
@end
