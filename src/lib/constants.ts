export interface ColorPreset {
  name: string;
  colors: string[];
}

export const colorPresets: ColorPreset[] = [
  {
    name: 'Sunset',
    colors: ['#FF6B6B', '#FFE66D', '#FF8E53', '#FE6B8B']
  },
  {
    name: 'Ocean',
    colors: ['#667EEA', '#764BA2', '#6B8DD6', '#8E37D7']
  },
  {
    name: 'Forest',
    colors: ['#134E5E', '#71B280', '#52C234', '#061700']
  },
  {
    name: 'Aurora',
    colors: ['#00C9FF', '#92FE9D', '#FC00FF', '#00DBDE']
  },
  {
    name: 'Fire',
    colors: ['#FF512F', '#DD2476', '#FFA400', '#FF6B6B']
  },
  {
    name: 'Purple Dream',
    colors: ['#DA22FF', '#9733EE', '#B06AB3', '#4568DC']
  },
  {
    name: 'Teal Sunset',
    colors: ['#0BA360', '#3CBA92', '#30DD8A', '#2BB673']
  },
  {
    name: 'Peach',
    colors: ['#FF9A56', '#FF6A88', '#FF99AC', '#FFC3A0']
  }
];