//
//  gameshield.h
//  gameshield
//
//
#import <UIKit/UIKit.h>

//! Project version number for libgameshield.
FOUNDATION_EXPORT double libgameshieldVersionNumber;

//! Project version string for libgameshield.
FOUNDATION_EXPORT const unsigned char libgameshieldVersionString[];

#import <Foundation/Foundation.h>

#ifndef IPPROTO_TCP
#define IPPROTO_TCP 6
#endif

#ifndef IPPROTO_UDP
#define IPPROTO_UDP 17
#endif

#define ERRNO_SUCC                      0
#define ERRNO_NO_INIT                   1
#define ERRNO_PARAMETER_ERROR           2
#define ERRNO_GROUPNAME_NOT_CONFIG      3
#define ERRNO_INVALID_KEY               4
#define ERRNO_SETCONFIGDIR_FAILED       5
#define ERRNO_SETDEVICEID_FAILED        6
#define ERRNO_CONNECTION_TIMED_OUT      7

#define ERRNO_SYSTEM_ERROR              100

@interface gameshield : NSObject

+(int)initWithKey:(NSString*)key;

+(gameshield*)sharedInstance;

-(int)getServerIPAndPort:(NSString **)ip
                       getPort:(int *)port
                   setGroupName:(NSString *)groupName
                 setOriginPort:(int)originPort
                      setProto:(int)proto;
@end
