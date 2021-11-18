//
//  XLTool.h
//  xlqp
//
//  Created by luke on 2019/8/26.
//

#ifndef XLTool_h
#define XLTool_h
@interface XLTool : NSObject
//微信分享链接(聊天界面）
+ (void) shareLink:(NSString *)url
               title:(NSString *)title
             content:(NSString *)content;
+ (void) shareText:(NSString *)text;
+ (void) shareScreenshot;
+ (void) sendApp:(NSString *)roomToken
          roomId:(NSString *)roomId
           title:(NSString *)title
            text:(NSString *)text;
@end
#endif /* XLTool_h */
