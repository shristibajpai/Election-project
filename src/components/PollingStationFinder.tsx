import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Navigation, MapPin, Building2, Clock, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 14);
  return null;
}

export default function PollingStationFinder() {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const mockStations = (lat: number, lng: number): Station[] => [
    {
      id: '1',
      name: 'Central Public Library',
      address: '123 Democracy Ave',
      distance: '0.4 miles',
      hours: '7:00 AM - 8:00 PM',
      phone: '(555) 123-4567',
      lat: lat + 0.005,
      lng: lng + 0.005
    },
    {
      id: '2',
      name: 'Westside Community Center',
      address: '456 Liberty St',
      distance: '0.9 miles',
      hours: '7:00 AM - 8:00 PM',
      phone: '(555) 987-6543',
      lat: lat - 0.005,
      lng: lng - 0.008
    },
    {
      id: '3',
      name: 'St. Jude Elementary School',
      address: '789 Patriot Way',
      distance: '1.2 miles',
      hours: '7:00 AM - 8:00 PM',
      phone: '(555) 456-7890',
      lat: lat + 0.008,
      lng: lng - 0.003
    }
  ];

  const handleSearch = async () => {
    if (!address.trim()) return;
    setIsSearching(true);
    
    try {
      // Use Nominatim for free geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLon = parseFloat(lon);
        setCenter([newLat, newLon]);
        setStations(mockStations(newLat, newLon));
      } else {
        alert("Address not found. Please try again.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 h-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Live Locator</div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Find Your Station</h2>
          <p className="text-slate-500 font-medium max-w-xl">
            Enter your residential address to locate the nearest official polling station and view operating hours.
          </p>
        </div>

        <div className="w-full md:w-[400px] relative">
          <div className="bg-white p-2 rounded-[24px] shadow-xl shadow-blue-900/5 border border-white flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. 1600 Pennsylvania Ave, Washington"
              className="flex-1 px-4 py-3 text-sm font-bold bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-50 transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-50"
            >
              {isSearching ? <span className="animate-spin">◌</span> : <Search size={22} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[500px] flex flex-col lg:flex-row gap-8 bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white p-4">
        {/* Sidebar: Results */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto p-4 max-h-[400px] lg:max-h-full">
           {stations.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-[32px] space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
                 <MapPin size={32} />
               </div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">
                 Enter your address above <br /> to see results
               </p>
             </div>
           ) : (
             stations.map((station) => (
               <motion.div
                 key={station.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 onClick={() => {
                    setCenter([station.lat, station.lng]);
                    setSelectedStation(station);
                 }}
                 className={cn(
                   "p-6 rounded-[32px] border-2 transition-all cursor-pointer group",
                   selectedStation?.id === station.id 
                    ? "bg-blue-50 border-blue-200" 
                    : "bg-white border-slate-50 hover:border-blue-100"
                 )}
               >
                 <div className="flex items-start justify-between">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <div className={cn(
                           "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors",
                           selectedStation?.id === station.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                         )}>
                            <Building2 size={20} strokeWidth={2.5} />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900 leading-tight uppercase tracking-tight">{station.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{station.distance}</p>
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                             <MapPin size={14} className="text-blue-500" />
                             {station.address}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                             <Clock size={14} />
                             {station.hours}
                          </div>
                       </div>
                       
                       {selectedStation?.id === station.id && (
                         <motion.button 
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           onClick={(e) => {
                             e.stopPropagation();
                             getDirections(station.lat, station.lng);
                           }}
                           className="w-full py-3 bg-slate-900 text-white rounded-[20px] text-xs font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                         >
                           Get Directions <Navigation size={14} />
                         </motion.button>
                       )}
                    </div>
                 </div>
               </motion.div>
             ))
           )}
        </div>

        {/* Map Area */}
        <div className="flex-1 min-h-[400px] rounded-[32px] overflow-hidden border border-slate-50 shadow-inner relative z-10">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={center} />
            {stations.map((station) => (
              <Marker 
                key={station.id} 
                position={[station.lat, station.lng]}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2">
                    <h5 className="font-black text-slate-900 uppercase text-xs">{station.name}</h5>
                    <p className="text-[10px] text-slate-500 font-bold">{station.address}</p>
                    <button 
                      onClick={() => getDirections(station.lat, station.lng)}
                      className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg"
                    >
                      Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* User Location Marker? Maybe just center for now */}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
