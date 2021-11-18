//
//  TencentGPS.h
//  xlqp
//
//  Created by Mac_Li on 2018/4/17.
//
//

#ifndef TencentGPS_h
#define TencentGPS_h
#import <UIKit/UIKit.h>

@interface TencentGPS : UIViewController
-(NSString*)getAdress;
-(float)getLatitude;
-(float)getLongitude;
-(void)startGpsLocation;
-(float)getDistanceBetween:(float) nstart_Lat endLatitude:(float) nend_Lat startLongitude:(float) nstart_Long endLongitude:(float) nend_Long;
@end

#endif /* TencentGPS_h */
