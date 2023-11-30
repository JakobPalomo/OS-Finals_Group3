function getRoundRobinInputs() {
    const numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
  
    if (isNaN(numProcesses) || numProcesses <= 0 || numProcesses > 10) {
      const errorMsg = document.getElementById('rrError');
      errorMsg.innerHTML = 'Please enter a valid number of processes (1-10).';
      return;
    }
  
    const rrInputsDiv = document.getElementById('rrInputs');
    rrInputsDiv.innerHTML = '';
  
    for (let i = 1; i <= numProcesses; i++) {
      const processDiv = document.createElement('div');
      processDiv.innerHTML = `
        <label for="arrivalTime${i}">Process ${i} Arrival Time:</label>
        <input type="number" id="arrivalTime${i}" class="rrInput" required>
        <label for="burstTime${i}">Process ${i} Burst Time:</label>
        <input type="number" id="burstTime${i}" class="rrInput" required><br><br>
      `;
      rrInputsDiv.appendChild(processDiv);
    }
  
    const timeSliceInput = document.createElement('input');
    timeSliceInput.setAttribute('type', 'number');
    timeSliceInput.setAttribute('placeholder', 'Enter Time Slice');
    timeSliceInput.setAttribute('id', 'timeSlice');
    rrInputsDiv.appendChild(timeSliceInput);
  
    const errorMsg = document.getElementById('rrError');
    errorMsg.innerHTML = ''; // Clear previous error message if any
  }
  
  function calculateRoundRobin() {
    const numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
    const timeSlice = parseInt(document.getElementById('timeSlice').value);
  
    if (isNaN(numProcesses) || numProcesses <= 0 || numProcesses > 10 || isNaN(timeSlice) || timeSlice <= 0) {
      const errorMsg = document.getElementById('rrError');
      errorMsg.innerHTML = 'Please enter valid inputs.';
      return;
    }
  
    const arrivalTimes = [];
    const burstTimes = [];
  
    for (let i = 1; i <= numProcesses; i++) {
      const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
      const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
  
      if (isNaN(arrivalTime) || isNaN(burstTime) || arrivalTime < 0 || burstTime <= 0) {
        const errorMsg = document.getElementById('rrError');
        errorMsg.innerHTML = 'Please enter valid arrival and burst times for each process.';
        return;
      }
  
      arrivalTimes.push(arrivalTime);
      burstTimes.push(burstTime);
    }
  
    let currentTime = 0;
    let remainingProcesses = [...Array(numProcesses).keys()]; // Represents processes yet to be executed
    const ganttChart = document.getElementById('ganttChartRR');
    ganttChart.innerHTML = '';
  
    let chartContent = '';
  
    const waitingTimes = new Array(numProcesses).fill(0);
    const turnaroundTimes = new Array(numProcesses).fill(0);
  
    while (remainingProcesses.length > 0) {
      for (const processIndex of remainingProcesses) {
        if (burstTimes[processIndex] > 0) {
          const executionTime = Math.min(burstTimes[processIndex], timeSlice);
          chartContent += `<div class="block" style="width: ${executionTime * 20}px;">P${processIndex + 1}</div>`;
  
          currentTime += executionTime;
          burstTimes[processIndex] -= executionTime;
  
          if (burstTimes[processIndex] === 0) {
            turnaroundTimes[processIndex] = currentTime - arrivalTimes[processIndex];
          }
  
          remainingProcesses = remainingProcesses.filter(index => burstTimes[index] > 0);
        }
      }
    }
  
    ganttChart.innerHTML = chartContent;
  
    const totalWaitingTime = turnaroundTimes.map((turnaround, index) => turnaround - burstTimes[index]).reduce((acc, val) => acc + val, 0);
    const averageWaitingTime = totalWaitingTime / numProcesses;
    const totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
    const averageTurnaroundTime = totalTurnaroundTime / numProcesses;
  
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