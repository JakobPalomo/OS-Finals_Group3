let timer = 0;
let maxProcessIndex = 0;
let avgWait = 0;
let avgTT = 0;

// Get values of arrival time and burst time input fields
for (let i = 1; i <= numProcesses; i++) {
    let arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
    let burstTime = parseInt(document.getElementById(`burstTime${i}`).value);

    // Validation for arrival time and burst time input fields
    if (isNaN(arrivalTime) || arrivalTime < 0 || isNaN(burstTime) || burstTime <= 0) {
       let errorMsg = document.getElementById('rrError');
       errorMsg.innerHTML = 'Please enter valid arrival and burst times for each process.';
       return;
    }

    // Add the process to the processes array
    processes.push({
       arrivalTime: arrivalTime,
       burstTime: burstTime,
       remainingBurstTime: burstTime
    });
}

// Sort the processes array by arrival time
processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

while (processes.length > 0) {
    let process = processes[0];

    // If the process arrives in the future, increment the timer and continue to the next iteration
    if (process.arrivalTime > timer) {
       timer++;
       continue;
    }

    // Execute the process for the time quantum
    if (process.remainingBurstTime > timeQuantum) {
       process.remainingBurstTime -= timeQuantum;
       timer += timeQuantum;
    } else {
       timer += process.remainingBurstTime;
       process.remainingBurstTime = 0;
    }

    // If the process has finished executing, remove it from the processes array
    if (process.remainingBurstTime === 0) {
       processes.shift();
    } else {
       // If the process hasn't finished executing, move it to the end of the processes array
       processes.push(processes.shift());
    }
}
