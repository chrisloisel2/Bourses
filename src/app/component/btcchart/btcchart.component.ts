import { Component, importProvidersFrom } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

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
	bitcoinData = [
		{ date: '2024-01-01', price: 16823 },
		{ date: '2024-01-02', price: 17045 },
		{ date: '2024-01-03', price: 17212 },
		{ date: '2024-01-04', price: 17356 },
		{ date: '2024-01-05', price: 17400 },
		{ date: '2024-01-06', price: 17321 },
		{ date: '2024-01-07', price: 17200 },
		{ date: '2024-01-08', price: 17520 },
		{ date: '2024-01-09', price: 17645 },
		{ date: '2024-01-10', price: 17785 },
		{ date: '2024-01-11', price: 17812 },
		{ date: '2024-01-12', price: 17923 },
		{ date: '2024-01-13', price: 17895 },
		{ date: '2024-01-14', price: 17700 },
		{ date: '2024-01-15', price: 17950 },
		{ date: '2024-01-16', price: 18000 },
		{ date: '2024-01-17', price: 18120 },
		{ date: '2024-01-18', price: 18205 },
		{ date: '2024-01-19', price: 18100 },
		{ date: '2024-01-20', price: 18020 },
		{ date: '2024-01-21', price: 17900 },
		{ date: '2024-01-22', price: 17750 },
		{ date: '2024-01-23', price: 17600 },
		{ date: '2024-01-24', price: 17580 },
		{ date: '2024-01-25', price: 17700 },
		{ date: '2024-01-26', price: 17650 },
		{ date: '2024-01-27', price: 17820 },
		{ date: '2024-01-28', price: 17980 },
		{ date: '2024-01-29', price: 18050 },
		{ date: '2024-01-30', price: 18200 },
		{ date: '2024-01-31', price: 18350 }
	];


	option: EChartsOption = {
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
			data: this.bitcoinData.map(item => item.date)
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
				data: this.bitcoinData.map(item => item.price),
				markArea: {
					itemStyle: {
						color: 'rgba(255, 173, 177, 0.4)'
					}
				}
			}
		]
	};
}