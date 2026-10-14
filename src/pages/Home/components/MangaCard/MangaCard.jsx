import './MangaCard.css';

export function MangaCard({ mangaInfo, media }) {

  if (!mangaInfo.autor || mangaInfo.autor === 'Nao cadastrado') {
    mangaInfo.autor = 'autor não informado'
  }

  if (mangaInfo.nome.length > 60) {
    mangaInfo.nome = mangaInfo.nome.slice(0, 50).trimEnd() + '...'
  }

  if (!mangaInfo.preco) {
    mangaInfo.preco = "0"
  }

  let indicatorIcon
  const visualIndicators = [
    (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.80671 10.8333L9.95435 15L14.102 10.8333M5.80671 5L9.95435 9.16667L14.102 5" stroke="#07c40e" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    ),
    (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.102 9.16667L9.95434 5L5.8067 9.16667M14.102 15L9.95434 10.8333L5.8067 15" stroke="#FA4040" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    ),
    (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_2106_565" fill="white">
          <path d="M5 8H15V13H5V8Z"/>
        </mask>
        <path d="M15 13V11H5V13V15H15V13Z" fill="#59504A" mask="url(#path-1-inside-1_2106_565)"/>
        <mask id="path-3-inside-2_2106_565" fill="white">
          <path d="M5 7H15V12H5V7Z"/>
        </mask>
        <path d="M5 7V9H15V7V5H5V7Z" fill="#59504A" mask="url(#path-3-inside-2_2106_565)"/>
      </svg>
    )
  ]

  if (mangaInfo.preco > media) {
    indicatorIcon = visualIndicators[1]
  } else if (mangaInfo.preco < media) {
    indicatorIcon = visualIndicators[0]
  } else {
    indicatorIcon = visualIndicators[2]
  }

  return (
    <article>
        {/* `no-referrer` é necessário para a OLX: o img.olx.com.br responde 403
            quando o Referer não é de um domínio dela (proteção contra
            hotlink), e as 17 capas da OLX apareciam quebradas. Sem Referer,
            responde 200. */}
        <img
          src={mangaInfo.imagem}
          alt="imagem do anuncio"
          className='img-card'
          referrerPolicy="no-referrer"
        />
        
        <div className='info-card'>
            <p className='autor'>de {mangaInfo.autor}</p>

            <h2>{mangaInfo.nome}</h2>

            <div className='line'></div>

            <p className='media-txt'>Média: R$ {media}</p>

            <div className='price'>
              {indicatorIcon}

              <data value="" className='price-txt'>R$ {mangaInfo.preco}</data>
            </div>

            <p className='state-txt'>Estado: {mangaInfo.condicao}</p>

            <div className='bottom-card'>

              {/* A fonte é de onde o anúncio veio (OLX, Enjoei...); a loja é
                  quem está vendendo. Nem sempre coincidem: "panini" parece
                  editora, mas é o apelido de um vendedor da Enjoei. */}
              {mangaInfo.fonte && (
                <p className='source-txt'>{mangaInfo.fonte}</p>
              )}

              {/* Estante Virtual, MangaDex e OLX não expõem o vendedor na
                  listagem, e a API preenche `loja` com o nome da própria
                  fonte para o campo nunca vir vazio. Mostrar as duas linhas
                  aí repetiria o mesmo texto ("OLX" sobre "Loja: OLX"). */}
              {mangaInfo.loja && mangaInfo.loja !== mangaInfo.fonte && (
                <p className='shop-txt'>Loja: {mangaInfo.loja}</p>
              )}

              <a className='redirect-box' href={mangaInfo.link} target="_blank" rel="noopener noreferrer">

                <div className='redirect-svg'>

                  <svg width="28" height="28" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.0011 11.625V3.875H19.2865M27.0011 3.875L12.8577 18.0833M23.1438 16.7917V24.5417C23.1438 25.2268 22.8729 25.8839 22.3906 26.3684C21.9084 26.8528 21.2543 27.125 20.5723 27.125H6.42884C5.74682 27.125 5.09274 26.8528 4.61049 26.3684C4.12823 25.8839 3.8573 25.2268 3.8573 24.5417V10.3333C3.8573 9.64819 4.12823 8.99111 4.61049 8.50664C5.09274 8.02217 5.74682 7.75 6.42884 7.75H14.1435" stroke="white" stroke-width="2.91667" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                </div>
                
                <div className='redirect-txt'>

                  <p>Redirecionar</p>

                </div>
              </a>
            </div>
        </div>
    </article>
  );
}
