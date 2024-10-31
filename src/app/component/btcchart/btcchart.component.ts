import { Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { BitcoinService } from '../../service/bitcoin.service';

@Component({
	selector: 'app-btcchart',
	standalone: true,
	imports: [NgxEchartsModule],
	templateUrl: './btcchart.component.html',
	styleUrls: ['./btcchart.component.css'],
	providers: [
		{
			provide: NGX_ECHARTS_CONFIG,
			useValue: {
				echarts: () => import('echarts')
			}
		}
	]
})
export class BtcchartComponent implements OnInit, OnDestroy {
	option: EChartsOption = {};
	minVal = 0;
	maxVal = 1;
	lastDate: Date = new Date();

	// Ajout du service BitcoinService
	// mettre a jour le graphique
	constructor(public bitcoinService: BitcoinService) {
		this.updateChart();
	}

	// Appelé lors de l'initialisation du composant
	ngOnInit(): void {
		// Récupération des données sauvegardées dans le local storage
		const savedData = JSON.parse(localStorage.getItem('bitcoinData') || '[]');
		// Mise à jour des données du service "bitcoinService.bitcoinData"
		this.bitcoinService.bitcoinData = savedData.slice(-60);
		// Mise à jour du graphique
		this.updateChart();
		// Souscription aux données
		this.subscribeToData();
	}

	// Fonction qui permet de lancer les observables
	subscribeToData() {
		// Lancement de l'observable "$value"
		this.bitcoinService.$value.subscribe((value) => {
			// Création d'une nouvelle entrée
			const newEntry = { date: new Date(value[0]).toLocaleTimeString(), price: value[4] };
			// Ajoute une nouvelle entrée dans le tableau "bitcoinData"
			this.bitcoinService.bitcoinData.push(newEntry);
			// Mettre a jour le graphique
			this.updateChart();
		});

		// Lancement de l'observable "$prediction"
		this.bitcoinService.$prediction.subscribe((prediction) => {
			// refresh the chart
			this.updateChart();
		});
	}

	private updatePredictedData(prediction: number[]): void {
		this.bitcoinService.predictedData = prediction.map((price, index) => {
			const date = new Date(this.lastDate.getTime() + (index + 1) * 60000);
			return { date: date.toLocaleTimeString(), price };
		});
	}

	private updateChart(): void {
		const allPrices = [
			...this.bitcoinService.bitcoinData.map(item => item.price),
			...this.bitcoinService.predictedData.map(item => item.price)
		].map(item => item.price);
		this.minVal = Math.min(...allPrices) - 5;
		this.maxVal = Math.max(...allPrices) + 5;
		this.lastDate = new Date(this.bitcoinService.bitcoinData.at(-1)?.date || Date.now());

		console.log('Updating chart', this.bitcoinService.predictedData);

		this.option = {
			title: { text: 'Bitcoin Price Prediction', subtext: 'Real-time and Predicted Prices' },
			tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
			toolbox: { feature: { saveAsImage: {}, dataZoom: { yAxisIndex: 'none' }, restore: {} } },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: [
					...this.bitcoinService.bitcoinData.map(item => item.date),
					...this.bitcoinService.predictedData.map(item => item.date)
				]
			},
			yAxis: {
				type: 'value',
				min: this.minVal,
				max: this.maxVal,
				axisLabel: { formatter: '{value} $' },
				axisPointer: { snap: true }
			},
			series: [
				{
					name: 'Bitcoin Price',
					type: 'line',
					smooth: true,
					data: this.bitcoinService.bitcoinData.map(item => item.price),
					lineStyle: { color: 'blue' }
				},
				{
					name: 'Predicted Price',
					type: 'line',
					smooth: true,
					data: [
						...this.bitcoinService.bitcoinData.map(() => undefined),
						...this.bitcoinService.predictedData.map(item => item.price)
					],
					lineStyle: { type: 'dashed', color: 'red' }
				}
			]
		};
	}


	// Appelé lors de la destruction du composant
	ngOnDestroy() {
		// Sauvegarde des données dans le local storage
		localStorage.setItem('bitcoinData', JSON.stringify(this.bitcoinService.bitcoinData.slice(-60)));
	}
}
