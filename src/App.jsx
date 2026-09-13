import CurtainLoader from './components/opening/CurtainLoader'
import FaultyTerminal from './components/terminal/FaultyTerminal'

function App() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CurtainLoader />
      <FaultyTerminal
        scale={1.7}
        gridMul={[2, 1]}
        digitSize={1.3}
        timeScale={1.1}
        pause={false}
        scanlineIntensity={0.9}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0}
        curvature={0.11}
        tint="#45f031"
        mouseReact={true}
        mouseStrength={0.2}
        pageLoadAnimation={false}
        brightness={0.5}
      />
    </div>
  )
}

export default App
