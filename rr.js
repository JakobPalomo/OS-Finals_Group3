function getRoundRobinInputs() {
    const numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
  
    // Validation for "Number of Processes: "
    if (isNaN(numProcesses) || numProcesses <= 0 || numProcesses > 10) {
      const errorMsg = document.getElementById('rrError');
      errorMsg.innerHTML = 'Please enter a valid number of processes (1-10).';
      return;
    }
  
    const rrInputsDiv = document.getElementById('rrInputs');
    rrInputsDiv.innerHTML = '';
  
    // Display Process Burst Time input fields
    for (let i = 1; i <= numProcesses; i++) {
      const processDiv = document.createElement('div');
      processDiv.innerHTML = `
        <label for="burstTime${i}">Process ${i} Burst Time:</label>
        <input type="number" id="burstTime${i}" class="rrInput" required><br><br>
      `;
      rrInputsDiv.appendChild(processDiv);
    }
  
    // Time quantum input field
    const timeQuantumInput = document.createElement('input');
    timeQuantumInput.setAttribute('type', 'number');
    timeQuantumInput.setAttribute('placeholder', 'Enter Time Quantum');
    timeQuantumInput.setAttribute('id', 'timeQuantum');
    rrInputsDiv.appendChild(timeQuantumInput);
  
    const errorMsg = document.getElementById('rrError');
    errorMsg.innerHTML = ''; // Clear previous error message if any
  }
  
  function calculateRoundRobin() {
    const numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
    const timeQuantum = parseInt(document.getElementById('timeQuantum').value);
  
    // Validation for inputs
    if (isNaN(numProcesses) || numProcesses <= 0 || numProcesses > 10 || isNaN(timeQuantum) || timeQuantum <= 0) {
      const errorMsg = document.getElementById('rrError');
      errorMsg.innerHTML = 'Please enter valid inputs.';
      return;
    }
  
    const burstTimes = [];
  
    // Get values of burst time input fields
    for (let i = 1; i <= numProcesses; i++) {
      const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
  
      // Validation for burst time input fields
      if (isNaN(burstTime) || burstTime <= 0) {
        const errorMsg = document.getElementById('rrError');
        errorMsg.innerHTML = 'Please enter valid arrival and burst times for each process.';
        return;
      }
  
      burstTimes.push(burstTime);
    }
  
    let currentTime = 0;
    let remainingProcesses = [...Array(numProcesses).keys()]; // Represents processes yet to be executed
    const ganttChart = document.getElementById('ganttChartRR');
    ganttChart.innerHTML = '';
  
    let chartContent = '';
  
    const responseTimesSet = new Array(numProcesses).fill(false);

    const waitingTimes = new Array(numProcesses).fill(0);
    const turnaroundTimes = new Array(numProcesses).fill(0);
    const responseTimes = new Array(numProcesses).fill(0);
  
    while (remainingProcesses.length > 0) {
      for (const processIndex of remainingProcesses) {
        if (burstTimes[processIndex] > 0) {
          const executionTime = Math.min(burstTimes[processIndex], timeQuantum);
          chartContent += `<div class="block" style="width: ${executionTime * 20}px;">P${processIndex + 1}</div>`;
          
          if (!responseTimesSet[processIndex]) {
            responseTimes[processIndex] = currentTime;
            responseTimesSet[processIndex] = true;
          }
          
          currentTime += executionTime;
          burstTimes[processIndex] -= executionTime;
         
          if (burstTimes[processIndex] > 0) {
            waitingTimes[processIndex] += executionTime;
          }

          if (burstTimes[processIndex] === 0) {
            turnaroundTimes[processIndex] = currentTime;
          }
  
          remainingProcesses = remainingProcesses.filter(index => burstTimes[index] > 0);
        }
      }
    }
  
    ganttChart.innerHTML = chartContent;
  
    const totalResponseTime = responseTimes.reduce((acc, val) => acc + val, 0);
    const averageResponseTime = totalResponseTime / numProcesses;
    const totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
    const averageWaitingTime = totalWaitingTime / numProcesses;
    const totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
    const averageTurnaroundTime = totalTurnaroundTime / numProcesses;
  
    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
      <h3>Results</h3>
      <p>Response Times: ${responseTimes.join(', ')}</p>
      <p>Waiting Times: ${waitingTimes.join(', ')}</p>
      <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
      <p>Average Response Time: ${averageResponseTime.toFixed(2)}</p>
      <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
      <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
    `;
    ganttChart.appendChild(resultsDiv);
  }