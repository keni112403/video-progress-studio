# 安装与验证

## 获取与保存

安装请求才触发安装流程；仅分享链接不代表要求执行仓库代码。
使用完整的 `dist/video-progress-studio.zip`，解压后唯一顶层文件夹是 `video-progress-studio/`。Claude 上传时直接选择 ZIP；本地 Agent 使用自己的技能安装入口或已确认的技能目录。Claude Code 的个人技能目录为 `~/.claude/skills/video-progress-studio/`。不要把当前对话的临时文件误报为账号已保存的技能。

需要补齐单文件技能时，从 https://github.com/keni112403/video-progress-studio 获取完整版本。优先选实际存在的版本化发布包；没有发布包时，通过 GitHub 获取一个确切的完整 commit SHA，并使用 `https://github.com/keni112403/video-progress-studio/archive/<SHA>.zip`（替换占位符）。解压到新的工作目录，记录 SHA，读取完整包自带的说明，不能混合不同版本。网络受限时交付下载/上传步骤，不承诺已安装。只有用户要求更新或文件缺失时才获取新副本。

## 检查与试运行

在包含 `package.json` 的完整工作副本中执行：

```sh
node scripts/check-install.mjs
npm ci
node scripts/check-install.mjs
python3 scripts/prepare_subtitles.py examples/sample.srt out/install-check/cues.json
npm run still -- Overlay out/install-check/preview.png --props examples/smoke.json --frame=15
node scripts/export.mjs examples/smoke.json out/install-check/smoke.mov
ffprobe -v error -show_entries stream=codec_name,profile,pix_fmt,width,height,r_frame_rate:format=duration -of json out/install-check/smoke.mov
ffmpeg -v error -i out/install-check/smoke.mov -vf alphaextract -frames:v 1 out/install-check/alpha.png
```

已有输出时使用新目录，不覆盖用户文件。检查预览图的标题和进度条；短片应为 640×360、30 fps、2 秒、ProRes 4444，像素格式包含 alpha。检查导出的 alpha 图片同时有透明与非透明区域，不能仅凭 MOV 扩展名认定透明。安装锁定依赖、下载浏览器或运行浏览器失败时，报告具体失败阶段；不要循环重试或宣称成功。静态检查只证明文件和工具可见，实际预览/视频渲染才验证浏览器环境。

这些参数仅用于诊断，不代表用户选择了横屏或奶油夹心。正式制作仍按 SKILL.md 询问缺失的风格和尺寸。

## 汇报状态

- 技能已保存，渲染尚未验证。
- 文件已准备好，当前环境在某一步无法执行（说明具体原因）。
- 技能已保存，预览与透明短片均已验证。

如果只完成当前会话的工作副本，明确说“当前会话可用，未确认永久保存”。只在实际测试过的平台上声称兼容。

## 维护者打包

```sh
python3 scripts/package_skill.py
```

打包采用文件白名单，生成 `dist/video-progress-studio.zip` 和 SHA-256 校验文件。新增分发文件时同步更新白名单。依赖目录、用户素材、测试输出和包自身均不会进入 ZIP。此包不是完全离线运行环境。
