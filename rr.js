function getRoundRobinInputs() {
  const numProcesses = parseInt(document.getElementById('rrNumProcesses').value);

  // Validation for "Number of Processes"
  if (isNaN(numProcesses) || numProcesses < 2 || numProcesses > 9) {
    const errorMsg = document.getElementById('rrError');
    errorMsg.innerHTML = 'Please enter a valid number of processes (2-9).';
    return;
  }

  const rrInputsDiv = document.getElementById('rrInputs');
  rrInputsDiv.innerHTML = '';

  for (let i = 1; i <= numProcesses; i++) {
    const processDiv = document.createElement('div');
    processDiv.innerHTML = `
      <label for="arrivalTime${i}">Arrival Time for Process ${i}:</label>
      <input type="number" id="arrivalTime${i}" class="rrInput" min="0" required>
      <label for="burstTime${i}">Burst Time for Process ${i}:</label>
      <input type="number" id="burstTime${i}" class="rrInput" min="1" required><br><br>
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

  const arrivalTimes = [];
  const burstTimes = [];
  let remainingBurstTimes = []; // Tracks remaining burst times
  let processQueue = []; // Queue to keep track of the processes

  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
    const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);

    arrivalTimes.push(arrivalTime);
    burstTimes.push(burstTime);
    remainingBurstTimes.push(burstTime);
    processQueue.push(i - 1);
  }

  let currentTime = 0;
  const ganttChart = document.getElementById('ganttChartRR');
  ganttChart.innerHTML = '';

  let chartContent = '';
  let responseTimes = new Array(numProcesses).fill(0);
  let waitingTimes = new Array(numProcesses).fill(0);
  let turnaroundTimes = new Array(numProcesses).fill(0);

  while (processQueue.length > 0) {
    const currentProcess = processQueue.shift();

    if (remainingBurstTimes[currentProcess] > 0) {
      const executionTime = Math.min(remainingBurstTimes[currentProcess], timeQuantum);

      chartContent += `<div class="block" style="width: ${executionTime * 20}px;">P${currentProcess + 1}</div>`;

      if (responseTimes[currentProcess] === 0) {
        responseTimes[currentProcess] = currentTime;
      }

      currentTime += executionTime;
      remainingBurstTimes[currentProcess] -= executionTime;

      if (remainingBurstTimes[currentProcess] === 0) {
        turnaroundTimes[currentProcess] = currentTime - arrivalTimes[currentProcess];
      } else {
        processQueue.push(currentProcess); // Re-add the process if it still has burst time left
      }
    }
  }

  ganttChart.innerHTML = chartContent;

  for (let i = 0; i < numProcesses; i++) {
    waitingTimes[i] = turnaroundTimes[i] - burstTimes[i];
  }

  const totalResponseTime = responseTimes.reduce((acc, val) => acc + val, 0);
  const totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
  const totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);

  const averageResponseTime = totalResponseTime / numProcesses;
  const averageWaitingTime = totalWaitingTime / numProcesses;
  const averageTurnaroundTime = totalTurnaroundTime / numProcesses;

  // Displaying results in HTML
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <h3>Results</h3>
    <p>Response Times: ${responseTimes.join(', ')}</p>
    <p>Waiting Times: ${waitingTimes.join(', ')}</p>
    <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
    <p>Average Response Time: ${averageResponseTime.toFixed(2)}</p>
    <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
    <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
  `;
}




  function resetCalculator() {
    // Reload the page
    window.location.reload();
  }
  