function calculateSJF() {
    const processesInput = document.getElementById('processes').value;

    if (!processesInput || processesInput.trim() === '') {
      alert('Please enter valid process values.');
      return;
    }

    const processes = processesInput.split(',').map(process => parseInt(process.trim()));

    if (processes.some(process => process < 0)) {
      alert('Process values should not be negative.');
      return;
    }

    processes.sort((a, b) => a - b);

    const ganttChart = document.getElementById('ganttChart');
    ganttChart.innerHTML = '';

    let chartContent = '';
    let startTime = 0;

    const waitingTimes = new Array(processes.length).fill(0);
    const turnaroundTimes = new Array(processes.length).fill(0);

    processes.forEach((process, index) => {
      const processName = `P${index + 1}`;
      chartContent += `<div class="block" style="width: ${process * 20}px;">${processName}</div>`;
      startTime += process;

      turnaroundTimes[index] = startTime;
      waitingTimes[index] = startTime - process;
    });

    ganttChart.innerHTML = chartContent;

    const averageWaitingTime = waitingTimes.reduce((total, time) => total + time, 0) / processes.length;
    const averageTurnaroundTime = turnaroundTimes.reduce((total, time) => total + time, 0) / processes.length;

    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
      <h3>Results</h3>
      <p>Waiting Times: ${waitingTimes.join(', ')}</p>
      <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
      <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
      <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
    `;
    ganttChart.appendChild(resultsDiv);
  }

  function calculateRoundRobin() {
    const processesInput = document.getElementById('processesRR').value;
    const quantum = parseInt(document.getElementById('quantum').value);

    if (!processesInput || processesInput.trim() === '' || isNaN(quantum) || quantum <= 0) {
      alert('Please enter valid process values and a positive quantum.');
      return;
    }

    const processes = processesInput.split(',').map(process => parseInt(process.trim()));

    if (processes.some(process => process < 0)) {
      alert('Process values should not be negative.');
      return;
    }

    let remainingProcesses = [...processes];
    const ganttChart = document.getElementById('ganttChartRR');
    ganttChart.innerHTML = '';

    let chartContent = '';
    let currentTime = 0;

    const waitingTimes = new Array(processes.length).fill(0);
    const turnaroundTimes = new Array(processes.length).fill(0);

    while (remainingProcesses.length > 0) {
      for (let i = 0; i < remainingProcesses.length; i++) {
        const processTime = Math.min(quantum, remainingProcesses[i]);

        chartContent += `<div class="block" style="width: ${processTime * 20}px;">P${i + 1}</div>`;
        currentTime += processTime;
        remainingProcesses[i] -= processTime;

        if (remainingProcesses[i] === 0) {
          turnaroundTimes[i] = currentTime;
        } else {
          waitingTimes[i] += currentTime - (processes.length - remainingProcesses.length) * quantum - waitingTimes.reduce((a, b) => a + b, 0);
        }

        if (remainingProcesses[i] === 0) {
          remainingProcesses.splice(i, 1);
          i--;
        }
      }
    }

    ganttChart.innerHTML = chartContent;

    const averageWaitingTime = waitingTimes.reduce((total, time) => total + time, 0) / processes.length;
    const averageTurnaroundTime = turnaroundTimes.reduce((total, time) => total + time, 0) / processes.length;

    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
      <h3>Results</h3>
      <p>Waiting Times: ${waitingTimes.join(', ')}</p>
      <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
      <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
      <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
    `;
    ganttChart.appendChild(resultsDiv);
  }