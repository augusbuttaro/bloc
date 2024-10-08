import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from "@tsparticles/react"
import type { Container, Engine } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"

function ParticlesBackground(){
    const [ init, setInit ] = useState(false)
    useEffect(() => {
        initParticlesEngine(async (engine:Engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true);
        });
    }, []);
    const particlesLoaded = (container?:Container) => {
        if (container) {
            console.log(container)
          }
          return Promise.resolve()
    };
    return(
        <>
            { init && <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "ffffff",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: false,
                            mode: "repulse",
                        },
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#000000",
                    },
                    links: {
                        color: "#000000",
                        distance: 300,
                        enable: true,
                        opacity: 1,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 1,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 1 },
                    },
                },
                detectRetina: true,
            }}
        />
    }
        </>
    )
}

export default ParticlesBackground