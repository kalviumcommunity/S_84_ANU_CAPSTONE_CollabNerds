import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const AnimatedGlobe = () => {
  const globeEl = useRef();

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.8;
    globeEl.current.pointOfView({ altitude: 2 }, 4000);
  }, []);

  return (
    <div className="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showGlobe={true}
        showAtmosphere={true}
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.25}
      />
    </div>
  );
};

export default AnimatedGlobe;
