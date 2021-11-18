//
//  PicturePick.m
//  xlqp-mobile
//
//  Created by yons on 2019/7/22.
//

#import "PicturePick.h"
#import "RootViewController.h"

@implementation PicturePick

+(void)openAlbum:(NSString *)data uploadURL:(NSString *)url {
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
    [ctrol openAlbum:data uploadURL:url];
}
+(void)takePhoto:(NSString *)data uploadURL:(NSString *)url{
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
    [ctrol takePhoto:data uploadURL:url];
}



@end
