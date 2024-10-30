import { Component } from '@angular/core';
import { WalletService } from '../../service/wallet.service';
import { BitcoinService } from '../../service/bitcoin.service';

@Component({
	selector: 'app-wallet',
	standalone: true,
	imports: [],
	templateUrl: './wallet.component.html',
	styleUrl: './wallet.component.css'
})
export class WalletComponent {

	constructor(public wallet: WalletService, public bitcoin: BitcoinService) { }

}
