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

  let processes = [];

  //loop for accessing arrival and burst entries
  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
    const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);


    processes.push({
      pId: i,
      arrivalTime: arrivalTime,
      burstTime: burstTime,
      remBurstTime: burstTime,
      complete: false
    });
  }

  const ganttChart = document.getElementById('ganttChartRR');
  ganttChart.innerHTML = '';

  let chartContent = '';
  

  let waitingTimesSet = new Array(numProcesses).fill(false);
  let waitingTimes = new Array(numProcesses).fill(0);
  let turnaroundTimes = new Array(numProcesses).fill(0);
  let completed = new Array(numProcesses).fill(false);
  
  let time = 0;
  let readyQ = [];
  let currentProcess = [];

  while (true) {
    
    console.log(time);
    
    

    //pushing of processes into the ready queue
    for (let i = 0; i < numProcesses; i++) {
      if (processes[i].arrivalTime <= time) {
        //checks if process is already in the ready queue
        if (readyQ.some(process => process.pId === processes[i].pId)) {
          console.log("Process: " + processes[i].pId + " is already in queue");
        } else {
          //checks if process is already done
          if (processes[i].complete){
            console.log("Process " + processes[i].pId +" is already done");
          } else {
            if (processes[i].burstTime == processes[i].remBurstTime) {
              readyQ.push(processes[i]);
              console.log("Process: " + processes[i].pId + " pushed");
            }
          }
        }
      }
    }

    if (currentProcess[0] == undefined) {
      console.log("curentprocess = undefined");
    } else {
      readyQ.push(currentProcess[0]);
      console.log("CurrentProcess " + currentProcess[0].pId);
    }
    if (!readyQ.length > 0) {
      time++;
      continue;
    }
    let executionTime = Math.min(readyQ[0].burstTime, timeQuantum);
    //chartContent += `<div class="block" style="width: ${executionTime * 20}px;">P${readyQ[0].pId}</div>`;
    console.log("READY QUEUE: ID " + readyQ[0].pId + " AT" + readyQ[0].arrivalTime + " BT" + readyQ[0].burstTime + " RBT" + readyQ[0].remBurstTime + " C" + readyQ[0].complete);

    

    //is burst time less than or equal to time quantum
    if (readyQ[0].remBurstTime <= timeQuantum) {
      console.log("rem burst time: " + readyQ[0].remBurstTime + " is <= to time quantum");


      if (!waitingTimesSet[(readyQ[0].pId)-1]){
        waitingTimes[(readyQ[0].pId)-1] += time;
        waitingTimesSet[(readyQ[0].pId)-1] = true;
        console.log("Process ID: " + readyQ[0].pId + " WAITING TIME SET");
      }

      time += readyQ[0].remBurstTime;
      readyQ[0].remBurstTime = 0;
      readyQ[0].complete = true;
      completed[(readyQ[0].pId)-1] = true;

      turnaroundTimes[(readyQ[0].pId)-1] = time - readyQ[0].arrivalTime;

      console.log("Process " + readyQ[0].pId + " complete.");

      readyQ.shift();
    } else {
      console.log("rem burst time:" + readyQ[0].remBurstTime + " is > than time quantum");

      waitingTimes[(readyQ[0].pId)-1] -=  timeQuantum;

      time += timeQuantum;
      readyQ[0].remBurstTime -= timeQuantum;
      if (readyQ.length > 0) {
        currentProcess[0] = readyQ.shift();
      }
    }

    if (completed.every(item => item === true)) {
      console.log("ROUND ROBIN DONE");
      break;
    }

    
  }

  for (let i = 0; i < numProcesses; i++) {
    waitingTimes[i] -= processes[i].arrivalTime;
  }
  
  

  ganttChart.innerHTML = chartContent;

  //const totalResponseTime = responseTimes.reduce((acc, val) => acc + val, 0);
  const totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
  const totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);

  //const averageResponseTime = totalResponseTime / numProcesses;
  const averageWaitingTime = totalWaitingTime / numProcesses;
  const averageTurnaroundTime = totalTurnaroundTime / numProcesses;

  // Displaying results in HTML
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <h3>Results</h3>
    <p>Waiting Times: ${waitingTimes.join(', ')}</p>
    <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
    <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
    <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
  `;
}




  function resetCalculator() {
    // Reload the page
    window.location.reload();
  }
  