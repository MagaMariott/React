const taskNames = ["Load Users", "Load Posts", "Load Comments"];

function createTask(name) {
  let count = 0;

  return {
    name,
    run() {
      count += 1;
      const delay = 500 + Math.floor(Math.random() * 1501);
      const shouldFail = Math.random() < 0.35;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error(`${name} could not finish`));
            return;
          }
          resolve({ name, delay });
        }, delay);
      });
    },
    getCount() {
      return count;
    },
    reset() {
      count = 0;
    },
  };
}

const tasks = taskNames.map(createTask);
const ui = new Map();

const taskList = document.querySelector("#task-list");
const batchMessage = document.querySelector("#batch-message");
const stackLog = document.querySelector("#stack-log");
const buttons = [
  document.querySelector("#run-all"),
  document.querySelector("#run-sequential"),
  document.querySelector("#run-concurrent"),
  document.querySelector("#reset-all"),
  document.querySelector("#run-loop"),
];

function renderTask(task, state) {
  const card = ui.get(task.name);
  card.querySelector("[data-status]").textContent = state.status;
  card.querySelector("[data-status]").className = `status ${state.status.toLowerCase()}`;
  card.querySelector("[data-count]").textContent = String(task.getCount());
  card.querySelector("[data-time]").textContent =
    state.ms == null ? "—" : `${state.ms} ms`;
}

function setStatus(task, status, ms = null) {
  renderTask(task, { status, ms });
}

tasks.forEach((task) => {
  const card = document.createElement("article");
  card.className = "task";
  card.innerHTML = `
    <h3>${task.name}</h3>
    <div class="meta">
      <div><span>Status</span><span class="status" data-status>Idle</span></div>
      <div><span>Runs</span><span data-count>0</span></div>
      <div><span>Loading time</span><span data-time>—</span></div>
    </div>
    <div class="task-actions">
      <button type="button" data-run>Run</button>
      <button type="button" data-reset>Reset</button>
    </div>
  `;
  card.querySelector("[data-run]").addEventListener("click", () => {
    runOne(task, true).catch(() => {
      // Failure is already shown on the card.
    });
  });
  card.querySelector("[data-reset]").addEventListener("click", () => {
    task.reset();
    setStatus(task, "Idle", null);
  });
  taskList.append(card);
  ui.set(task.name, card);
  setStatus(task, "Idle", null);
});

function lock(locked) {
  buttons.forEach((button) => {
    button.disabled = locked;
  });
  document.querySelectorAll("[data-run], [data-reset]").forEach((button) => {
    button.disabled = locked;
  });
}

function pushStack(text) {
  const item = document.createElement("li");
  item.textContent = text;
  stackLog.append(item);
}

async function runOne(task, trace) {
  if (trace) stackLog.replaceChildren();
  const started = performance.now();
  setStatus(task, "Running");

  if (trace) {
    pushStack("Click handler is on the call stack and calls task.run().");
    pushStack("task.run() increments the private counter and calls setTimeout.");
    pushStack("setTimeout returns immediately. The stack can clear while the timer waits.");
  }

  try {
    const result = await task.run();
    const ms = Math.round(performance.now() - started);
    setStatus(task, "Completed", ms);
    if (trace) {
      pushStack(`Timer callback ran later as a task. ${task.name} resolved after ${result.delay} ms.`);
    }
    return ms;
  } catch (error) {
    const ms = Math.round(performance.now() - started);
    setStatus(task, "Failed", ms);
    if (trace) {
      pushStack(`Timer callback rejected the promise: ${error.message}.`);
    }
    throw error;
  }
}

async function settle(task) {
  try {
    await runOne(task, false);
  } catch {
    // The card already shows Failed. The batch still continues.
  }
}

document.querySelector("#run-all").addEventListener("click", async () => {
  lock(true);
  batchMessage.className = "batch-message";
  batchMessage.textContent = "Tasks are running together…";
  await Promise.allSettled(tasks.map((task) => runOne(task, false)));
  batchMessage.className = "batch-message done";
  batchMessage.textContent = "All tasks finished";
  lock(false);
});

async function measure(mode) {
  lock(true);
  batchMessage.className = "batch-message";
  batchMessage.textContent = "";
  const started = performance.now();

  if (mode === "sequential") {
    for (const task of tasks) {
      await settle(task);
    }
  } else {
    await Promise.allSettled(tasks.map((task) => runOne(task, false)));
  }

  const elapsed = Math.round(performance.now() - started);
  lock(false);
  return elapsed;
}

document.querySelector("#run-sequential").addEventListener("click", async () => {
  const elapsed = await measure("sequential");
  document.querySelector("#seq-time").textContent = `${elapsed} ms`;
  document.querySelector("#seq-note").textContent =
    "Each await waited for the previous timer. Total time is close to the sum of the three delays.";
  explainCompare();
});

document.querySelector("#run-concurrent").addEventListener("click", async () => {
  const elapsed = await measure("concurrent");
  document.querySelector("#con-time").textContent = `${elapsed} ms`;
  document.querySelector("#con-note").textContent =
    "All timers started together. Total time is close to the slowest task, not the sum.";
  batchMessage.className = "batch-message done";
  batchMessage.textContent = "All tasks finished";
  explainCompare();
});

function explainCompare() {
  const seq = document.querySelector("#seq-time").textContent;
  const con = document.querySelector("#con-time").textContent;
  if (seq === "—" || con === "—") return;
  document.querySelector("#compare-why").textContent =
    `Sequential took ${seq} and concurrent took ${con}. JavaScript does not freeze on setTimeout. While a timer is waiting, the call stack is empty and the event loop can run the other tasks. Awaiting one by one refuses to start the next timer until the current promise settles, so the waits are added. Promise.allSettled starts every timer during the same turn, so the waits overlap. allSettled also keeps going when one task fails, and reports every result.`;
}

document.querySelector("#reset-all").addEventListener("click", () => {
  tasks.forEach((task) => {
    task.reset();
    setStatus(task, "Idle", null);
  });
  batchMessage.textContent = "";
  batchMessage.className = "batch-message";
});

const predictedLines = [
  "1 sync: start",
  "4 async: before await",
  "8 sync: end",
  "3 microtask: Promise.then A",
  "5 microtask: after await",
  "6 microtask: Promise.then B",
  "2 task: timeout A",
  "7 task: timeout B",
];

const predicted = document.querySelector("#predicted");
predictedLines.forEach((line) => {
  const item = document.createElement("li");
  item.textContent = line;
  predicted.append(item);
});

document.querySelector("#run-loop").addEventListener("click", () => {
  const actual = document.querySelector("#actual");
  actual.replaceChildren();
  const logs = [];

  function record(line) {
    console.log(line);
    logs.push(line);
    const item = document.createElement("li");
    item.textContent = line;
    actual.append(item);
  }

  record("1 sync: start");
  setTimeout(() => record("2 task: timeout A"), 0);
  Promise.resolve().then(() => record("3 microtask: Promise.then A"));

  async function demo() {
    record("4 async: before await");
    await Promise.resolve();
    record("5 microtask: after await");
  }

  demo();
  Promise.resolve().then(() => record("6 microtask: Promise.then B"));
  setTimeout(() => record("7 task: timeout B"), 0);
  record("8 sync: end");

  document.querySelector("#loop-explain").textContent =
    "The script itself is one task. Lines 1, 4, and 8 run on the call stack before it goes empty: an async function runs synchronously until its first await. await and Promise.then schedule microtasks. The event loop drains that microtask queue (3, then 5, then 6) before it takes the next task. The two setTimeout(..., 0) callbacks wait in the task queue, so they print last (2, then 7), even though they were registered earlier. Tasks are timer and I/O callbacks. Microtasks are promise reactions and the code after await. The event loop repeats: run a task to completion, drain all microtasks, then take the next task.";
});
