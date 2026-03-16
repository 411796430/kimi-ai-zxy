# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview, interactive color wheel, and intelligent color harmony recommendations.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Interactive Color Wheel**: Drag and select two colors simultaneously on a visual color wheel
- **Dual Selection Modes**:
  - **Free Mode**: Freely choose any two colors on the color wheel
  - **Recommendation Mode**: Select a base color and get AI-powered color harmony recommendations
- **Color Harmony Algorithms**: Based on color theory, including:
  - **Complementary**: Colors opposite on the color wheel (180° apart)
  - **Analogous**: Adjacent colors on the color wheel (±30°)
  - **Triadic**: Three evenly spaced colors (120° apart)
  - **Split Complementary**: Colors adjacent to the complement (150° & 210°)
  - **Tetradic**: Two pairs of complementary colors (rectangle pattern)
  - **Monochromatic**: Same hue with varying lightness/saturation
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Selection System

### Free Selection Mode
In free mode, you can:
- Drag two color pickers on the color wheel independently
- Adjust colors using hex color inputs
- Generate random color combinations
- Apply selected colors instantly

### Recommendation Mode
In recommendation mode:
1. Select your base color on the color wheel
2. The system automatically generates 6 types of harmonious color schemes
3. Click on any scheme to apply it to your gradient
4. Each scheme is calculated using proven color theory algorithms

### Color Harmony Algorithms

The recommendation system uses HSL (Hue, Saturation, Lightness) color space calculations:

| Harmony Type | Description | Use Case |
|-------------|-------------|----------|
| Complementary | Opposite colors on wheel | High contrast, vibrant designs |
| Analogous | Adjacent colors | Harmonious, natural feel |
| Triadic | Three evenly spaced colors | Balanced, colorful designs |
| Split Complementary | Base + adjacent to complement | Strong contrast, less tension |
| Tetradic | Two complementary pairs | Rich, complex palettes |
| Monochromatic | Single hue variations | Clean, minimalist designs |

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

Run the test suite to verify color utility functions:

```bash
# Run linting
npm run lint

# Build the project
npm run build
```

### Manual Testing

1. **Color Conversion Test**: Open browser console and run:
```javascript
import { hexToHsl, hslToHex } from '@/lib/colorUtils';
console.log(hexToHsl('#FF0000')); // { h: 0, s: 100, l: 50 }
console.log(hslToHex({ h: 120, s: 100, l: 50 })); // #00FF00
```

2. **Harmony Generation Test**:
```javascript
import { getAllHarmonies } from '@/lib/colorUtils';
const harmonies = getAllHarmonies('#5135FF');
console.log(harmonies);
```

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── route.ts          # API endpoint for SVG generation
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with color selector
├── components/
│   ├── ui/                   # UI components (Button, Input, Card)
│   ├── ColorWheel.tsx        # Interactive color wheel component
│   ├── ColorSelector.tsx     # Main color selection panel
│   └── HarmonyPresets.tsx    # Color harmony recommendations
├── hooks/
│   └── useGradientGenerator.tsx  # Gradient generation hook
└── lib/
    ├── services/
    │   └── gradientGenerator.ts  # SVG generation logic
    ├── colorUtils.ts         # Color conversion & harmony algorithms
    ├── constants.ts          # Color presets
    └── utils.ts              # Utility functions
```

## Color Algorithm Implementation

The color harmony algorithms are implemented in `src/lib/colorUtils.ts`:

```typescript
// Example: Generate complementary colors
const complementary = generateComplementary('#FF0000');
// Returns: ['#FF0000', '#00FFFF']

// Example: Get all harmonies
const harmonies = getAllHarmonies('#5135FF');
// Returns array of 6 harmony types with their color arrays
```

### Algorithm Details

All algorithms work in HSL color space:

1. **Convert HEX to HSL**: Parse RGB values and calculate hue, saturation, lightness
2. **Calculate Harmony**: Apply angle offsets based on color theory
3. **Convert back to HEX**: Return usable color values

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn about color theory:
- [Color Wheel Theory](https://en.wikipedia.org/wiki/Color_wheel)
- [Color Harmony](https://en.wikipedia.org/wiki/Harmony_(color))

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
