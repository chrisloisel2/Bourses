import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { BitcoinService } from '../../service/bitcoin.service';
import { map, tap } from 'rxjs';

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
export class BtcchartComponent {
	option: EChartsOption = {};
	buffer: any[] = [];
	min = 0;
	max = 0;

	updateOption(value: number) {
		this.option = {
			title: {
				text: 'Bitcoin Price Over Time',
				subtext: 'Simulated Data'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: this.buffer.map(item => item.date)
			},
			yAxis: {
				type: 'value',
				max: this.max + 5,
				min: this.min - 5,
				axisLabel: {
					formatter: '{value} $',
				},
				axisPointer: {
					snap: true
				}
			},
			visualMap: {
				show: false,
				dimension: 0,
				pieces: [
					{ lte: 6, color: 'green' },
					{ gt: 6, lte: 8, color: 'red' },
					{ gt: 8, lte: 14, color: 'green' },
					{ gt: 14, lte: 17, color: 'red' },
					{ gt: 17, color: 'green' }
				]
			},
			series: [
				{
					name: 'Bitcoin Price',
					type: 'line',
					smooth: true,
					data: this.buffer.map(item => item.price),
					markArea: {
						itemStyle: {
							color: 'rgba(255, 173, 177, 0.4)'
						}
					}
				}
			]
		};
	}


	constructor(public bitcoin: BitcoinService) {
		this.buffer = this.bitcoin.bitcoinData;
		this.bitcoin.$value.pipe(
			tap((value) => {
				if (this.max === 0 && this.min === 0) {
					this.max = value[4];
					this.min = value[4];
				}
				if (value[4] > this.max) {
					this.max = value[4];
				}
				else if (value[4] < this.min) {
					this.min = value[4];
				}
			}),
			map((value) => value)
		).subscribe((value) => {
			this.buffer.push({ date: new Date(value[0]).toLocaleTimeString(), price: value[4] });
			this.updateOption(value[4]);
		});
	}
}
