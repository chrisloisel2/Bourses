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
		let btcData: any[] = btc.map((value) => value[4]);
		this.http.post<any>('http://localhost:5000/predict', { prices: btcData }).subscribe((data) => {
			this.predictedData = data.map((price: any, index: number) => {
				const date = new Date(btc[btc.length - 1][0] + (index + 1) * 60000);
				return { date: date.toLocaleTimeString(), price };
			});
			console.log("predictedData", this.predictedData);
		});
	}

	// Ajout de la prediction
	$prediction = new Observable<any>((observer) => {
		this.predict().then((prediction) => {
			console.log("prediction obs", prediction);
			observer.next(prediction);
		});

		setInterval(() => {
			this.predict().then((prediction) => {
				observer.next(prediction);
			});
		}, 60000);
	});
}
