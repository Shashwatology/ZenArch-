import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const BANNED_IMPORT = 'furniture_db.json'
const PROJECT_ROOT = path.resolve(__dirname, '..')

// Files that are allowed to import the old DB
const ALLOWED_FILES = [
  path.join(PROJECT_ROOT, 'scripts', 'import-catalogue.ts'),
  path.join(PROJECT_ROOT, 'scripts', 'audit-public-db-sync.ts'),
  path.join(PROJECT_ROOT, 'lib', 'data', 'furniture.ts')
]

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f)
    let isDirectory = fs.statSync(dirPath).isDirectory()
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback)
      }
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        callback(dirPath)
      }
    }
  })
}

function runAudit() {
  let violations: string[] = []
  
  walkDir(PROJECT_ROOT, (filePath) => {
    if (ALLOWED_FILES.includes(filePath)) return
    
    const content = fs.readFileSync(filePath, 'utf-8')
    if (content.includes(BANNED_IMPORT)) {
      violations.push(filePath)
    }
  })
  
  if (violations.length > 0) {
    console.error(`❌ AUDIT FAILED. The following files are still importing ${BANNED_IMPORT}:`)
    violations.forEach(v => console.error(`  - ${path.relative(PROJECT_ROOT, v)}`))
    process.exit(1)
  } else {
    console.log(`✅ AUDIT PASSED. ${BANNED_IMPORT} is completely isolated from the app.`)
    process.exit(0)
  }
}

runAudit()
