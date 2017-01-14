import { Component, Input, OnInit, OnDestroy, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { SpinnerService } from './spinner.service';

@Component({
    selector: 'rang-spinner-rx',
    template: `
        <template [ngTemplateOutlet]="getComponentTemplate()" [ngOutletContext]="{ parent: this }"></template>

        <template #default>    
            <div [hidden]="!isActive" class="sk-fading-circle">
                <div class="sk-circle1 sk-circle"></div>
                <div class="sk-circle2 sk-circle"></div>
                <div class="sk-circle3 sk-circle"></div>
                <div class="sk-circle4 sk-circle"></div>
                <div class="sk-circle5 sk-circle"></div>
                <div class="sk-circle6 sk-circle"></div>
                <div class="sk-circle7 sk-circle"></div>
                <div class="sk-circle8 sk-circle"></div>
                <div class="sk-circle9 sk-circle"></div>
                <div class="sk-circle10 sk-circle"></div>
                <div class="sk-circle11 sk-circle"></div>
                <div class="sk-circle12 sk-circle"></div>
            </div>
        </template>
    `,
    styles: [`
            .sk-fading-circle {
            /*margin: 40px auto;
            width: 40px;
            height: 40px;
            position: relative;*/

            position:fixed; 
            top:0; 
            left:0;
            z-index:5;
            /*background:rgba(0,0,0,0.6);*/
            width:100%; 
            height:100%;
            opacity:2;
            }

            .sk-fading-circle .sk-circle {
            /*width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0; */

            width: 40px;
            height: 40px;
            position: fixed;
            top: 50%;
            left: 50%;
            }

            .sk-fading-circle .sk-circle:before {
                content: '';
                display: block;
                margin: 0 auto;
                width: 15%;
                height: 15%;
                background-color: #333;
                border-radius: 100%;
                -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
                        animation: sk-circleFadeDelay 1.2s infinite ease-in-out both; 
            }

            .sk-fading-circle .sk-circle2 {
                -webkit-transform: rotate(30deg);
                    -ms-transform: rotate(30deg);
                        transform: rotate(30deg); 
            }

            .sk-fading-circle .sk-circle3 {
                -webkit-transform: rotate(60deg);
                    -ms-transform: rotate(60deg);
                        transform: rotate(60deg); 
            }

            .sk-fading-circle .sk-circle4 {
                -webkit-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                        transform: rotate(90deg); 
            }

            .sk-fading-circle .sk-circle5 {
                -webkit-transform: rotate(120deg);
                    -ms-transform: rotate(120deg);
                        transform: rotate(120deg); 
            }

            .sk-fading-circle .sk-circle6 {
                -webkit-transform: rotate(150deg);
                    -ms-transform: rotate(150deg);
                        transform: rotate(150deg); 
            }

            .sk-fading-circle .sk-circle7 {
                -webkit-transform: rotate(180deg);
                    -ms-transform: rotate(180deg);
                        transform: rotate(180deg); 
            }

            .sk-fading-circle .sk-circle8 {
                -webkit-transform: rotate(210deg);
                    -ms-transform: rotate(210deg);
                        transform: rotate(210deg); 
            }

            .sk-fading-circle .sk-circle9 {
                -webkit-transform: rotate(240deg);
                    -ms-transform: rotate(240deg);
                        transform: rotate(240deg); 
            }

            .sk-fading-circle .sk-circle10 {
                -webkit-transform: rotate(270deg);
                    -ms-transform: rotate(270deg);
                        transform: rotate(270deg); 
            }

            .sk-fading-circle .sk-circle11 {
                -webkit-transform: rotate(300deg);
                    -ms-transform: rotate(300deg);
                        transform: rotate(300deg); 
            }

            .sk-fading-circle .sk-circle12 {
                -webkit-transform: rotate(330deg);
                    -ms-transform: rotate(330deg);
                        transform: rotate(330deg); 
            }

            .sk-fading-circle .sk-circle2:before {
                -webkit-animation-delay: -1.1s;
                        animation-delay: -1.1s; 
            }

            .sk-fading-circle .sk-circle3:before {
                -webkit-animation-delay: -1s;
                        animation-delay: -1s; 
            }

            .sk-fading-circle .sk-circle4:before {
                -webkit-animation-delay: -0.9s;
                        animation-delay: -0.9s; 
            }

            .sk-fading-circle .sk-circle5:before {
                -webkit-animation-delay: -0.8s;
                        animation-delay: -0.8s; 
            }

            .sk-fading-circle .sk-circle6:before {
                -webkit-animation-delay: -0.7s;
                        animation-delay: -0.7s; 
            }

            .sk-fading-circle .sk-circle7:before {
                -webkit-animation-delay: -0.6s;
                        animation-delay: -0.6s; 
            }

            .sk-fading-circle .sk-circle8:before {
                -webkit-animation-delay: -0.5s;
                        animation-delay: -0.5s; 
            }

            .sk-fading-circle .sk-circle9:before {
                -webkit-animation-delay: -0.4s;
                        animation-delay: -0.4s; 
            }

            .sk-fading-circle .sk-circle10:before {
                -webkit-animation-delay: -0.3s;
                        animation-delay: -0.3s; 
            }

            .sk-fading-circle .sk-circle11:before {
                -webkit-animation-delay: -0.2s;
                        animation-delay: -0.2s;
            }

            .sk-fading-circle .sk-circle12:before {
                -webkit-animation-delay: -0.1s;
                        animation-delay: -0.1s; 
            }

            @-webkit-keyframes sk-circleFadeDelay {
            0%, 39%, 100% {
                opacity: 0; }
            40% {
                opacity: 1; } 
            }

            @keyframes sk-circleFadeDelay {
            0%, 39%, 100% {
                opacity: 0; }
            40% {
                opacity: 1; } 
            }    
    `]
})
export class SpinnerRxComponent implements OnInit, OnDestroy {
    @Input() public maxTime: number = 120000;

    @ViewChild('default') defaultTemplate: TemplateRef<any>;
    @ContentChild(TemplateRef) spinnerTemplate: TemplateRef<any>;

    isActive: boolean = false;

    private timer;
    private subscription: Subscription;

    constructor(private manager: SpinnerService) {
    }

    ngOnInit(): any {
        this.subscription = this.manager.channel.subscribe((showHide: boolean) => this.showOrHideIndicator(showHide));
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
        this.subscription.unsubscribe();
    }

    getComponentTemplate() {
        return this.spinnerTemplate ? this.spinnerTemplate : this.defaultTemplate;
    }

    private showOrHideIndicator(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            return;
        }

        if (this.timer) {
            return;
        }

        this.isActive = true;
        this.timer = setTimeout(() => { this.cancelTimeout(); }, this.maxTime);
    }

    private cancelTimeout(): void {
        this.isActive = false;
        clearTimeout(this.timer);
        this.timer = undefined;
    }
}
