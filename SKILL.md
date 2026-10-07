---
name: video-progress-studio
description: Create customizable transparent video chapter-progress overlays from timed subtitles or chapter timestamps. Offer six animated presets, reference-guided styles and replaceable mascots. Use for video progress bars, chapter overlays, 视频进度条 and 章节条; not subtitles burned into footage.
---

# Video Progress Studio

Deliver a transparent overlay video for a video editor. Resolve paths relative to this folder. Requires an agent with local file access and command execution, Node.js/npm and a Remotion-supported browser runtime. Python 3 powers the subtitle helper. FFmpeg/ffprobe enable independent verification. No Codex-specific API is required; agents without these capabilities cannot render locally.

## Guide new users: style and video size

Before asking questions, extract choices already provided in the current conversation: style/reference, aspect ratio or pixel dimensions, position, colors, images, subtitles and timing. Reuse these choices. Ask only for missing information; never restart onboarding merely because a subtitle file arrives later.

Two choices must be resolved before producing a user-specific preview: **style and video size**. A generic style gallery may be shown before either is chosen. Do not silently choose the demo style or 16:9 for a new user. If the user explicitly delegates a choice ("你决定", "默认就好"), choose a suitable option and briefly state it; do not ask again.

When no look is specified, show `previews/gallery.png` and the animated `StyleGallery` composition (`npm run preview`). Explain: six presets are starting points, not limits. Users can modify any preset, describe a new look, or supply references. Use the host's media display or browser tools; do not make users choose from names alone. If displaying is unavailable, say so.

Styles: `line` fine line/nodes; `segments` rounded strips; `type` text-led chapters; `fill` 章节填色, text-led chapter cells progressively filled behind the labels; `cream` 奶油夹心, a croissant embedded in a warm cream bar; `burger` 生菜汉堡跳跳糖, a smiling burger hopping between green chapter cells. Preserve presets when adding a custom style in `src/progress.tsx` and its validation list.

When video size is missing, ask the user to select **9:16 vertical, 16:9 landscape, 4:3, 1:1 square, or custom dimensions**. Offer recognizable aspect ratios rather than requiring pixel knowledge. Use 1080×1920, 1920×1080, 1440×1080 or 1080×1080 respectively when only a ratio is given, and state the resulting dimensions in the preview summary. If actual video metadata provides dimensions, use those without asking again. Subtitles alone do not reveal video dimensions. If an explicit requested size conflicts with source metadata, briefly resolve which canvas the user wants.

Bundle missing style and size into one short, friendly question, after showing the gallery. Example when both are missing:

> 先看看这六款样式，你喜欢哪一款？也可以描述想要的感觉，或发参考图。视频是竖屏 9:16、横屏 16:9、4:3，还是方形 1:1？你可以直接回复「奶油夹心，竖屏」。

If style is already given, ask only for size; if size is already given, ask only for style. If both are known, proceed directly. Keep position, colors and other settings optional rather than asking a long questionnaire; use existing preferences or the preset defaults.

Request timed SRT/VTT **or** chapter names/start times plus total duration only if not already supplied. Accept any input order: users may send subtitles first or choose a look first. While waiting for style/size, available subtitles can be parsed and chapters proposed. After required choices are resolved, show the user-specific preview with a short summary of style, dimensions, placement and proposed chapters. Let users adjust or request export.

## Content and timing

Run `python3 scripts/prepare_subtitles.py input.srt cues.json`. Read cues and infer natural topic transitions; use faithful short chapter titles and real cue boundaries. The helper only extracts cues; the agent groups chapters semantically. Do not mechanically divide into equal chapters.

Untimed scripts can generate visual drafts but need timing before synchronized export. Last subtitle end is only a provisional duration: disclose this and allow the user to accept it or supply actual duration. A silent video tail cannot be inferred from subtitles.

Use the resolved style and dimensions. Default to top placement and 30 fps unless the user supplies other settings; use source frame rate when available. If the user explicitly delegates size and no metadata exists, use 16:9 at 1920×1080 and state the assumption. Without that delegation, ask for missing size as described above. See [configuration](references/configuration.md). Never shift chapter boundaries to fit text.

## Build and inspect

Use a working copy of this folder for each video. Install pinned dependencies with `npm install`. Do not assume another local project or hard-coded machine path exists. Keep customer material out of the distributable skill.

Create a config based on `examples/demo.json`. Optional user images go in `public/`; `image` is a relative path inside that directory. Transparent PNG/WebP recommended. If a white background needs removal, use available image-editing tools and verify the result; if unavailable, disclose that rather than calling white transparent. Built-in star/croissant/burger vectors are illustrative presets, not the reference photographs.

`npm run preview -- --props config.json` opens the preview; select Overlay. For a still: `npm run still -- Overlay out/preview.png --props config.json --frame=60`.

Inspect real rendered beginning, transitions, short chapters and ending frames. Check labels, clipping, contrast, mobile readability and mascot overlap. The renderer switches crowded layouts to a current-title label; shorten long labels or adapt the layout if still crowded. Text style shrinks to fit, so verify readability. Check over light/dark backgrounds; never bake preview backgrounds into the transparent overlay.

## Export

When export is authorized, execute `node scripts/export.mjs config.json out/progress.mov`. Existing production authorization suffices; do not impose a redundant approval. The helper uses ProRes 4444, PNG frames and alpha pixels. Do not replace it with ordinary H.264 MP4. Specific editor/platform versions may need alternatives; verify support instead of promising universal import.

Use ffprobe to verify dimensions, frame rate, duration, codec/profile and alpha. Decode alpha with FFmpeg and check both transparent and opaque pixels; inspect decoded rendered frames. Claim editor import tested only when actually performed. Deliver a local link to the MOV and editable config; instruct users to place the overlay above footage at time zero. Report failures without declaring success.
