//
//  JavaScriptCaller.h
//  xlqp
//
//  Created by yons on 2018/7/23.
//

#ifndef JavaScriptCaller_h
#define JavaScriptCaller_h

@interface JavaScriptCaller : NSObject

/**
 *  单例
 */
+(instancetype) shareInstance;

/**
 *调用cocos js code
 */
- (void) call:(NSString*)jsCode;

@end

#endif /* JavaScriptCaller_h */
