import { useEffect } from 'react';
import { loadFull } from 'tsparticles';
import { tsParticles } from 'tsparticles-engine';
import particles404Config from './tsParticles.js';
import planet from '../../assets/planet.svg';
import astronaut from '../../assets/astronaut.svg';
import { Link } from 'react-router-dom';
import './style.css'; // Không import bundle js

const NotFoundPage = () => {
  useEffect(() => {
    const initParticles = async () => {
      await loadFull(tsParticles);
      await tsParticles.load('tsparticles', particles404Config);
    };

    initParticles();
  }, []);

  return (
    <div className="permission_denied">
      <div id="tsparticles"></div>
      <div className="denied__wrapper">
        <h1>404</h1>
        <h3>
          LOST IN <span>SPACE</span>? Hmm, looks like that page doesn’t exist.
        </h3>
        <img id="astronaut" src={astronaut} alt="astronaut" />
        <img id="planet" src={planet} alt="planet" />
        <Link to="/">
          <button className="denied__link">Go Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
