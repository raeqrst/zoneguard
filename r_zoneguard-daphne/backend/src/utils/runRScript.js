const { exec } = require('child_process');
const path = require('path');

function runRScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, `../r_scripts/${scriptName}`);
    const command = `Rscript "${scriptPath}" ${args.join(' ')}`;

    console.log(`[Node] Executing R script: ${scriptName}`); // <-- Debug log 1

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Node] Error executing ${scriptName}:`, stderr);
        return reject(error);
      }
      
      console.log(`[Node] Raw output from ${scriptName}:`, stdout); // <-- Debug log 2

      try {
        const parsedData = JSON.parse(stdout);
        resolve(parsedData);
      } catch (e) {
        resolve(stdout);
      }
    });
  });
}

module.exports = runRScript;