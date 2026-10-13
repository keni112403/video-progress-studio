"""Build a distributable skill using an explicit public-file allowlist."""
from pathlib import Path
import hashlib
import zipfile

ROOT = Path(__file__).resolve().parent.parent
FILES = '''SKILL.md README.md LICENSE package.json package-lock.json tsconfig.json
agents/openai.yaml
src/index.tsx src/progress.tsx src/playground.tsx src/burger.tsx
scripts/export.mjs scripts/prepare_subtitles.py scripts/check-install.mjs scripts/package_skill.py
examples/demo.json examples/cream.json examples/burger.json examples/sample.srt examples/smoke.json
references/configuration.md references/installation.md previews/gallery.png'''.split()

def main():
    for name in FILES:
        source = ROOT / name
        if not source.is_file() or source.is_symlink():
            raise SystemExit(f'Missing or symlinked distributable file: {name}')
    output = ROOT / 'dist' / 'video-progress-studio.zip'
    output.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for name in sorted(FILES):
            info = zipfile.ZipInfo('video-progress-studio/' + name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, (ROOT / name).read_bytes())
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        assert set(archive.namelist()) == {'video-progress-studio/' + n for n in FILES}
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    output.with_suffix('.zip.sha256').write_text(f'{digest}  {output.name}\n')
    print(f'Packaged {len(FILES)} files: {output}')
    print(f'SHA-256: {digest}')

if __name__ == '__main__':
    main()
