import PropertyCard from '../components/PropertyCard';

export default function PropertyListPage({ properties, onSelectProperty }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={onSelectProperty}
          />
        ))}
      </div>
    </div>
  );
}