# Async JavaScript Lab

A small HTML, CSS, and vanilla JavaScript page that practices closures, the call stack, promises, async/await, the event loop, tasks, and microtasks.

Open `index.html` in a browser. No build step and no libraries.

## Closure and the private counter

`createTask(name)` declares `let count = 0` inside the function. `run`, `getCount`, and `reset` are created in that same scope, so they can read and change `count`. The returned object does not include `count` itself. Code outside the closure cannot assign to it. Calling `createTask` three times creates three separate lexical environments, so Load Users, Load Posts, and Load Comments each keep their own counter.

## Call stack

Clicking Run on one card pushes the click handler, which calls `task.run()`. `run` increments the private counter, creates a promise, and calls `setTimeout`. `setTimeout` only registers a timer and returns. `run` returns a pending promise, the click handler finishes, and the stack becomes empty. JavaScript is free while the timer waits. When the delay ends, the event loop pushes the timer callback onto a new stack. That callback resolves or rejects the promise.

## Why JavaScript continues during setTimeout

`setTimeout` does not pause the thread. The browser (or Node) keeps the timer outside JavaScript. The current call stack finishes, then the event loop can run other work. That is why three tasks can be in the "Running" state at the same time.

## Predicted and actual event loop output

Predicted order, written in the page before the demo runs:

```
1 sync: start
4 async: before await
8 sync: end
3 microtask: Promise.then A
5 microtask: after await
6 microtask: Promise.then B
2 task: timeout A
7 task: timeout B
```

The demo writes the same lines to the page and to the browser console with `console.log`. The script task runs lines 1, 4, and 8 immediately. `demo()` is async, but everything before the first `await` is synchronous. `await Promise.resolve()` and both `Promise.then` callbacks are queued as microtasks, in the order they were scheduled: then A, then the awaited continuation, then then B. Both `setTimeout(..., 0)` callbacks are tasks. The event loop does not touch the task queue until the microtask queue is empty, so the timers print last.

## Tasks vs microtasks

A task is a macrotask: the script itself, `setTimeout`, and DOM events. A microtask is a promise reaction (`then`, `catch`, `finally`) or the continuation after `await`. After one task finishes, the event loop empties the whole microtask queue before it starts the next task.

## Several promises and errors

Each `run()` promise rejects about 35% of the time. The UI catches that rejection and shows Failed together with the elapsed time. Run all tasks and the concurrent measurement use `Promise.allSettled`, so one rejection does not cancel the others. The message "All tasks finished" is shown only after every promise has fulfilled or rejected. Sequential mode uses `try/catch` around each `await` for the same reason: a failed task is recorded, then the next task still starts.

## Sequential vs concurrent

Sequential code is `await task1.run(); await task2.run(); await task3.run();`. The next timer starts only after the previous promise settles, so the measured time is close to the sum of the three random delays (500–2000 ms each).

Concurrent code is `Promise.allSettled([task1.run(), task2.run(), task3.run()])`. All three timers start in one turn and overlap. The measured time is close to the slowest task, which is why it is shorter than the sequential run.
