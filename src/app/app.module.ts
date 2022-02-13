import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { OcticonDirective } from './directives/octicon.directive';

import { SafeHtmlPipe } from './utils/pipes/safe-html.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { WrumbleComponent } from './components/wrumble/wrumble.component';

@NgModule({
    declarations: [
        AppComponent,
        
        
        
        
        
        
        
        OcticonDirective,
        
        
        
        
        
        
        SafeHtmlPipe,
        
        WrumbleComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    // providers: [
    //     { provide: Representation, useClass: JsonRepresentationComponent, multi: true },
    //     { provide: Representation, useClass: PlainTextRepresentationComponent, multi: true },
    //     { provide: Representation, useClass: HtmlClipboardRepresentationComponent, multi: true },
    //     { provide: Representation, useClass: RawClipboardDataComponent, multi: true },
    //     { provide: Representation, useClass: ImageTextComponent, multi: true },
    //     { provide: Representation, useClass: ImageContentComponent, multi: true },
    //     { provide: Representation, useClass: ImageAnnotationComponent, multi: true },
    //     { provide: Representation, useClass: LinkPreviewComponent, multi: true },
    //     { provide: CrudServiceBase, useValue: PastaStorageService, multi: true },
    //     { provide: CrudServiceBase, useValue: DrawerStorageService, multi: true }
    // ],
    bootstrap: [AppComponent]
})
export class AppModule { }
