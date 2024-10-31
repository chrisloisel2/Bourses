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
	predictedData: { date: string; price: number }[] = [];
	minVal = 0;
	maxVal = 1;
	lastDate: Date = new Date();

	constructor(public bitcoinService: BitcoinService) {
		this.updateLimits();
		this.updateChart();
	}

	ngOnInit(): void {
		const savedData = JSON.parse(localStorage.getItem('bitcoinData') || '[]');
		this.bitcoinService.bitcoinData = savedData.slice(-60);
		this.updateLimits();
		this.updateChart();
		this.subscribeToData();
	}

	ngOnDestroy(): void {
		localStorage.setItem('bitcoinData', JSON.stringify(this.bitcoinService.bitcoinData.slice(-60)));
	}

	private subscribeToData(): void {
		this.bitcoinService.$value.subscribe((value) => {
			console.log(value);
			const newEntry = { date: new Date(value[0]).toLocaleTimeString(), price: value[4] };
			console.log(newEntry);
			this.addData(newEntry);
		});

		this.bitcoinService.$prediction.subscribe((prediction) => {
			this.updatePredictedData(prediction);
			this.updateChart();
		});
	}

	private addData(newData: { date: string; price: number }): void {
		const { bitcoinData } = this.bitcoinService;
		bitcoinData.push(newData);
		this.updateLimits();
		this.updateChart();
	}

	private updatePredictedData(prediction: number[]): void {
		this.predictedData = prediction.map((price, index) => {
			const date = new Date(this.lastDate.getTime() + (index + 1) * 60000);
			return { date: date.toLocaleTimeString(), price };
		});
	}

	private updateLimits(): void {
		const allPrices = this.bitcoinService.bitcoinData.map(item => item.price);
		this.minVal = Math.min(...allPrices) - 5;
		this.maxVal = Math.max(...allPrices) + 5;
		this.lastDate = new Date(this.bitcoinService.bitcoinData.at(-1)?.date || Date.now());
	}

	private updateChart(): void {
		this.option = {
			title: { text: 'Bitcoin Price Prediction', subtext: 'Real-time and Predicted Prices' },
			tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
			toolbox: { feature: { saveAsImage: {}, dataZoom: { yAxisIndex: 'none' }, restore: {} } },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: [
					...this.bitcoinService.bitcoinData.map(item => item.date),
					...this.predictedData.map(item => item.date)
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
					data: this.predictedData.map(item => item.price),
					lineStyle: { type: 'dashed', color: 'red' }
				}
			]
		};
	}
}
