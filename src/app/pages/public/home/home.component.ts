import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BannerComponent } from '../../../components/home/banner/banner.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [BannerComponent],
    templateUrl: './home.component.html',
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

}
