export class AppConstants {
    public static get codeExamples(): object {
        return {
install:
`
npm i ngx-scrollo`,
import:
`
import { ScrolloModule } from 'ngx-scrollo';

@NgModule({
    // ...
    imports: [
        ScrolloModule,
        // ...
    ],
    // ...
})`,
html01:
`
<h1
    class="title"
    ngx-scrollo
    [tweenBegin]="1"
    [tweenEnd]="100"
    [tweenFrom]="{letterSpacing : '0vw', fontSize : '2.25em', opacity: '1'}"
    [tweenTo]="{letterSpacing : '6vw', fontSize : '0em', opacity: '0'}"
    [tweenEasing]="'easeOutQuad'"
    [tweenOnBegin]="animOneOnBegin"
    [tweenOnEnd]="animOneOnEnd"
    [tweenOnReverseBegin]="animOneOnReverseBegin"
    [tweenOnReverseEnd]="animOneOnReverseEnd"
    [tweenOnProgress]="animOneOnProgress"
>
    ngx-scrollo
</h1>`
        };
    }
}
