import { Injectable } from '@angular/core';
import { BitcoinService } from './bitcoin.service';

@Injectable({
	providedIn: 'root'
})
export class WalletService {

	constructor(public bitcoin: BitcoinService) { }

	wallet = 1000;

	actions = 0;

	acheter(amount: number) {
		this.wallet -= amount * this.bitcoin.value;
		this.actions += amount;
	}

	vendre(amount: number) {
		this.wallet += amount * this.bitcoin.value;
		this.actions -= amount;
	}
}
