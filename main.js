import './style.css'
import * as d3 from "d3";

document.getElementById('app').innerHTML += `
<div id='title-text'>
  <h1 id='title'>Doping in Professional Bicycle Racing</h1>
  <h3>35 Fastest times up Alpe d'Huez</h3>
</div>
<div id="container"></div>
<div id="tooltip"></div>
<div id="legend"></div>

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

const height = 550;
const width = 800;
const padding = 40;
let scaleX
let scaleY


const makeSvg = () => {
  d3.select('#container')
  .append('svg')
  .attr('height', height + 20)
  .attr('width', width )
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


  const secArr = data.map(d => d.Seconds)

  scaleY = d3.scaleTime()
    .domain([new Date(d3.max(secArr) + 10), new Date(d3.min(secArr) - 10)])
    .range([height - padding, padding])

  const axisY = d3.axisLeft(scaleY)
  .tickFormat(secondsToTime)

  svg.append('g')
  .attr("transform", `translate(${padding}, 0)`)
  .attr('id', 'y-axis')
  .call(axisY)
}


const makeCircles = data => {
  const svg =  d3.select('svg')
  const tooltip = d3.select('#tooltip')

  svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', 6)
  .attr('cx', d => scaleX(d.Year))
  .attr('cy', (d, i) => scaleY(timeToSeconds(d.Time)) )
  .attr('fill', d => d.Doping == "" ? '#18d100' : 'red')
  .attr('class', 'dot')
  .attr('data-xvalue', d => d.Year)
  .attr('data-yvalue', (d, i) => new Date(d.Seconds * 1000))
  .on('mouseover', (event, d) => {
    tooltip.style('opacity', '1')
    .html(`
      ${d.Name} </br>
      Year: ${d.Year}, Time: ${d.Time} 
      ${d.Doping ? '</br></br>' + d.Doping : ''}
      `)
    .attr('data-year', d.Year)
    .style('top', `${event.pageY + 10}px`)
    .style('left', `${event.pageX + 20}px`)
  })
  .on('mouseout', () => {
    tooltip.style('opacity', '0')
  })

  d3.select('#legend')
  .html(`
    <div class="legend-item">
      <div id='dop-al'></div>
      <p>Riders with doping allegations</p>
    </div>
    <div class="legend-item">
      <div id='no-dop-al'></div>
      <p>No doping allegations</p>
    </div>
  `)
  .append('rect')
  .attr('height', '10px')
  .attr('width', "10px")
  .attr("fill", "white")

}


