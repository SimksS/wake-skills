#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs/promises')
const path = require('node:path')

const REPO_ROOT = path.resolve(__dirname, '..')

function parseArgs(argv) {
  const args = { _: [] }

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]

    if (!token.startsWith('-')) {
      args._.push(token)
      continue
    }

    const eqIdx = token.indexOf('=')
    if (eqIdx !== -1) {
      const key = token.slice(0, eqIdx)
      const value = token.slice(eqIdx + 1)
      args[key] = value
      continue
    }

    const next = argv[i + 1]
    if (next && !next.startsWith('-')) {
      args[token] = next
      i++
      continue
    }

    args[token] = true
  }

  return args
}

function help(exitCode = 0) {
  const text = `
wake-skills

Uso:
  wake-skills install [opções]
  wake-skills list
  wake-skills doctor [opções]

Comandos:
  install   Copia rules/ e wake-*/ para um destino (ex: .agents, .cursor)
  list      Lista as skills e rules disponíveis no pacote
  doctor    Mostra os paths resolvidos e checa se existem

Opções (install/doctor):
  --target <agents|cursor|kline|claude-code|custom>   Preset de destino (padrão: agents)
  --dest <path>                                      Diretório base (padrão: .)
  --skills-dir <path>                                Relativo ao dest (override do preset)
  --rules-dir <path>                                 Relativo ao dest (override do preset)
  --only <skills|rules|all>                           O que instalar (padrão: all)
  --dry-run                                          Não escreve nada, só imprime ações
  --force                                            Sobrescreve arquivos existentes

Exemplos:
  wake-skills install
  wake-skills install --target cursor
  wake-skills install --dest .. --target custom --skills-dir .agents/skills --rules-dir .cursor/rules
`.trim()

  console.log(text)
  process.exit(exitCode)
}

const PRESETS = {
  agents:      { skillsDir: '.agents/skills',  rulesDir: '.agents/rules'  },
  cursor:      { skillsDir: '.cursor/skills',  rulesDir: '.cursor/rules'  },
  kline:       { skillsDir: '.kline/skills',   rulesDir: '.kline/rules'   },
  'claude-code': { skillsDir: '.claude/skills', rulesDir: '.claude/rules' },
  custom:      { skillsDir: '.agents/skills',  rulesDir: '.agents/rules'  }
}

function presetForTarget(target) {
  const preset = PRESETS[target]
  if (!preset) {
    throw new Error(`Target inválido: ${target}`)
  }
  return { ...preset }
}

async function pathExists(p) {
  try {
    await fs.stat(p)
    return true
  } catch {
    return false
  }
}

async function ensureDir(dir, dryRun) {
  if (dryRun) return
  await fs.mkdir(dir, { recursive: true })
}

async function copyFile(src, dst, { dryRun, force }) {
  const dstExists = await pathExists(dst)
  if (dstExists && !force) return { action: 'skip', reason: 'exists' }
  if (dryRun) return { action: dstExists ? 'overwrite' : 'copy' }

  await ensureDir(path.dirname(dst), false)
  await fs.copyFile(src, dst)
  return { action: dstExists ? 'overwrite' : 'copy' }
}

async function copyDir(srcDir, dstDir, { dryRun, force }) {
  await ensureDir(dstDir, dryRun)
  const entries = await fs.readdir(srcDir, { withFileTypes: true })

  for (const ent of entries) {
    const src = path.join(srcDir, ent.name)
    const dst = path.join(dstDir, ent.name)
    if (ent.isDirectory()) {
      await copyDir(src, dst, { dryRun, force })
    } else if (ent.isFile()) {
      await copyFile(src, dst, { dryRun, force })
    }
  }
}

async function listSkills() {
  const entries = await fs.readdir(REPO_ROOT, { withFileTypes: true })
  const skills = entries
    .filter((e) => e.isDirectory() && e.name.startsWith('wake-'))
    .map((e) => e.name)
    .sort()
  return skills
}

async function listRules() {
  const rulesDir = path.join(REPO_ROOT, 'rules')
  if (!(await pathExists(rulesDir))) return []
  const entries = await fs.readdir(rulesDir, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile() && (e.name.endsWith('.mdc') || e.name.endsWith('.md')))
    .map((e) => e.name)
    .sort()
}

async function cmdList() {
  const skills = await listSkills()
  const rules = await listRules()

  console.log('Skills:')
  for (const s of skills) console.log(`- ${s}`)
  console.log('')
  console.log('Rules:')
  for (const r of rules) console.log(`- rules/${r}`)
}

function resolveInstallConfig(args) {
  const target = String(args['--target'] || 'agents')
  const dest = path.resolve(process.cwd(), String(args['--dest'] || '.'))
  const preset = presetForTarget(target)

  const skillsDir = path.resolve(dest, String(args['--skills-dir'] || preset.skillsDir))
  const rulesDir = path.resolve(dest, String(args['--rules-dir'] || preset.rulesDir))
  const only = String(args['--only'] || 'all')
  const dryRun = Boolean(args['--dry-run'])
  const force = Boolean(args['--force'])

  if (!['skills', 'rules', 'all'].includes(only)) {
    throw new Error(`Valor inválido para --only: ${only}`)
  }

  return { target, dest, skillsDir, rulesDir, only, dryRun, force }
}

async function cmdDoctor(args) {
  const cfg = resolveInstallConfig(args)
  console.log(`target: ${cfg.target}`)
  console.log(`dest:   ${cfg.dest}`)
  console.log(`skills: ${cfg.skillsDir}`)
  console.log(`rules:  ${cfg.rulesDir}`)
  console.log('')

  console.log(`skillsDir exists: ${await pathExists(cfg.skillsDir)}`)
  console.log(`rulesDir exists:  ${await pathExists(cfg.rulesDir)}`)
}

async function cmdInstall(args) {
  const cfg = resolveInstallConfig(args)

  const skills = await listSkills()
  const rules = await listRules()

  console.log(`Instalando em: ${cfg.dest}`)
  console.log(`- skills -> ${cfg.skillsDir}`)
  console.log(`- rules  -> ${cfg.rulesDir}`)
  console.log(`- only   -> ${cfg.only}`)
  console.log(`- dryRun -> ${cfg.dryRun}`)
  console.log(`- force  -> ${cfg.force}`)
  console.log('')

  if (cfg.only === 'skills' || cfg.only === 'all') {
    for (const skillFolder of skills) {
      const src = path.join(REPO_ROOT, skillFolder)
      const dst = path.join(cfg.skillsDir, skillFolder)
      console.log(`skill: ${skillFolder}`)
      await copyDir(src, dst, { dryRun: cfg.dryRun, force: cfg.force })
    }
  }

  if (cfg.only === 'rules' || cfg.only === 'all') {
    await ensureDir(cfg.rulesDir, cfg.dryRun)
    for (const ruleFile of rules) {
      const src = path.join(REPO_ROOT, 'rules', ruleFile)
      const dst = path.join(cfg.rulesDir, ruleFile)
      const res = await copyFile(src, dst, { dryRun: cfg.dryRun, force: cfg.force })
      console.log(`rule: rules/${ruleFile} (${res.action}${res.reason ? `: ${res.reason}` : ''})`)
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const [cmd] = args._

  if (!cmd || cmd === '-h' || cmd === '--help' || cmd === 'help') help(0)

  try {
    if (cmd === 'list') return await cmdList()
    if (cmd === 'doctor') return await cmdDoctor(args)
    if (cmd === 'install') return await cmdInstall(args)
    if (cmd === '-v' || cmd === '--version' || cmd === 'version') {
      // version vem do package.json do pacote instalado; aqui só exibimos quando disponível via env npm.
      const pkg = await fs.readFile(path.join(REPO_ROOT, 'package.json'), 'utf8')
      const m = pkg.match(/"version"\s*:\s*"([^"]+)"/)
      console.log(m ? m[1] : 'unknown')
      return
    }

    console.error(`Comando desconhecido: ${cmd}`)
    help(1)
  } catch (err) {
    console.error(err && err.message ? err.message : String(err))
    process.exit(1)
  }
}

main()
