function getRoundRobinInputs() {
    let numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
  
    // Validation for "Number of Processes"
    if (isNaN(numProcesses) || numProcesses < 2 || numProcesses > 9) {
      let errorMsg = document.getElementById('rrError');
      errorMsg.innerHTML = 'Please enter a valid number of processes (2-9).';
      return;
    }
  
    let rrInputsDiv = document.getElementById('rrInputs');
    rrInputsDiv.innerHTML = '';
  
    for (let i = 1; i <= numProcesses; i++) {
      let processDiv = document.createElement('div');
      processDiv.innerHTML = `
        <label for="arrivalTime${i}">Arrival Time for Process ${i}:</label>
        <input type="number" id="arrivalTime${i}" class="rrInput" min="0" required>
        <label for="burstTime${i}">Burst Time for Process ${i}:</label>
        <input type="number" id="burstTime${i}" class="rrInput" min="1" required><br><br>
      `;
      rrInputsDiv.appendChild(processDiv);
    }
  
    // Time quantum input field
    let timeQuantumInput = document.createElement('input');
    timeQuantumInput.setAttribute('type', 'number');
    timeQuantumInput.setAttribute('placeholder', 'Enter Time Quantum');
    timeQuantumInput.setAttribute('id', 'timeQuantum');
    rrInputsDiv.appendChild(timeQuantumInput);
  
    let errorMsg = document.getElementById('rrError');
    errorMsg.innerHTML = ''; // Clear previous error message if any
  }
  
    
    function calculateRoundRobin() {
        try {
            let numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
            let timeQuantum = parseInt(document.getElementById('timeQuantum').value);
          
            // Validation for inputs
            if (isNaN(numProcesses) || numProcesses <= 0 || numProcesses > 10 || isNaN(timeQuantum) || timeQuantum <= 0) {
              let errorMsg = document.getElementById('rrError');
              errorMsg.innerHTML = 'Please enter valid inputs.';
              return;
            }
          
            let processes = [];
            let arrivalTimes = [];
            let burstTimes = [];
          
            // Get values of burst time input fields
            for (let i = 1; i <= numProcesses; i++) {
              let arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
              let burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
          
              // Validation for burst time input fields
              if (isNaN(arrivalTime) || arrivalTime < 0 || isNaN(burstTime) || burstTime <= 0) {
                let errorMsg = document.getElementById('rrError');
                errorMsg.innerHTML = 'Please enter valid arrival and burst times for each process.';
                return;
              }
          
              processes.push(i);
              arrivalTimes.push(arrivalTime);
              burstTimes.push(burstTime);
            }
          
            let currentTime = 0;
            let processIndex = 0;
            let remainingProcesses = [...Array(numProcesses).keys()]; // Represents processes yet to be executed
            let ganttChart = document.getElementById('ganttChartRR');
            ganttChart.innerHTML = '';
          
            let chartContent = '';
          
            let waitingTimes = new Array(numProcesses).fill(0);
            let turnaroundTimes = new Array(numProcesses).fill(0);
            let completed = new Array(numProcesses).fill(false);
            let queue = [];

            try {
              while (true) {
                for (let i = 0; i <= currentTime; i++) {
                  if (arrivalTimes[processIndex] <= currentTime) {
                    queue.push(processes[processIndex]);
                    console.log("pushed " + processes[processIndex]);
                  }
                  console.log("push loop " + i);
                }

                if (burstTimes[processIndex] <= timeQuantum) {
                  currentTime += burstTimes[processIndex];
                  burstTimes[processIndex] = 0;
                }

                
              }
            } catch (error) {
              console.log(error.message);
            }

            ganttChart.innerHTML = chartContent;
          
            let totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
            let averageWaitingTime = totalWaitingTime / numProcesses;
            let totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
            let averageTurnaroundTime = totalTurnaroundTime / numProcesses;
          
            let resultsDiv = document.createElement('div');
            resultsDiv.innerHTML = `
              <h3>Results</h3>
              <p>Waiting Times: ${waitingTimes.join(', ')}</p>
              <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
              <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
              <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
            `;
            ganttChart.appendChild(resultsDiv);
        } catch (error) {
            console.log(errorMsg);
        }
      }
  
    function resetCalculator() {
      // Reload the page
      window.location.reload();
    }
    