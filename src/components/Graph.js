import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

function Graph() {
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo"
      )
      .then((response) => {
        setPriceData({ ...response.data[`Time Series (Daily)`] });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      function renderChart() {
        const ctx = document.getElementById("myCanvas").getContext("2d");

        if (chart) {
          chart.destroy();
        }

        const chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(priceData).reverse(), // Array com as datas
            datasets: [
              {
                label: "Preço de fechamento $MSFT",
                data: Object.values(priceData)
                  .map((currentPriceObj) => currentPriceObj["4. close"])
                  .reverse(), // Array com os preços de fechamento
                borderColor: "#0330fc",
                backgroundColor: "#03b1fc",
                fill: true,
              },
            ],
          },
        });

        setChart(chartInstance);
      }

      renderChart();
    }
  }, [loading, priceData]);

  return <div>{loading ? "Carregando..." : <canvas id="myCanvas" />}</div>;
}

export default Graph;
