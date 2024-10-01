import './style.css'
import * as d3 from "d3";

const getData = data => {
  console.log(data + "hii")
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(data => {
  console.log(data)
})

