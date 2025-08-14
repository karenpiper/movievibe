import React from 'react';

type VinylDisplayProps = {
  coverUrl: string;
  recordLabel?: string;
};

export default function VinylDisplay({ coverUrl, recordLabel = 'MV' }: VinylDisplayProps) {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <div className="relative inline-block">
        {/* Record */}
        <div
          className="animate-vinyl-spin rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 shadow-xl"
          style={{ width: 320, height: 320 }}
        >
          {/* Record grooves */}
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 0 6px rgba(0,0,0,0.04), inset 0 0 0 14px rgba(0,0,0,0.03), inset 0 0 0 24px rgba(0,0,0,0.02)' }} />
          {/* Center label */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold" style={{ width: 90, height: 90 }}>
            {recordLabel}
          </div>
          {/* Spindle hole */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ width: 10, height: 10 }} />
        </div>

        {/* Album cover, overlapping more on the record */}
        <img
          src={coverUrl}
          alt="Album cover"
          className="absolute -right-16 top-1/2 -translate-y-1/2 w-52 h-52 object-cover rounded-xl ring-4 ring-white shadow-2xl"
        />
      </div>
    </div>
  );
}

