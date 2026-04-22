<script setup>

   import { Line } from 'vue-chartjs'
    import {
      Chart as ChartJS,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale
    } from 'chart.js'

    const chartData = [0, 0, 0, 0, 2, 3, 0, 0, 12, 2, 5, 8, 3, 0, 0, 10, 8, 12, 14, 7, 9]
    const displayedChartData = chartData.map(value => value === 0 ? 1 : value)
    const chartLabels = chartData.map(() => '')
    const totalNbUsage = ref(chartData.reduce((total, value) => total + value, 0))
    const totalNbUsageDays = ref(chartData.length)

    ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale)

    const data = {
      labels: chartLabels,
      datasets: [
        {
          data: displayedChartData,
          borderColor: '#2ecc71',
          borderWidth: 2,
          pointRadius: 0, // no dots
          tension: 0.2, // smooth curve
          fill: false
        }
      ]
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false 
        },
        tooltip: {
          enabled: false 
        }
      },
      scales: {
        x: {
          display: false 
        },
        y: {
          display: false 
        }
      },
      elements: {
        line: {
          borderJoinStyle: 'round'
        }
      }
    } 

</script>

<template>
    <div class="w-full">
        <h2 class="text-xl text-slate-900 font-bold">Tool Satistics</h2>
        <div class="my-6 h-20">
            <Line :data="data" :options="options"/>
        </div>
        <p class="mt-8 text-slate-600 text-md line-clamp-4">
            Used <b>{{ totalNbUsage }}</b> times in the last <b>{{ totalNbUsageDays }}</b> days
        </p>
    </div>
</template>