'use client';

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { useState } from 'react';
import nextDynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import clinicData from './data/clinic-density.json';
import foodData from './data/food-deserts.json';
import heatData from './data/heat-islands.json';

const MapContainer = nextDynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = nextDynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const GeoJSON = nextDynamic(() => import('react-leaflet').then(m => m.GeoJSON), { ssr: false });

function getColor(value: number, layer: 'clinic' | 'food' | 'heat') {
  switch (layer) {
    case 'clinic':
      return value > 15 ? '#08519c' : '#3182bd';
    case 'food':
      return value > 50 ? '#a63603' : '#e6550d';
    case 'heat':
      return value > 60 ? '#99000d' : '#ef3b2c';
  }
}

function styleFactory(layer: 'clinic' | 'food' | 'heat') {
  return (feature: any) => ({
    color: getColor(feature.properties.value, layer),
    weight: 1,
    fillOpacity: 0.6,
  });
}

export default function CommunityNeedsMap() {
  const [layers, setLayers] = useState({ clinic: true, food: true, heat: true });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Community Needs Heatmap</h1>
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={layers.clinic}
            onChange={(e) => setLayers({ ...layers, clinic: e.target.checked })}
          />
          Clinic density
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={layers.food}
            onChange={(e) => setLayers({ ...layers, food: e.target.checked })}
          />
          Food deserts
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={layers.heat}
            onChange={(e) => setLayers({ ...layers, heat: e.target.checked })}
          />
          Heat islands
        </label>
      </div>
      <MapContainer
        center={[37.76, -122.45]}
        zoom={11}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {layers.clinic && (
          <GeoJSON data={clinicData as any} style={styleFactory('clinic')} />
        )}
        {layers.food && (
          <GeoJSON data={foodData as any} style={styleFactory('food')} />
        )}
        {layers.heat && (
          <GeoJSON data={heatData as any} style={styleFactory('heat')} />
        )}
      </MapContainer>
    </div>
  );
}
