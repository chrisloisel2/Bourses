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
	predictedData: any[] = [];

	async fetctPrice(symbol: string, quantity: number = 1): Promise<any> {
		console.log("fetching price")
		const data = await this.exchange.fetchOHLCV(symbol, "1m", undefined, quantity);
		this.value = data[0][4];
		if (quantity > 1) {
			return data;
		}
		return data[0];
	}

	$value = new Observable<any[]>((observer) => {
		let data = this.fetctPrice("BTCUSDT", 60);
		data.then((response) => {
			this.bitcoinData = response.map((value: any) => {
				return { date: new Date(value[0]).toLocaleTimeString(), price: value[4] };
			});
		});
		console.log("data", data);
		setInterval(async () => {
			observer.next(await this.fetctPrice("BTCUSDT"));
		}, 60000);
	});

	async predict() {
		let btc: any[] = await this.fetctPrice("BTCUSDT", 60);
		console.log("btc", btc);
		let btcData: any[] = btc.map((value) => value[4]);
		console.log(btcData);
		this.http.post<any>('http://localhost:5000/predict', { prices: btcData })
			.subscribe((response) => {
				console.log(response.predicted_price);
				return response.predicted_price;
			});
	}

	// Ajout de la prediction
	$prediction = new Observable<any>((observer) => {
		observer.next(this.predict().then((response) => response));
		setInterval(async () => {
			observer.next(await this.predict());
		}, 60000);
	});
}
