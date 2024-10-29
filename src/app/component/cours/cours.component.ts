import { Component } from '@angular/core';
import { BtcchartComponent } from '../btcchart/btcchart.component';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-cours',
	standalone: true,
	imports: [BtcchartComponent],
	templateUrl: './cours.component.html',
	styleUrl: './cours.component.css'
})
export class CoursComponent {

	constructor() { }

	// obs.subscribe(()=>{console.log("done")});

}
