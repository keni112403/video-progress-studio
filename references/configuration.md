# Configuration

Props merge over `examples/demo.json`. Fields:
- `width`, `height`: positive even integers. Presets: 1920×1080, 1080×1920, 1440×1080, 1080×1080.
- `fps`, `duration`: positive frame rate and total seconds; duration rounds up to whole frames.
- `style`: line, segments, type, fill, cream, burger.
- `position`: top or bottom; `labels`: true/false.
- `mascot`: star or croissant. Cream defaults to croissant; burger uses its own burger illustration.
- `image`: optional file relative to public/, replacing moving mascot.
- `accent`, `track`, `ink`: played/unplayed/text colors.
- `chapters`: ordered `{label, start}` objects; first begins at 0, all starts < duration.

Progress follows elapsed time. Fill and burger use equal-width chapter cells filled by each chapter's actual duration; hops occur at real chapter boundaries. Labels use evenly spaced slots; crowded layouts show the current label. The type style highlights the chapter at its actual time. Never alter timings to fix layout. Output is full-canvas transparent video, not a cropped strip.

Fonts fall back to PingFang SC / Microsoft YaHei. Verify CJK glyphs on each machine; for identical typography, bundle a redistributable font and await loading before capture. Private uploads/reference images are not included in the library.
