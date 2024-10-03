import './style.css'
import * as d3 from "d3";

document.getElementById('app').innerHTML += `
<div id="container"></div>
<div id='title-text'>
  <h1>Doping in Professional Bicycle Racing</h1>
  <p>35 Fastest times up Alpe d'Huez</p>
</div>

`

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
  makeAxis(data)
  makeCircles(data);
  console.log(data)
})
.catch(error => {
  console.error('Error fetching the dataa', error);
})

const height = 800;
const width = 1200;
const padding = 50;
let scaleX
let scaleY


const makeSvg = () => {
  d3.select('#container')
  .append('svg')
  .attr('height', height)
  .attr('width', width )
  // .style('border', '1px solid red')
}


const makeCircles = data => {
  const svg =  d3.select('svg')

  svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', 9)
  .attr('cx', d => scaleX(d.Year))
  .attr('cy', (d, i) => scaleY(timeToSeconds(d.Time)) )
  .attr('fill', d => d.Doping == "" ? '#18d100' : 'red')
  .attr('stroke', 'black')
  .attr('stroke-width', '2px')


}

const timeToSeconds = timeStr => {
  const [minutes, seconds] = timeStr.split(":").map(Number)
  return minutes * 60 + seconds
}

const secondsToTime = totalSeconds => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const makeAxis = data => {
  const svg =  d3.select('svg')
  const maxYear = d3.max(data.map(d => d.Year))
  const minYear = d3.min(data.map(d => d.Year)) 


  scaleX = d3.scaleLinear()
    .domain([minYear - 1, maxYear + 1])  
    .range([padding, width - padding]);

  const axisX = d3.axisBottom(scaleX)
    .tickFormat(d3.format('d'))

  svg.append('g')
    .attr("transform", `translate(0, ${height - padding})`)
    .attr('id', 'x-axis')
    .call(axisX)


  const TimeInSeconds = data.map(d => timeToSeconds(d.Time))

  scaleY = d3.scaleLinear()
    .domain([d3.max(TimeInSeconds) + 10, d3.min(TimeInSeconds)+ 20])
    .range([height - padding, padding])

  const axisY = d3.axisLeft(scaleY)
  .tickFormat(secondsToTime)


  svg.append('g')
  .attr("transform", `translate(${padding}, 0)`)
  .attr('id', 'y-axis')
  .call(axisY)
}
