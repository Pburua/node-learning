# NodeJS Event Loop

## Useful articles:

https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick
https://nodejs.dev/en/learn/understanding-processnexttick/

## Takeaways:

### setImmediate() vs setTimeout()

The order in which the timers are executed will vary depending on the context in which they are called. If both are called from within the main module, then timing will be bound by the performance of the process. However, if you move the two calls within an I/O cycle, the immediate callback is always executed first.

- `setImmediate()` is designed to execute a script once the current poll phase completes.
- `setTimeout()` schedules a script to be run after a minimum threshold in ms has elapsed.

### process.nextTick()

`process.nextTick()` is not technically part of the event loop. Instead, the `nextTickQueue` will be processed after the current operation is completed, regardless of the current phase of the event loop. Any time you call `process.nextTick()` in a given phase, all callbacks passed to `process.nextTick()` will be resolved before the event loop continues.

Moreover, calling `process.nextTick()` doesn't just call any code immediately after the current loop phase, but it skips the rest of the current event loop phases and starts the next event loop iteration straight after that.
