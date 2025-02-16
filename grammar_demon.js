import { GlobalKeyboardListener } from "node-global-key-listener";
import clipboardy from "clipboardy";

const listener = new GlobalKeyboardListener();

listener.addListener((e, down) => {
  // Check if both Control and F are pressed
  //console.log("Key press", {e: e, down: down});
  
  //const ctrlFlag = down["LEFT CTRL"] || down["RIGHT CTRL"];
  const altFlag = down["LEFT ALT"] || down["RIGHT ALT"];
  const shiftFlag = down["LEFT SHIFT"] || down["RIGHT SHIFT"];
  if (e.state === 'DOWN' && e.rawKey.name === 'K' && altFlag && shiftFlag) {
	console.log("Key press 2");
    // Get the current clipboard content
    clipboardy.read().then((text) => {
      console.log("Clipboard content:", text);
	  
	  clipboardy.writeSync('🦄');
	  
    }).catch((err) => {
      console.error("Failed to read clipboard:", err);
    });
  }
});

console.log("Listening for Ctrl+F... Press Ctrl+C to stop.");

process.on('SIGINT', () => {
  console.log('Gracefully shutting down from SIGINT (Ctrl+C)');
  listener.stop();
  process.exit();
});