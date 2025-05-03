const particles404Config = {
  fpsLimit: 60,
  particles: {
    number: {
      value: 160,
      density: {
        enable: true,
        area: 800
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle'
    },
    opacity: {
      value: 1,
      random: {
        enable: true,
        minimumValue: 0.1
      },
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0,
        sync: false
      }
    },
    size: {
      value: 3,
      random: {
        enable: true,
        minimumValue: 2
      }
    },
    move: {
      enable: true,
      speed: 1.7,
      random: true,
      direction: 'none',
      outModes: {
        default: 'out'
      }
    }
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      resize: false
    }
  },
  detectRetina: true
};

export default particles404Config;
