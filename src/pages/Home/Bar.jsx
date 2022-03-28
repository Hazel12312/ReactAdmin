import React, {Component} from "react"
import { Chart, Interval, Tooltip } from 'bizcharts';

export default class Bar extends Component {
  render() {
    const data = [
      {
        year: "1月",
        sales: 38
      },
      {
        year: "2月",
        sales: 52
      },
      {
        year: "3月",
        sales: 61
      },
      {
        year: "4月",
        sales: 145
      },
      {
        year: "5月",
        sales: 48
      },
      {
        year: "6月",
        sales: 38
      },
      {
        year: "7月",
        sales: 28
      },
      {
        year: "8月",
        sales: 38
      },
      {
        year: "9月",
        sales: 68
      },
      {
        year: "10月",
        sales: 38
      },
      {
        year: "11月",
        sales: 58
      },
      {
        year: "12月",
        sales: 38
      }
    ]
    return (
      <div style={{ width: '100%', height: 275}}>
        <Chart autoFit data={data} interactions={['active-region']} padding={[30, 30, 30, 50]} >
          <Interval position="year*sales" />
          <Tooltip shared />
        </Chart>
      </div>
    )
  }
}
