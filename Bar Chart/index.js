const data = [
    { name: 'John', currentScore: 80, prevScore: 75 },
    { name: 'Simon', currentScore: 76, prevScore: 71 },
    { name: 'Samantha', currentScore: 90, prevScore: 95 },
    { name: 'Patrick', currentScore: 82, prevScore: 95 },
    { name: 'Mary', currentScore: 90, prevScore: 95 },
    { name: 'Christina', currentScore: 75, prevScore: 95 },
    { name: 'Michael', currentScore: 86, prevScore: 95 }
  ];
  
  const width = 900;
  const height = 450;
  const margin = { top: 50, bottom: 50, left: 50, right: 50 };
  
  const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);
  
  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1)
  
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top])
  
  svg
    .append("g")
    .attr("fill", 'royalblue')
    .selectAll("rect")
    .data(data.sort((a, b) => d3.descending(a.currentScore, b.currentScore)))
    .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.currentScore))
      .attr('title', (d) => d.currentScore)
      .attr("class", "rect")
      .attr("height", d => y(0) - y(d.currentScore))
      .attr("width", x.bandwidth());
  
  function yAxis(g) {
    g.attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .attr("font-size", '20px')
  }
  
  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name))
      .attr("font-size", '20px')
  }
  
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.node();