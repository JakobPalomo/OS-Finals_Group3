function getInputs() {
  const numProcesses = document.getElementById('numProcesses').value;
  if (numProcesses <= 0 || isNaN(numProcesses)) {
    alert('Please enter a valid number of processes.');
    return;
  }

  let inputsHTML = '<h2>Enter Arrival Times and Burst Times</h2>';
  for (let i = 0; i < numProcesses; i++) {
    inputsHTML += `<div>
      <label for="arrivalTime${i}">Arrival Time for Process ${i + 1}:</label>
      <input type="number" id="arrivalTime${i}" min="0" required>
      <label for="burstTime${i}">Burst Time for Process ${i + 1}:</label>
      <input type="number" id="burstTime${i}" min="1" required>
    </div>`;
  }

  inputsHTML += '<button onclick="calculate()">Calculate</button>';
  document.getElementById('inputs').innerHTML = inputsHTML;
}

function calculate() {
  const numProcesses = document.getElementById('numProcesses').value;
  let processes = [];

  for (let i = 0; i < numProcesses; i++) {
    const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
    const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);

    if (arrivalTime < 0 || burstTime <= 0 || isNaN(arrivalTime) || isNaN(burstTime)) {
      alert('Please enter valid arrival and burst times.');
      return;
    }

    processes.push({ index: i + 1, arrival: arrivalTime, burst: burstTime, completed: false });
  }

  processes.sort((a, b) => a.arrival - b.arrival);

  let currentTime = 0;
  let completionTimes = new Array(numProcesses).fill(0);
  let turnaroundTimes = new Array(numProcesses).fill(0);
  let waitingTimes = new Array(numProcesses).fill(0);
  let ganttChartHTML = '<h2>Gantt Chart</h2><div class="gantt">';

  while (true) {
    let minBurst = Number.MAX_SAFE_INTEGER;
    let selectedProcess = -1;
    
    // Find the process with minimum burst time among the arrived and incomplete processes
    for (let i = 0; i < numProcesses; i++) {
      if (processes[i].arrival <= currentTime && processes[i].completed === false && processes[i].burst < minBurst) {
        minBurst = processes[i].burst;
        selectedProcess = i;
      }
    }

    if (selectedProcess === -1) {
      break;
    }

    const currentProcess = processes[selectedProcess];
    ganttChartHTML += `<div class="bar" style="width: ${currentProcess.burst * 20}px;">P${currentProcess.index}</div>`;

    completionTimes[selectedProcess] = currentTime + currentProcess.burst;
    currentTime = completionTimes[selectedProcess];
    currentProcess.completed = true;

    turnaroundTimes[selectedProcess] = completionTimes[selectedProcess] - currentProcess.arrival;
    waitingTimes[selectedProcess] = turnaroundTimes[selectedProcess] - currentProcess.burst;
  }

  ganttChartHTML += '</div>';

  const averageWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0) / numProcesses;
  const averageTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0) / numProcesses;

  document.getElementById('results').innerHTML = `<h2>Results</h2>
    <p>Waiting Times: ${JSON.stringify(waitingTimes)}</p>
    <p>Turnaround Times: ${JSON.stringify(turnaroundTimes)}</p>
    <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
    <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>`;
  document.getElementById('results').style.display = 'block';

  document.getElementById('ganttChart').innerHTML = ganttChartHTML;
}
