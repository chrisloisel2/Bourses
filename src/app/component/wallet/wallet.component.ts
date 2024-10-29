import { Component } from '@angular/core';
import { WalletService } from '../../service/wallet.service';

@Component({
	selector: 'app-wallet',
	standalone: true,
	imports: [],
	templateUrl: './wallet.component.html',
	styleUrl: './wallet.component.css'
})
export class WalletComponent {

	constructor(public wallet: WalletService) { }

}
