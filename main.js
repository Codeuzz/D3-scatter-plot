import './style.css'
import * as d3 from "d3";

document.getElementById('app').innerHTML += `<div id="container"></div>`

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(res => {
  if(res.ok) {
   return res.json()
  } else {
   throw new Error('Res not ok')
  }
})
.then(data => {
  makeSvg();
  makeCircles(data);
  console.log(data)
})
.catch(error => {
  console.error('Error fetching the dataa', error);
})

const height = 500;
const width = 1000;
const padding = 40;

const makeSvg = () => {
  d3.select('#container')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .style('border', '1px solid red')
  .attr('x', 100)
}


const makeCircles = data => {
  const svg =  d3.select('svg')
  svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', 7)
  .attr('cx', (d, i) => 7 * i)
  .attr('cy', (d, i) => height - parseFloat(d.Time) * 10 )
  .attr('fill', 'white')

}
