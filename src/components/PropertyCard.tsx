import React from 'react';
import { Bed, Bath, Square } from 'lucide-react';
import { Property } from '../types/Property';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <img 
        src={property.imageUrl} 
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
        <p className="text-2xl font-bold text-purple-600 mt-2">
          {property.price} SOL
        </p>
        <p className="text-gray-600 mt-2">{property.location}</p>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{property.squareFootage} sq ft</span>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}