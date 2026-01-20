import GuinchoRastreamento from '../components/GuinchoRastreamento'

function GuinchoPage() {
  return (
    <>
      <header className="header">
        <h1>Guincho parceiro a caminho!</h1>
        <p>Chegada estimada: ~15 minutos</p>
      </header>

      <div className="map-wrapper">
        <GuinchoRastreamento />
      </div>

      <footer className="footer">
        <p>
          Perfeito! Achei um guincho parceiro super pertinho de você. Pelo que
          você descreveu, melhor rebocar pra uma oficina pra fazer o diagnóstico
          certinho.
        </p>
        <p style={{ marginTop: '8px' }}>
          Chega em aproximadamente 15 minutos, tudo coberto pela sua apólice, sem
          custo extra.
        </p>
      </footer>
    </>
  )
}

export default GuinchoPage

