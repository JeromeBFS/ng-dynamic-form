import {Component} from '@angular/core';
import {RouterNames} from '../shared/router-names';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {ObButtonDirective} from '@oblique/oblique';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	protected readonly RouterNames = RouterNames;
}
