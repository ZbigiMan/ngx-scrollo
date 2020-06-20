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
    [scrolloBegin]="1"
    [scrolloEnd]="100"
    [scrolloFrom]="{letterSpacing : '0vw', fontSize : '2.25em', opacity: '1'}"
    [scrolloTo]="{letterSpacing : '6vw', fontSize : '0em', opacity: '0'}"
    [scrolloEasing]="'easeOutQuad'"
    [scrolloOnBegin]="animOneOnBegin"
    [scrolloOnEnd]="animOneOnEnd"
    [scrolloOnReverseBegin]="animOneOnReverseBegin"
    [scrolloOnReverseEnd]="animOneOnReverseEnd"
    [scrolloOnProgress]="animOneOnProgress"
>
    ngx-scrollo
</h1>`
        };
    }
}
