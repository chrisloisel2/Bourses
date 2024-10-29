import { Component, importProvidersFrom, OnInit } from '@angular/core';
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
export class BtcchartComponent {
	option: EChartsOption = {};
	buffer: any[] = [];


	constructor(public bitcoin: BitcoinService) {
		this.buffer = this.bitcoin.bitcoinData;
		this.bitcoin.$value.subscribe((value) => {
			this.buffer.push({ date: new Date().toLocaleTimeString(), price: value });
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
					axisLabel: {
						formatter: '{value} $'
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
		});
	}
}
