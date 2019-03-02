import React, {PureComponent} from 'react';
import {Bar } from 'react-chartjs-2';
import { CalciteH4 } from 'calcite-react/Elements';
import Button from 'calcite-react/Button';
import styled, { css } from 'styled-components';
import GraphBarIcon from 'calcite-ui-icons-react/GraphBarIcon';


const InfText = styled(CalciteH4)`
  color: white;
  float: left;
  width: calc(50% - 1rem);
  margin: 0;
  padding: 0.5rem;
`
const ExpBtn = styled(Button)`
  border: None;
  width: 8rem;
  margin-left: calc(50% - 8rem);
  padding-right: 0;
`
const statQuery = {
  onStatisticField: `count_`,
  outStatisticFieldName: `wt_sum`,
  statisticType: 'sum'
}

// const statQuery = query.groupByFieldsForStatistics = [ "region" ];

// let statQueries = fields.map(f => ({
//   onStatisticField: `count_`,
//   outStatisticFieldName: `wt_sum`,
//   statisticType: 'sum'
// }))
// statQueries.push({
//   onStatisticField: 'count',
//   outStatisticFieldName: 'countsum',
//   statisticType: 'sum'
// })

const getQuery = (time, poi=null) => {
  const wpoi = poi
    ? `safegraph_place_id = '${poi}'`
    : `safegraph_place_id = 'sum'`;
  const wtime = `time = ${Math.round(time)}`;
  const w = `${wpoi} AND ${wtime}`;
  return {
    where: w,
    groupByFieldsForStatistics: 'TLIFENAME',
    outStatistics: statQuery
  }
}

// const getInitQuery = () => {
//   return {
//     where: `safegraph_place_id = 'sum'`,
//     groupByFieldsForStatistics: 'TLIFENAME',
//     outStatistics: statQuery
//   }
// }


class Demographic extends PureComponent {
  constructor(props){
    super(props);
    this.lyr = props.lyr;
    this.lyrView = props.lyrView;

    this.state = {
      data: []
    }
  }

  _getChartData(res){
    if(!res || !res.features || !res.features.length) return [];
    
    const total = res.features.reduce( (p, f) => {
      if(!f.attributes.wt_sum) return p;
      return p + f.attributes.wt_sum;
    }, 0);


    const vs = res.features.reduce( (p, f) => {
      if(!f.attributes.wt_sum || !f.attributes.TLIFENAME) return p;
      if(f.attributes.TLIFENAME === 'Upscale Avenues'){
        p['UA'] += f.attributes.wt_sum / total;
      } else if (f.attributes.TLIFENAME === 'Ethnic Enclaves'){
        p['EE'] += f.attributes.wt_sum / total;
      } else if (f.attributes.TLIFENAME === 'Next Wave'){
        p['NW'] += f.attributes.wt_sum / total;
      } else {
        p['O'] += f.attributes.wt_sum / total;
      }
      return p;
    }, {
      'UA': 0,
      'EE': 0,
      'NW': 0,
      'O' : 0
    });
    
    return ([
      vs['NW'],
      vs['UA'],
      vs['EE'],
      vs['O']
    ])


    // console.log(res);
    // const total = res.features[0].attributes["countsum"];
    // const vs = fields.map(f => {
    //   const atr = `${f}_wt_sum`;
    //   // return res.features[0].attributes[atr] / total;
    //   return res.features[0].attributes[atr];
    // });
    // const total = vs.reduce((acc, a) => acc + a); 
    // return vs.map(v => v/total);
  }


  componentDidMount(){

    const q = getQuery(this.props.time, this.props.poi);

    this.lyr.queryFeatures(q)
      .then(res => {
        // console.log(this._getChartData(res));
        // console.log(res.features[0].attributes)
        this.setState({
          data: this._getChartData(res)
        })
      })
      .catch(er => console.log(er));
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.poi !== this.props.poi || prevProps.time !== this.props.time){
      this._updateChart()
    }
  }

  _updateChart(){
    const q = getQuery(this.props.time, this.props.poi);
    this.lyrView.queryFeatures(q)
      .then(res => {
        this.setState({
          data: this._getChartData(res)
        })
      })
      .catch(er => console.log(er))


    if(this.highlight){
      this.highlight.remove();
    }

    if(this.props.poi){
      this.lyrView.queryObjectIds(q)
        .then(res => {
          this.highlight = this.lyrView.highlight(res)
        })
        .catch(er => console.log(er))
    }
    
  }

  render(){
    const data = {
      labels: ['Next Wave', 'Upscale Avenues', 'Ethnic Enclaves', 'Other'],
      datasets: [{
        label: "Pattern",
        fill: false,
        data: this.state.data,
        backgroundColor: [
          "rgba(227,69,143, 0.7)",
          "rgba(192,76,253, 0.7)",
          "rgba(239,131,85, 0.7)",
          "#5E2BFF"
          // "rgba(64,249,155, 0.7)"
        ]
      }]
    }

    return(
      <div style={{textAlign: "center"}}>
        <div style={{textAlign: "left", width: "100%"}}>
          <InfText>Tapestry Profile</InfText>
          <ExpBtn
            clearWhite
            large
            icon={<GraphBarIcon filled={this.props.active}/>}
            onClick={this.props.onClick}>
            Compare
          </ExpBtn>
        </div>
        <Bar
          data={data}
          height={250}
          options={{
            scales: {
              xAxes: [{
                display: true,
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Tapestry Life Mode'
                },
                ticks: {
                  autoSkip: false,
                  minRotation: 30,
                  maxRotation: 30,
                  padding: 0
                }
              }],
              yAxes: [{
                display: true,
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Fraction'
                },
                ticks: {
                  max: 1
                }
              }]
            }
          }}
          getElementAtEvent={this._onBarClick}
        />
      </div>
    )
  }

}

export default Demographic;