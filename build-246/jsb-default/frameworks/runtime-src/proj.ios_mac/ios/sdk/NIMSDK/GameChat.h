//
//  GameChat.h
//  gameyj
//
//  Created by shen on 2017/9/5.
//
//

#ifndef GameChat_h
#define GameChat_h

#import "NIMSDK.h"

@interface GameChat : NSObject<NIMChatManagerDelegate,NIMLoginManagerDelegate,NIMMediaManagerDelegate >{
}

+ (void) startRecord;
+ (void) cancelRecord;
+ (void) completeRecord;
+ (void) loginIm:(NSString*)account withToken:(NSString*)token;
+ (void) addUser:(NSString*)account;
+ (void) removeUser:(NSString*)account;
+ (void) clearUsers;

@end


#endif /* GameChat_h */
