import AncientTechCard from '../../components/ancient/AncientTechCard';

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface TechData {
  title: string;
  principle: string;
  modernAnalog: string;
  applyLink: string;
  simulation: {
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    outputLabel: string;
    formula: (value: number) => number;
  };
}

const techs: TechData[] = [
  {
    title: 'Qanats',
    principle:
      'Underground channels transport water using gravity while preventing evaporation.',
    modernAnalog: 'Subsurface irrigation systems.',
    applyLink: 'https://example.com/apply/qanats',
    simulation: {
      label: 'Channel slope (°)',
      min: 1,
      max: 5,
      step: 0.5,
      unit: 'L/min',
      outputLabel: 'Water flow',
      formula: (v) => v * 50,
    },
  },
  {
    title: 'Windcatchers (Badgirs)',
    principle: 'Tall towers capture breezes and funnel them indoors for cooling.',
    modernAnalog: 'Passive cooling towers and modern HVAC vents.',
    applyLink: 'https://example.com/apply/windcatchers',
    simulation: {
      label: 'Wind speed (m/s)',
      min: 0,
      max: 20,
      step: 1,
      unit: '°C drop',
      outputLabel: 'Cooling effect',
      formula: (v) => v * 0.5,
    },
  },
  {
    title: 'Terracing',
    principle:
      'Step-like fields slow water runoff and prevent soil erosion on slopes.',
    modernAnalog: 'Contour farming and green roofs.',
    applyLink: 'https://example.com/apply/terracing',
    simulation: {
      label: 'Slope angle (°)',
      min: 0,
      max: 45,
      step: 5,
      unit: '% retention',
      outputLabel: 'Soil retained',
      formula: (v) => 100 - v,
    },
  },
  {
    title: 'Roman Concrete',
    principle:
      'Volcanic ash and seawater create durable concrete that self-heals over time.',
    modernAnalog: 'Self-healing concrete mixes.',
    applyLink: 'https://example.com/apply/roman-concrete',
    simulation: {
      label: 'Ash ratio (%)',
      min: 0,
      max: 50,
      step: 5,
      unit: 'durability index',
      outputLabel: 'Longevity',
      formula: (v) => v * 2,
    },
  },
  {
    title: 'Ash-Alkali Soap',
    principle:
      'Wood ash combined with fats yields alkaline soap for cleaning.',
    modernAnalog: 'Biodegradable lye-based soaps.',
    applyLink: 'https://example.com/apply/ash-soap',
    simulation: {
      label: 'Lye concentration (%)',
      min: 0,
      max: 100,
      step: 10,
      unit: 'cleaning power',
      outputLabel: 'Effectiveness',
      formula: (v) => v,
    },
  },
  {
    title: 'Zeer Pots',
    principle:
      'Nested clay pots with wet sand use evaporative cooling to preserve food.',
    modernAnalog: 'Off-grid refrigeration and evaporative coolers.',
    applyLink: 'https://example.com/apply/zeer-pots',
    simulation: {
      label: 'Ambient humidity (%)',
      min: 0,
      max: 100,
      step: 10,
      unit: '°C drop',
      outputLabel: 'Cooling effect',
      formula: (v) => (100 - v) * 0.2,
    },
  },
];

export default function AncientGalleryPage() {
  return (
    <div className="p-4 space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold">Lost Innovations</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {techs.map((tech) => (
          <AncientTechCard key={tech.title} {...tech} />
        ))}
      </div>
    </div>
  );
}
