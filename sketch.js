const worldAPI = "https://pomber.github.io/covid19/timeseries.json";

function toTitleCase(str) {
  if (str == "us") return "US";
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

myPlotSketch = (p) => {
  let dates = [];
  let confirms = [];
  let points = [];
  let countryChoice = toTitleCase(document.getElementById("myInput").value);
  console.log(countryChoice);

  p.setup = () => {
    // Create the canvas
    let canvas = p.createCanvas(900, 600);
    p.background(120);

    getData().then((data) => {
      for (let i = 0; i < confirms.length; i++) {
        points[i] = new GPoint(i + 1, confirms[i]);
      }

      // Create a new plot and set its position on the screen
      let plot = new GPlot(p);
      plot.setPos(20, 20);
      plot.setDim(760, 460);

      // Set the plot title and the axis labels
      plot.setPoints(points);
      plot
        .getXAxis()
        .setAxisLabelText(
          "Days from " + dates[0] + " till " + dates[dates.length - 1]
        );
      plot.getYAxis().setAxisLabelText("No. of patients");
      plot.setTitleText("COVID-19 stats " + countryChoice);

      // Draw it!
      plot.defaultDraw();
      p.noLoop();
    });
    //.catch((err) => console.log("Error in Fetch: " + err));
  };

  async function getData() {
    let response = await fetch(worldAPI);
    let data = await response.json();

    data[countryChoice].forEach(({ date, confirmed, recovered, deaths }) => {
      // console.log(`${date} active cases: ${confirmed - recovered - deaths}`)
      dates.push(date);
      confirms.push(confirmed);
    });

    return {
      dates: dates,
      confirms: confirms,
    };
  }
};
