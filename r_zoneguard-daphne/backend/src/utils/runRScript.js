<<<<<<< HEAD
const { exec } = require('child_process');
=======
const { spawn } = require('child_process');
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
const path = require('path');

function runRScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
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
=======
    const backendDir = path.join(__dirname, '../..'); // utils -> src -> backend
    const scriptPath = path.join(backendDir, 'r_scripts', scriptName);

    const env = { ...process.env };
    delete env.PROJ_LIB;
    delete env.GDAL_DATA;

    const rProcess = spawn('Rscript', [scriptPath, ...args], {
      env,
      cwd: backendDir,
    });

    let stdout = '';
    let stderr = '';
    rProcess.stdout.on('data', (chunk) => (stdout += chunk));
    rProcess.stderr.on('data', (chunk) => (stderr += chunk));

    rProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`R script "${scriptName}" exited ${code}: ${stderr}`));
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(new Error(`Bad JSON from ${scriptName}: ${err.message}\nRaw: ${stdout}`));
      }
    });

    rProcess.on('error', reject);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  });
}

module.exports = runRScript;