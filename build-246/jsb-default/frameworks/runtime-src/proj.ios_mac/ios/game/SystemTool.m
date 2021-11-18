//
//  SystemTool.m
//  xlqp-mobile
//
//  Created by yons on 2018/1/11.
//

#import "SystemTool.h"
#import "RootViewController.h"
#import "Reachability.h"
#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonDigest.h>
#import "TencentGPS.h"
#import <sys/utsname.h>

static TencentGPS* locationMgr;

@implementation SystemTool

+(BOOL)callNativeUIWithTitle:(NSString *) title andContent:(NSString *)content{
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:title message:content delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"OK", nil];
    [alertView show];
    return true;
}

+ (BOOL) setLandscape{
    RootViewController* ctrol = NULL;
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        NSArray* array=[[UIApplication sharedApplication]windows];
        UIWindow* win=[array objectAtIndex:0];
        
        UIView* ui=[[win subviews] objectAtIndex:0];
        ctrol=(RootViewController*)[ui nextResponder];
    }
    else
    {
        // use this method on ios6
        ctrol=(RootViewController*)[UIApplication sharedApplication].keyWindow.rootViewController;
    }
    return [ctrol setLandscape];
}

+ (BOOL) setPortrait{
    RootViewController* ctrol = NULL;
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        NSArray* array=[[UIApplication sharedApplication]windows];
        UIWindow* win=[array objectAtIndex:0];
        
        UIView* ui=[[win subviews] objectAtIndex:0];
        ctrol=(RootViewController*)[ui nextResponder];
    }
    else
    {
        // use this method on ios6
        ctrol=(RootViewController*)[UIApplication sharedApplication].keyWindow.rootViewController;
    }
    return [ctrol setPortrait];
}

+ (NSString*) getScreenRatio{
    CGRect rect_screen = [[UIScreen mainScreen]bounds];
    return [NSString stringWithFormat:@"%f,%f",rect_screen.size.width,rect_screen.size.height];
}

+ (void) OpenUrl:(NSString *) url{
    NSURL* URL = [NSURL URLWithString:url];
    [[UIApplication sharedApplication] openURL:URL];
}

+ (BOOL) isWifiAvailable{
    NetworkStatus netStatus = [[Reachability reachabilityForInternetConnection] currentReachabilityStatus];
    return netStatus == ReachableViaWiFi;
}

+ (BOOL) is3GAvailable{
    NetworkStatus netStatus = [[Reachability reachabilityForInternetConnection] currentReachabilityStatus];
    return netStatus == ReachableViaWWAN;
}

+ (BOOL) isNetAvailable{
    NetworkStatus netStatus = [[Reachability reachabilityForInternetConnection] currentReachabilityStatus];
    return netStatus != NotReachable;
}

+ (void) SetClipBoardContent:(NSString *) content
{
    //获得ios的剪切板
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    //改变剪切板的内容
    pasteboard.string = content;
}

+ (NSString*) GetClipBoardContent
{
    //获得ios的剪切板
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    //改变剪切板的内容
    return pasteboard.string;
}

+ (float) getBatteryLevel{
    [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];
    return [[UIDevice currentDevice] batteryLevel];
}

+ (void) StartLoadingAni:(NSString *) content{
    RootViewController* ctrol = NULL;
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        NSArray* array=[[UIApplication sharedApplication]windows];
        UIWindow* win=[array objectAtIndex:0];
        
        UIView* ui=[[win subviews] objectAtIndex:0];
        ctrol=(RootViewController*)[ui nextResponder];
    }
    else
    {
        // use this method on ios6
        ctrol=(RootViewController*)[UIApplication sharedApplication].keyWindow.rootViewController;
    }
    [ctrol startLoadingAni:content];
}

+ (void) StopLoadingAni{
    RootViewController* ctrol = NULL;
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        NSArray* array=[[UIApplication sharedApplication]windows];
        UIWindow* win=[array objectAtIndex:0];
        
        UIView* ui=[[win subviews] objectAtIndex:0];
        ctrol=(RootViewController*)[ui nextResponder];
    }
    else
    {
        // use this method on ios6
        ctrol=(RootViewController*)[UIApplication sharedApplication].keyWindow.rootViewController;
    }
    [ctrol stopLoadingAni];
}

+ (void) SetLoadingAniTips:(NSString *) content{
    RootViewController* ctrol = NULL;
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        NSArray* array=[[UIApplication sharedApplication]windows];
        UIWindow* win=[array objectAtIndex:0];
        
        UIView* ui=[[win subviews] objectAtIndex:0];
        ctrol=(RootViewController*)[ui nextResponder];
    }
    else
    {
        // use this method on ios6
        ctrol=(RootViewController*)[UIApplication sharedApplication].keyWindow.rootViewController;
    }
    [ctrol setLoadingAniTips:content];
}

+ (NSString*) getMD5ByFile:(NSString*) path {
    NSData* data = [NSData dataWithContentsOfFile: path];
    const char* srcData = (const char*)[data bytes];

    //    NSLog(@"calc md5 of filepath:%@\nfileData dataLen=%lu",path, data.length);
    unsigned char result[16] = {0};
    CC_MD5(srcData, data.length, result);

    NSMutableString* md5Str = [NSMutableString stringWithCapacity:32];
    for (int i = 0; i < 16; i++)
    {
        [md5Str appendFormat:@"%02x", result[i]];
    }
    return md5Str;
}

+ (void) captureScreenToPhotoAlbum:(NSString*) path {
    NSLog(@"截图到相册");
    UIImage* image = [UIImage imageWithContentsOfFile:path];
    UIImageWriteToSavedPhotosAlbum(image, self, @selector(image:didFinishSavingWithError:contextInfo:), (__bridge void *)self);
}

+ (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
    NSLog(@"image = %@, error = %@, contextInfo = %@", image, error, contextInfo);
}




+(void)startGpsLocation{
    locationMgr = [[TencentGPS alloc]init];
    [locationMgr startGpsLocation];
}

+(NSString*)getAdress{
    NSString* adress = [locationMgr getAdress];
    NSLog(@"详细地址：++++++++++++++++++++%@",adress);
    return adress;
}

+(float)getLatitude{
    float latitude = [locationMgr getLatitude];
    return latitude;
}

+(float)getLongitude{
    float longitude = [locationMgr getLongitude];
    return longitude;
}

+(float)getDistance:(float) nstart_Lat endLatitude:(float) nend_Lat startLongitude:(float) nstart_Long endLongitude:(float) nend_Long{
    float distance = [locationMgr getDistanceBetween:nstart_Lat
                                          endLatitude: nend_Lat
                                       startLongitude: nstart_Long
                                         endLongitude: nend_Long];
    return distance;
}

+ (void) inAppPay:(NSString*)product_id{
    RootViewController* ctrol = NULL;
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        NSArray* array=[[UIApplication sharedApplication]windows];
        UIWindow* win=[array objectAtIndex:0];
        
        UIView* ui=[[win subviews] objectAtIndex:0];
        ctrol=(RootViewController*)[ui nextResponder];
    }
    else
    {
        // use this method on ios6
        ctrol=(RootViewController*)[UIApplication sharedApplication].keyWindow.rootViewController;
    }
    [ctrol inAppPay:product_id];
}

+ (NSString*) getDeviceInfo{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceModel = [self deviceModelName];
    
    NSString *appVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    
    NSString *systemName = [UIDevice currentDevice].systemName;
    
    NSString *systemVersion = [UIDevice currentDevice].systemVersion;
    
    return [NSString stringWithFormat:@"设备型号:%@,app版本:%@,系统名称:%@,系统版本:%@",deviceModel,appVersion,systemName,systemVersion];
}

+ (NSString*)deviceModelName
{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceModel = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    
    if ([deviceModel isEqualToString:@"iPhone3,1"])    return @"iPhone 4";
    if ([deviceModel isEqualToString:@"iPhone3,2"])    return @"iPhone 4";
    if ([deviceModel isEqualToString:@"iPhone3,3"])    return @"iPhone 4";
    if ([deviceModel isEqualToString:@"iPhone4,1"])    return @"iPhone 4S";
    if ([deviceModel isEqualToString:@"iPhone5,1"])    return @"iPhone 5";
    if ([deviceModel isEqualToString:@"iPhone5,2"])    return @"iPhone 5 (GSM+CDMA)";
    if ([deviceModel isEqualToString:@"iPhone5,3"])    return @"iPhone 5c (GSM)";
    if ([deviceModel isEqualToString:@"iPhone5,4"])    return @"iPhone 5c (GSM+CDMA)";
    if ([deviceModel isEqualToString:@"iPhone6,1"])    return @"iPhone 5s (GSM)";
    if ([deviceModel isEqualToString:@"iPhone6,2"])    return @"iPhone 5s (GSM+CDMA)";
    if ([deviceModel isEqualToString:@"iPhone7,1"])    return @"iPhone 6 Plus";
    if ([deviceModel isEqualToString:@"iPhone7,2"])    return @"iPhone 6";
    if ([deviceModel isEqualToString:@"iPhone8,1"])    return @"iPhone 6s";
    if ([deviceModel isEqualToString:@"iPhone8,2"])    return @"iPhone 6s Plus";
    if ([deviceModel isEqualToString:@"iPhone8,4"])    return @"iPhone SE";
    // 日行两款手机型号均为日本独占，可能使用索尼FeliCa支付方案而不是苹果支付
    if ([deviceModel isEqualToString:@"iPhone9,1"])    return @"国行、日版、港行iPhone 7";
    if ([deviceModel isEqualToString:@"iPhone9,2"])    return @"港行、国行iPhone 7 Plus";
    if ([deviceModel isEqualToString:@"iPhone9,3"])    return @"美版、台版iPhone 7";
    if ([deviceModel isEqualToString:@"iPhone9,4"])    return @"美版、台版iPhone 7 Plus";
    if ([deviceModel isEqualToString:@"iPhone10,1"])   return @"iPhone_8";
    if ([deviceModel isEqualToString:@"iPhone10,4"])   return @"iPhone_8";
    if ([deviceModel isEqualToString:@"iPhone10,2"])   return @"iPhone_8_Plus";
    if ([deviceModel isEqualToString:@"iPhone10,5"])   return @"iPhone_8_Plus";
    if ([deviceModel isEqualToString:@"iPhone10,3"])   return @"iPhone_X";
    if ([deviceModel isEqualToString:@"iPhone10,6"])   return @"iPhone_X";
    if ([deviceModel isEqualToString:@"iPod1,1"])      return @"iPod Touch 1G";
    if ([deviceModel isEqualToString:@"iPod2,1"])      return @"iPod Touch 2G";
    if ([deviceModel isEqualToString:@"iPod3,1"])      return @"iPod Touch 3G";
    if ([deviceModel isEqualToString:@"iPod4,1"])      return @"iPod Touch 4G";
    if ([deviceModel isEqualToString:@"iPod5,1"])      return @"iPod Touch (5 Gen)";
    if ([deviceModel isEqualToString:@"iPad1,1"])      return @"iPad";
    if ([deviceModel isEqualToString:@"iPad1,2"])      return @"iPad 3G";
    if ([deviceModel isEqualToString:@"iPad2,1"])      return @"iPad 2 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad2,2"])      return @"iPad 2";
    if ([deviceModel isEqualToString:@"iPad2,3"])      return @"iPad 2 (CDMA)";
    if ([deviceModel isEqualToString:@"iPad2,4"])      return @"iPad 2";
    if ([deviceModel isEqualToString:@"iPad2,5"])      return @"iPad Mini (WiFi)";
    if ([deviceModel isEqualToString:@"iPad2,6"])      return @"iPad Mini";
    if ([deviceModel isEqualToString:@"iPad2,7"])      return @"iPad Mini (GSM+CDMA)";
    if ([deviceModel isEqualToString:@"iPad3,1"])      return @"iPad 3 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad3,2"])      return @"iPad 3 (GSM+CDMA)";
    if ([deviceModel isEqualToString:@"iPad3,3"])      return @"iPad 3";
    if ([deviceModel isEqualToString:@"iPad3,4"])      return @"iPad 4 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad3,5"])      return @"iPad 4";
    if ([deviceModel isEqualToString:@"iPad3,6"])      return @"iPad 4 (GSM+CDMA)";
    if ([deviceModel isEqualToString:@"iPad4,1"])      return @"iPad Air (WiFi)";
    if ([deviceModel isEqualToString:@"iPad4,2"])      return @"iPad Air (Cellular)";
    if ([deviceModel isEqualToString:@"iPad4,4"])      return @"iPad Mini 2 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad4,5"])      return @"iPad Mini 2 (Cellular)";
    if ([deviceModel isEqualToString:@"iPad4,6"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,7"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad4,8"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad4,9"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad5,1"])      return @"iPad Mini 4 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad5,2"])      return @"iPad Mini 4 (LTE)";
    if ([deviceModel isEqualToString:@"iPad5,3"])      return @"iPad Air 2";
    if ([deviceModel isEqualToString:@"iPad5,4"])      return @"iPad Air 2";
    if ([deviceModel isEqualToString:@"iPad6,3"])      return @"iPad Pro 9.7";
    if ([deviceModel isEqualToString:@"iPad6,4"])      return @"iPad Pro 9.7";
    if ([deviceModel isEqualToString:@"iPad6,7"])      return @"iPad Pro 12.9";
    if ([deviceModel isEqualToString:@"iPad6,8"])      return @"iPad Pro 12.9";
    
    if ([deviceModel isEqualToString:@"AppleTV2,1"])      return @"Apple TV 2";
    if ([deviceModel isEqualToString:@"AppleTV3,1"])      return @"Apple TV 3";
    if ([deviceModel isEqualToString:@"AppleTV3,2"])      return @"Apple TV 3";
    if ([deviceModel isEqualToString:@"AppleTV5,3"])      return @"Apple TV 4";
    
    if ([deviceModel isEqualToString:@"i386"])         return @"Simulator";
    if ([deviceModel isEqualToString:@"x86_64"])       return @"Simulator";
    
    return deviceModel;
}

+(NSString*)getUrl:(NSString*)originIp setGroupName:(NSString*) groupName setoriginPort:(int) originPort {
//    NSString * ip = @"";
//    int port = 0;
//    int ret = [[gameshield sharedInstance] getServerIPAndPort:&ip getPort:&port setGroupName: groupName setOriginPort: originPort setProto:IPPROTO_TCP];
//
//    NSString * url;
//    if (ret == 0) {
//        url = [[NSString alloc]initWithFormat:@"%@:%d", ip, port];
//    }else{
//        url = [[NSString alloc]initWithFormat:@"%@:%d", originIp, originPort];
//    }
    return [[NSString alloc]initWithFormat:@"%@:%d", originIp, originPort];
}
@end
