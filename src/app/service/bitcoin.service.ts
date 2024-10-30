import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeInterval } from 'rxjs';
import * as ccxt from 'ccxt';

@Injectable({
	providedIn: 'root'
})
export class BitcoinService {
	exchange = new ccxt.bybit();

	constructor(public http: HttpClient) {
	}

	value: any;


	bitcoinData: any[] = [];

	async fetctPrice(symbol: string) {
		const data = await this.exchange.fetchOHLCV(symbol, "1m", undefined, 1);
		console.log(data);
		return data[data.length - 1];
	}


	$value = new Observable<any[]>((observer) => {
		setInterval(async () => {
			this.value = await this.fetctPrice("BTCUSDT")
			observer.next(this.value);
			this.value = this.value[4];
			observer.closed;
		}, 2000);
	});
}
