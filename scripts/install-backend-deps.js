const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = async function(context) {
  console.log('🔧 Running afterPack hook...');
  console.log('📁 App output dir:', context.appOutDir);
  console.log('📁 Platform:', context.electronPlatformName);
  
  // Find the backend directory in the packaged app
  const backendPath = path.join(context.appOutDir, 'resources', 'app', 'backend');
  
  console.log('🔍 Looking for backend at:', backendPath);
  
  if (fs.existsSync(backendPath)) {
    console.log('✅ Backend directory found');
    
    const packageJsonPath = path.join(backendPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      console.log('✅ package.json found in backend');
      
      try {
        console.log('📦 Installing backend dependencies...');
        
        // Install dependencies with specific flags for Electron
        const installCommand = 'npm install --production --no-optional --ignore-scripts';
        
        execSync(installCommand, { 
          cwd: backendPath, 
          stdio: 'inherit',
          env: { 
            ...process.env, 
            npm_config_cache: path.join(process.cwd(), '.npm-cache'),
            npm_config_target: '29.4.6', // Electron version
            npm_config_arch: process.arch,
            npm_config_target_arch: process.arch,
            npm_config_disturl: 'https://electronjs.org/headers',
            npm_config_runtime: 'electron',
            npm_config_build_from_source: 'true'
          }
        });
        
        console.log('✅ Backend dependencies installed successfully');
        
        // Rebuild native modules for Electron
        console.log('🔨 Rebuilding native modules for Electron...');
        
        try {
          const rebuildCommand = 'npx electron-rebuild -f -w sqlite3 --version 29.4.6';
          execSync(rebuildCommand, {
            cwd: backendPath,
            stdio: 'inherit',
            env: { ...process.env }
          });
          console.log('✅ Native modules rebuilt successfully');
        } catch (rebuildError) {
          console.warn('⚠️  Native module rebuild failed, but continuing:', rebuildError.message);
        }
        
      } catch (error) {
        console.error('❌ Failed to install backend dependencies:', error.message);
        
        // Alternative: Copy from prepared backend
        console.log('🔄 Attempting to copy from prepared backend...');
        try {
          const sourceNodeModules = path.join(process.cwd(), 'backend', 'node_modules');
          const targetNodeModules = path.join(backendPath, 'node_modules');
          
          if (fs.existsSync(sourceNodeModules)) {
            console.log('📁 Copying node_modules from:', sourceNodeModules);
            console.log('📁 To:', targetNodeModules);
            
            // Use robocopy on Windows for better handling of long paths and permissions
            if (process.platform === 'win32') {
              execSync(`robocopy "${sourceNodeModules}" "${targetNodeModules}" /E /IS /IT`, { 
                stdio: 'inherit' 
              });
            } else {
              execSync(`cp -r "${sourceNodeModules}" "${targetNodeModules}"`, { 
                stdio: 'inherit' 
              });
            }
            
            console.log('✅ Backend node_modules copied successfully');
          } else {
            console.error('❌ Source node_modules not found at:', sourceNodeModules);
            throw error;
          }
        } catch (copyError) {
          console.error('❌ Failed to copy backend dependencies:', copyError.message);
          throw error;
        }
      }
    } else {
      console.error('❌ package.json not found in backend directory');
    }
  } else {
    console.error('❌ Backend directory not found at:', backendPath);
  }
  
  console.log('🏁 afterPack hook completed');
};