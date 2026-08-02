import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { CONFIG_PADRAO_SITE, type SiteConfig } from "@/lib/site-config"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE_PATH = path.join(DATA_DIR, "site-config.json")

function getStoredConfig(): SiteConfig {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8")
      return JSON.parse(content) as SiteConfig
    }
  } catch {
    // fallback to default
  }
  return CONFIG_PADRAO_SITE
}

function saveStoredConfig(config: SiteConfig) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(config, null, 2), "utf-8")
}

export async function GET() {
  const config = getStoredConfig()
  return NextResponse.json(config)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SiteConfig
    saveStoredConfig(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
