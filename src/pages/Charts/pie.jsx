import React, { Component } from 'react'
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的饼图路由组件
 */
export default class Pie extends Component {

  getOption = () => {
    return {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 280, name: '邮件营销' },
            { value: 204, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 408, name: '搜索引擎' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }

  getOption2 = () => {
    return {
      legend: {
        top: 'bottom',
        lineStyle: {
          width: '20'
        }
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [20, 100],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 3
          },
          data: [
            { value: 335, name: '直接访问' },
            { value: 280, name: '邮件营销' },
            { value: 204, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 408, name: '搜索引擎' }
          ],
          labelLine: {
            length: 5
          }
        }
      ]
    }
  }

  render() {
    return (
      <div>
        <Card title='饼图一'>
          <ReactEcharts option={this.getOption()} style={{ height: 300 }} />
        </Card>
        <Card title='饼图二'>
          <ReactEcharts option={this.getOption2()} style={{ height: 350 }} />
        </Card>
      </div>
    )
  }
}
