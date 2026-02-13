#!/usr/bin/env node

/**
 * 部署脚本：将 Nuxt 构建后的静态文件复制到 Strapi 的 public 目录
 * 使用 Node.js 内置模块，无需额外依赖
 */

import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
// 脚本在 web/scripts/ 目录下，所以 webDir 是上一级目录
const webDir = resolve(__dirname, '..');
const rootDir = resolve(webDir, '..');
const cmsPublicDir = resolve(rootDir, 'cms', 'public');
const outputDir = resolve(webDir, '.output', 'public');

console.log('🚀 开始部署 Nuxt 静态文件到 Strapi public 目录...\n');
console.log(`📂 检查路径:`);
console.log(`   webDir: ${webDir}`);
console.log(`   outputDir: ${outputDir}`);
console.log(`   cmsPublicDir: ${cmsPublicDir}\n`);

// 1. 检查 .output/public 目录是否存在
if (!existsSync(outputDir)) {
  console.error('❌ 错误：未找到构建输出目录 .output/public');
  console.log('💡 请先运行: cd web && npm run generate');
  process.exit(1);
}

// 1.1 确保 cms/public 存在（首次部署时可能不存在）
if (!existsSync(cmsPublicDir)) {
  console.log('📁 创建 cms/public 目录...');
  mkdirSync(cmsPublicDir, { recursive: true });
}

// 2. 备份 uploads 目录（如果存在）
const uploadsDir = join(cmsPublicDir, 'uploads');
const uploadsBackup = join(cmsPublicDir, 'uploads.backup');
if (existsSync(uploadsDir)) {
  console.log('📦 备份 uploads 目录...');
  if (existsSync(uploadsBackup)) {
    rmSync(uploadsBackup, { recursive: true, force: true });
  }
  cpSync(uploadsDir, uploadsBackup, { recursive: true });
}

// 3. 备份 robots.txt（如果存在）
const robotsFile = join(cmsPublicDir, 'robots.txt');
const robotsBackup = join(cmsPublicDir, 'robots.txt.backup');
if (existsSync(robotsFile)) {
  console.log('📦 备份 robots.txt...');
  const content = readFileSync(robotsFile, 'utf-8');
  writeFileSync(robotsBackup, content);
}

// 4. 清空 public 目录（除了 uploads 和备份文件）
console.log('🧹 清理 public 目录...');
const filesToKeep = ['uploads'];
const files = readdirSync(cmsPublicDir);
files.forEach((file) => {
  const filePath = join(cmsPublicDir, file);
  if (!filesToKeep.includes(file) && !file.endsWith('.backup')) {
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      rmSync(filePath, { recursive: true, force: true });
    } else {
      rmSync(filePath, { force: true });
    }
  }
});

// 5. 复制构建输出到 public 目录
console.log('📋 复制静态文件到 public 目录...');
function copyRecursive(src, dest) {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    const files = readdirSync(src);
    files.forEach((file) => {
      const srcPath = join(src, file);
      const destPath = join(dest, file);
      // 跳过 uploads 目录
      if (file === 'uploads') {
        return;
      }
      copyRecursive(srcPath, destPath);
    });
  } else {
    cpSync(src, dest, { force: true });
  }
}

copyRecursive(outputDir, cmsPublicDir);

// 6. 恢复 uploads 目录
if (existsSync(uploadsBackup)) {
  console.log('📦 恢复 uploads 目录...');
  if (existsSync(uploadsDir)) {
    rmSync(uploadsDir, { recursive: true, force: true });
  }
  cpSync(uploadsBackup, uploadsDir, { recursive: true });
  rmSync(uploadsBackup, { recursive: true, force: true });
}

// 7. 恢复 robots.txt
if (existsSync(robotsBackup)) {
  console.log('📦 恢复 robots.txt...');
  const content = readFileSync(robotsBackup, 'utf-8');
  writeFileSync(robotsFile, content);
  rmSync(robotsBackup, { force: true });
}

console.log('\n✅ 部署完成！');
console.log(`📁 静态文件已复制到: ${cmsPublicDir}`);
console.log('\n💡 现在可以启动 Strapi 服务器：');
console.log('   cd cms && npm run start\n');

