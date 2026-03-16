import { generateRandomSVG } from '@/lib/services/gradientGenerator';
import { paramToColor } from '@/lib/utils';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const colorsParam = url.searchParams.getAll('colors');
  const widthParam = url.searchParams.get('width');
  const heightParam = url.searchParams.get('height');

  const colors = colorsParam.length > 0
    ? colorsParam.map(paramToColor)
    : ["#5135FF", "#FF5828", "#F69CFF", "#FFA50F"];
  const width = widthParam ? parseInt(widthParam) : 600;
  const height = heightParam ? parseInt(heightParam) : 400;


  const svgString = generateRandomSVG({ colors, width, height });
  return new Response(svgString, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
