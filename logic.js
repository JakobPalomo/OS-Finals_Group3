function getNumberOfProcesses(algorithm) {
  const numberOfProcesses = parseInt(document.getElementById(algorithm === 'sjf' ? 'sjfProcessNum' : 'rrProcessNum').value);

  if (isNaN(numberOfProcesses) || numberOfProcesses <= 0) {
    const errorMsg = document.getElementById(algorithm === 'sjf' ? 'sjfError' : 'rrError');
    errorMsg.innerHTML = 'Please enter a valid number of processes.';
    return;
  }

  const inputDiv = document.getElementById(algorithm === 'sjf' ? 'sjfInput' : 'rrInput');
  inputDiv.innerHTML = '';

  for (let i = 0; i < numberOfProcesses; i++) {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'number');
    inputField.setAttribute('placeholder', `Process ${i + 1}`);
    inputField.setAttribute('id', `${algorithm === 'sjf' ? 'sjfProcess' : 'rrProcess'}${i + 1}`);
    inputDiv.appendChild(inputField);
  }
  const errorMsg = document.getElementById(algorithm === 'sjf' ? 'sjfError' : 'rrError');
  errorMsg.innerHTML = ''; // Clear previous error message if any
}

function calculateSJF() {
  const numberOfProcesses = document.getElementById('sjfInput').childElementCount;

  const processes = [];

  for (let i = 1; i <= numberOfProcesses; i++) {
    const processValue = parseInt(document.getElementById(`sjfProcess${i}`).value);

    if (isNaN(processValue) || processValue < 0) {
      const errorMsg = document.getElementById('sjfError');
      errorMsg.innerHTML = 'Process values should be positive integers.';
      return;
    }

    processes.push(processValue);
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



// Existing functions for SJF and Round Robin (as provided earlier)

function getCSCANRequests() {
  const currentPosition = parseInt(document.getElementById('currentPosition').value);
  const trackSize = parseInt(document.getElementById('trackSize').value);
  const seekRate = parseInt(document.getElementById('seekRate').value);
  const numRequests = parseInt(document.getElementById('numRequests').value);

  if (
    isNaN(currentPosition) || isNaN(trackSize) || isNaN(seekRate) ||
    isNaN(numRequests) || numRequests <= 0 || numRequests > 10 ||
    currentPosition < 0 || trackSize <= 0 || seekRate <= 0
  ) {
    const errorMsg = document.getElementById('cscanGraph');
    errorMsg.innerHTML = 'Please enter valid inputs.';
    return;
  }

  const requestsDiv = document.getElementById('cscanRequests');
  requestsDiv.innerHTML = '';

  for (let i = 0; i < numRequests; i++) {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'number');
    inputField.setAttribute('placeholder', `Request ${i + 1}`);
    inputField.setAttribute('id', `cscanRequest${i + 1}`);
    requestsDiv.appendChild(inputField);
  }
}

function calculateCSCAN() {
  const currentPosition = parseInt(document.getElementById('currentPosition').value);
  const trackSize = parseInt(document.getElementById('trackSize').value);
  const seekRate = parseInt(document.getElementById('seekRate').value);
  const numRequests = parseInt(document.getElementById('numRequests').value);

  if (
    isNaN(currentPosition) || isNaN(trackSize) || isNaN(seekRate) ||
    isNaN(numRequests) || numRequests <= 0 || numRequests > 10 ||
    currentPosition < 0 || trackSize <= 0 || seekRate <= 0
  ) {
    const errorMsg = document.getElementById('cscanGraph');
    errorMsg.innerHTML = 'Please enter valid inputs.';
    return;
  }

  const requests = [];

  for (let i = 1; i <= numRequests; i++) {
    const requestValue = parseInt(document.getElementById(`cscanRequest${i}`).value);

    if (isNaN(requestValue) || requestValue < 0 || requestValue >= trackSize) {
      const errorMsg = document.getElementById('cscanGraph');
      errorMsg.innerHTML = 'Request values should be positive integers less than track size.';
      return;
    }

    requests.push(requestValue);
  }

  requests.push(currentPosition);
  requests.sort((a, b) => a - b);

  const totalSeekSequence = [];
  const initialIndex = requests.indexOf(currentPosition);
  const forwardRequests = requests.slice(initialIndex);
  const backwardRequests = requests.slice(0, initialIndex);

  totalSeekSequence.push(...forwardRequests, trackSize - 1, 0, ...backwardRequests);
  const totalSeekTime = totalSeekSequence.reduce((acc, val, index, arr) => {
    return acc + Math.abs(arr[index + 1] - val) * seekRate;
  }, 0);

  const cscanGraph = document.getElementById('cscanGraph');
  cscanGraph.innerHTML = '';

  const graphDiv = document.createElement('div');
  graphDiv.innerHTML = `<h3>CSCAN Results</h3>
    <p>Total Seek Time: ${totalSeekTime}</p>
    <p>Seek Sequence: ${totalSeekSequence.join(', ')}</p>
  `;
  cscanGraph.appendChild(graphDiv);
}
