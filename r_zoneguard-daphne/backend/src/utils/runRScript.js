const { spawn } = require('child_process');
const path = require('path');

function runRScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
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
  });
}

module.exports = runRScript;