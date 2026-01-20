import { useState } from 'react'
import MapaRastreamento from './components/MapaRastreamento'

function App() {
  return (
    <>
      <header className="header">
        <h1>João está a caminho! Carro prata</h1>
        <p>Telefone: (11) 6232-31234</p>
      </header>

      <div className="map-wrapper">
        <MapaRastreamento />
      </div>

      <footer className="footer">
        <p>
          Código de segurança de 4 dígitos enviado por SMS. Passe ao motorista
          na chegada para confirmar.
        </p>
        <p style={{ marginTop: '8px' }}>
          Rastreie o trajeto em tempo real. Qualquer dúvida, me chame aqui!
        </p>
      </footer>
    </>
  )
}

export default App

