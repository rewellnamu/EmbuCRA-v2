const fs = require('fs');
const path = require('path');

// Function to recursively find all .spec.ts files
function findSpecFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and dist directories
      if (!filePath.includes('node_modules') && !filePath.includes('dist')) {
        findSpecFiles(filePath, fileList);
      }
    } else if (file.endsWith('.spec.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix a spec file
function fixSpecFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file already has HttpClientTestingModule import
  if (content.includes('HttpClientTestingModule')) {
    console.log(`✓ Already has HttpClientTestingModule: ${filePath}`);
    return false;
  }
  
  // Check if file has TestBed (indicating it's a test file that needs fixing)
  if (!content.includes('TestBed')) {
    console.log(`⊘ Skipping (no TestBed): ${filePath}`);
    return false;
  }
  
  // Step 1: Add the import statement
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    // Insert the new import after the last import
    lines.splice(lastImportIndex + 1, 0, "import { HttpClientTestingModule } from '@angular/common/http/testing';");
    content = lines.join('\n');
    modified = true;
  }
  
  // Step 2: Add HttpClientTestingModule to TestBed imports
  // Look for TestBed.configureTestingModule
  const testBedRegex = /TestBed\.configureTestingModule\s*\(\s*\{/;
  
  if (testBedRegex.test(content)) {
    // Check if there's already an imports array
    const importsRegex = /imports\s*:\s*\[([^\]]*)\]/;
    const match = content.match(importsRegex);
    
    if (match) {
      // There's already an imports array, add HttpClientTestingModule to it
      const importsContent = match[1];
      
      // Find the position of the closing bracket
      const closePosition = match.index + match[0].length - 1;
      
      // Insert HttpClientTestingModule before the closing bracket
      let newImports;
      if (importsContent.trim()) {
        // Has existing imports, add comma
        newImports = match[0].slice(0, -1) + ',\n        HttpClientTestingModule]';
      } else {
        // Empty imports array
        newImports = match[0].slice(0, -1) + 'HttpClientTestingModule]';
      }
      
      content = content.substring(0, match.index) + newImports + content.substring(closePosition + 1);
      modified = true;
    } else {
      // No imports array, need to add one
      // Find TestBed.configureTestingModule({
      const testBedMatch = content.match(/TestBed\.configureTestingModule\s*\(\s*\{/);
      if (testBedMatch) {
        const insertPos = testBedMatch.index + testBedMatch[0].length;
        const insertion = '\n      imports: [HttpClientTestingModule],';
        content = content.substring(0, insertPos) + insertion + content.substring(insertPos);
        modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } else {
    console.log(`⊘ No changes needed: ${filePath}`);
    return false;
  }
}

// Main execution
console.log('🔍 Searching for .spec.ts files...\n');

const srcDir = path.join(__dirname, 'src');

if (!fs.existsSync(srcDir)) {
  console.error('❌ Error: src directory not found!');
  console.error('Make sure to run this script from your project root directory.');
  process.exit(1);
}

const specFiles = findSpecFiles(srcDir);

console.log(`Found ${specFiles.length} spec files\n`);
console.log('🔧 Fixing spec files...\n');

let fixedCount = 0;

specFiles.forEach(file => {
  try {
    if (fixSpecFile(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Done! Fixed ${fixedCount} files out of ${specFiles.length} total spec files.`);
console.log('\n💡 Next steps:');
console.log('   1. Review the changes with: git diff');
console.log('   2. Run tests with: npm test');
console.log('   3. If tests still fail, check individual files manually');