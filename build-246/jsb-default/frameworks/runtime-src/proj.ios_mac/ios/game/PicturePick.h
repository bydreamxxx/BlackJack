//
//  PicturePick.h
//  xlqp-mobile
//
//  Created by yons on 2019/7/22.
//

#ifndef PicturePick_h
#define PicturePick_h

@interface PicturePick : NSObject
+(void)openAlbum:(NSString *)data uploadURL:(NSString *)url;
+(void)takePhoto:(NSString *)data uploadURL:(NSString *)url;
@end

#endif /* PicturePick_h */
