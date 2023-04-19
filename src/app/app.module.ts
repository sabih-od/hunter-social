import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UtilityService } from './services/utility.service';
import { LoginPageModule } from './pages/login/login.module';
import { SignupPageModule } from './pages/signup/signup.module';
import { FormBuilder } from '@angular/forms';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { DrawerModule } from './components/drawer/drawer.module';
// import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { PusherService } from './services/pusher-service.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { QuillModule } from 'ngx-quill';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    LoginPageModule,
    SignupPageModule,
    DrawerModule,
    Ng2SearchPipeModule,
    QuillModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    FormBuilder,
    UtilityService,
    WebView,
    InAppBrowser,
    UtilityService,
    Geolocation,
    LaunchNavigator,
    // GooglePlus,
    NgxPubSubService,
    PusherService,
    Chooser,
    MediaCapture,
    File,
    Camera,
    FilePath,
    AndroidPermissions,
    Stripe,
    InAppPurchase2
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
