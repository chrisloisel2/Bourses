import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoursComponent } from "../cours/cours.component";
import { WalletComponent } from "../wallet/wallet.component";
import { BitcoinService } from '../../service/bitcoin.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, CoursComponent, WalletComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'crypto';

	variable = 0;
	constructor(
		public bitcoin: BitcoinService
	) {
	}
}
