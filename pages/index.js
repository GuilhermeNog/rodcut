import { useState } from "react";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [tempoRodCutIterativo, setTempoRodCutIterativo] = useState([]);
  const [tempoRodCutGuloso, setTempoRodCutGuloso] = useState([]);
  const [tamanhoVetor, setTamanhoVetor] = useState([]);

  function compararNumeros(a, b) {
    return a - b;
  }

  function rodcut_iterativo(p, n) {
    const dp = new Array(n + 1).fill(0);
    const cortes = new Array(n + 1).fill(0);
  
    for (let i = 1; i <= n; i++) {
      let max_valor = -Infinity;
  
      for (let j = 1; j <= i; j++) {
        const valor_atual = p[j - 1] + dp[i - j];
  
        if (valor_atual > max_valor) {
          max_valor = valor_atual;
          cortes[i] = j;
        }
      }
  
      dp[i] = max_valor;
    }
  
    let solucao = [];
    let tamanho = n;
  
    while (tamanho > 0) {
      solucao.push(cortes[tamanho]);
      tamanho -= cortes[tamanho];
    }
  
    return {
      custo: dp[n],
      solucao: solucao
    };
  }

  function rodcut_guloso(p, n) {
    let solucao = [];
    let custo = 0;
  
    while (n > 0) {
      let max_densidade = -Infinity;
      let melhor_corte;
  
      for (let j = 1; j <= n; j++) {
        const densidade = p[j - 1] / j;
  
        if (densidade > max_densidade) {
          max_densidade = densidade;
          melhor_corte = j;
        }
      }
  
      solucao.push(melhor_corte);
      custo += p[melhor_corte - 1];
  
      n -= melhor_corte;
    }
  
    return {
      custo: custo,
      solucao: solucao
    };
  }

  function GerarValores() {
    let valVetor = [];
    for (let j = 0; j < 10; j++) {
      valVetor.push(Math.floor(Math.random() * (20 - 1) + 1));
    }
    valVetor.sort(compararNumeros);
    return valVetor;
  }

  function LimparDados() {
    setTempoRodCutGuloso([]);
    setTempoRodCutIterativo([]);
  }

  function sortTime() {
    LimparDados();

    let tamVetor = [];
    let tempRodCutIterativo = [];
    let tempRodCutGuloso = [];
    let inicio;
    let final;
    let prices = GerarValores();

    for (let i = 1; i <= 10; i++) {
        tamVetor.push(i);
    }
    tamVetor.sort(compararNumeros);
    console.log(tamVetor);

    for (let i = 0; i < tamVetor.length; i++) {
        inicio = performance.now();
        console.log(rodcut_iterativo(prices , tamVetor[i]));
        //console.log(rodcut_iterativo([1, 3, 11, 16, 19, 10] , 6));
        final = performance.now();
        tempoRodCutIterativo.push(final - inicio);
    }

    for (let i = 0; i < tamVetor.length; i++) {
        inicio = performance.now();
        console.log(rodcut_guloso(prices , tamVetor[i]));
        //console.log(rodcut_guloso([1, 3, 11, 16, 19, 10] , 6));
        final = performance.now();
        tempoRodCutGuloso.push(final - inicio);
    }

    setTempoRodCutIterativo(tempoRodCutIterativo);
    setTempoRodCutGuloso(tempoRodCutGuloso);
    setTamanhoVetor(tamVetor);
  }

  const dataRodCut = {
    labels: tamanhoVetor,
    datasets: [
      {
        label: "Rod-Cut Iterativo",
        data: tempoRodCutIterativo,
        borderColor: "#1692E6",
        backgroundColor: "#1692E6",
      },
      {
        label: "Rod-Cut Guloso",
        data: tempoRodCutGuloso,
        borderColor: "#B72D5D",
        backgroundColor: "#B72D5D",
      },
    ],
  };

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <button
                    onClick={() => sortTime()}
                    style={{ background: "purple", color: "white", marginTop: "100px" }}
                >
                    Gerar Gráfico
                </button>
            </div>
            <h1 style={{ textAlign: "center" }}>Rod-Cut iterativo x Rod-Cut Guloso</h1>
            <div
            style={{
                marginTop: "50px",
                width: "800px",
                height: "500px",
                backgroundColor: "white",
                marginRight: "auto",
                marginLeft: "auto",
            }}
            >
          <Line
            data={dataRodCut}
            options={{
              maintainAspectRatio: false,
              scales: {},
            }}
          />
        </div>
        </>
    )
}