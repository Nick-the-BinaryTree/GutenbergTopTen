const bookData = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publicationYear: 1813,
    genre: ["Romance", "Novel", "Drama", "Fiction"],
    halfCentury: "1800-1850"
  },
  {
    title: "Heart of Darkness",
    author: "Joseph Conrad",
    publicationYear: 1899,
    genre: ["Psychological Thriller", "Novella", "Fiction", "Dark"],
    halfCentury: "1851-1900"
  },
  {
    title: "Frankenstein; Or, The Modern Prometheus",
    author: "Mary Wollstonecraft Shelley",
    publicationYear: 1818,
    genre: ["Gothic", "Horror", "Fiction", "Dark", "Science Fiction", "Novel"],
    halfCentury: "1800-1850"
  },
  {
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    publicationYear: 1859,
    genre: ["Historical Fiction", "Novel", "Fiction"],
    halfCentury: "1851-1900"
  },
  {
    title: "Moby Dick; Or, The Whale",
    author: "Herman Melville",
    publicationYear: 1851,
    genre: ["Adventure", "Novel", "Fiction", "Nautical", "Epic"],
    halfCentury: "1851-1900"
  },
  {
    title: "A Son of Mars, Vol. 1",
    author: "Arthur Griffiths",
    publicationYear: 1880,
    genre: ["Fiction", "Military", "Novel", "???"],
    halfCentury: "1851-1900"
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    publicationYear: 1865,
    genre: ["Fiction", "Children's Literature", "Fairy Tale", "Fantasy"],
    halfCentury: "1851-1900"
  },
  {
    title: "The Importance of Being Earnest: A Trivial Comedy for Serious People",
    author: "Oscar Wilde",
    publicationYear: 1895,
    genre: ["Fiction", "Comedy", "Farce", "Play"],
    halfCentury: "1851-1900"
  },
  {
    title: "The Adventures of Tom Sawyer",
    author: "Mark Twain",
    publicationYear: 1876,
    genre: ["Fiction", "Children's Literature", "Novel", "Picaresque", "Folklore"],
    halfCentury: "1851-1900"
  },
  {
    title: "The Strange Case of Dr. Jekyll and Mr. Hyde",
    author: "Louis Stevenson",
    publicationYear: 1886,
    genre: ["Fiction", "Psychological Thriller", "Dark", "Horror", "Mystery", "Gothic", "Science Fiction", "Drama", "Novella"],
    halfCentury: "1851-1900"
  }
];

let nodes = {}, links = [], defaultSize = 10;

for (let i = 0; i < bookData.length; i++) {
  nodes[bookData[i].title] = {id: bookData[i].title, color: "#6495ed", size: defaultSize};

  links.push({source: bookData[i].title, target: bookData[i].halfCentury});
  if (nodes[bookData[i].halfCentury]) nodes[bookData[i].halfCentury].size+=3;
  else nodes[bookData[i].halfCentury] = {id: bookData[i].halfCentury, color: "#7fffd4", size: defaultSize};

  for (let j = 0; j < bookData[i].genre.length; j++) {
    links.push({source: bookData[i].title, target: bookData[i].genre[j]});
    if (nodes[bookData[i].genre[j]]) nodes[bookData[i].genre[j]].size+=3;
    else nodes[bookData[i].genre[j]] = {id: bookData[i].genre[j], color: "#fa8072", size: defaultSize};
  }
}

nodes = Object.values(nodes);

window.onload = () => {
  const svg = d3.select("svg");

  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d) => d.id))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(window.innerWidth/2, window.innerHeight/2));

  const dragStarted = d => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  const dragged = d => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  const dragEnded = d => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  let link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line");

  let node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color)
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

  node.append("title").text(d => d.id);

  const ticked = () => {
    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links);

  window.addEventListener("resize", () => {
    simulation.force("center")
      .x(window.innerWidth / 2)
      .y(window.innerHeight / 2);

    simulation.alpha(0.3).restart();
  });
};
