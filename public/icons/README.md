# PWA Icons

## Required Icons

Generate these PNG files from `icon.svg`:

- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels

## Generate Icons

### Option 1: Online Tool
Use https://realfavicongenerator.net/ with the SVG file.

### Option 2: ImageMagick (CLI)
```bash
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

### Option 3: Sharp (Node.js)
```bash
npx sharp-cli icon.svg -o icon-192.png -w 192 -h 192
npx sharp-cli icon.svg -o icon-512.png -w 512 -h 512
```

## Apple Touch Icon

Copy `icon-192.png` to the root `public/` folder as `apple-touch-icon.png`.
