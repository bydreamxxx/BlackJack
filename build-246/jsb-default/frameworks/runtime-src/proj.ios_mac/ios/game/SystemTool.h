//
//  SystemTool.h
//  xlqp
//
//  Created by yons on 2018/1/11.
//

#ifndef SystemTool_h
#define SystemTool_h

#import <Foundation/Foundation.h>

@interface SystemTool : NSObject

+(BOOL)callNativeUIWithTitle:(NSString *) title andContent:(NSString *)content;

+ (BOOL)setLandscape;
+ (BOOL)setPortrait;
+ (NSString*) getScreenRatio;
+ (void) OpenUrl:(NSString *)url;
+ (BOOL) is3GAvailable;
+ (BOOL) isWifiAvailable;
+ (BOOL) isNetAvailable;
+ (NSString*) GetClipBoardContent;
+ (void) SetClipBoardContent:(NSString *) content;
+ (float) getBatteryLevel;
+ (void) StartLoadingAni:(NSString *)content;
+ (void) StopLoadingAni;
+ (void) SetLoadingAniTips:(NSString *)content;
+ (NSString*) getMD5ByFile:(NSString *) path;
+ (void) captureScreenToPhotoAlbum:(NSString *) path;
+ (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo;
+ (void)inAppPay:(NSString*)product_id;
+ (NSString*) getDeviceInfo;
+ (NSString*) deviceModelName;
+ (NSString*) getUrl:(int)originPort setGroupName:(NSString*) groupName setoriginIp:(NSString*) originIp;
@end

#endif /* SystemTool_h */
