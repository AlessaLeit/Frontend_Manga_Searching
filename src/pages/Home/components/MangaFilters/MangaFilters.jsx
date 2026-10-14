import "./MangaFilters.css";

export function MangaFilters({
  filters,
  setFilters,
  authors,
  sources,
  shops,
  onReset,
}) {
  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <section
      className="manga-filters"
      aria-label="Filtros dos resultados"
    >
      <div className="manga-filters__header">
        <h2>Filtrar resultados</h2>

        <button
          type="button"
          className="manga-filters__reset"
          onClick={onReset}
        >
          Limpar filtros
        </button>
      </div>

      <div className="manga-filters__controls">
        <label className="manga-filters__field">
          <span>Estado</span>
          <select
            value={filters.condition}
            onChange={(event) =>
              updateFilter("condition", event.target.value)
            }
          >
            <option value="">Todos os estados</option>
            <option value="novo">Novo</option>
            <option value="usado">Usado</option>
            <option value="online">Online</option>
          </select>
        </label>

        <label className="manga-filters__field">
          <span>Ordenar por preço</span>
          <select
            value={filters.priceOrder}
            onChange={(event) =>
              updateFilter("priceOrder", event.target.value)
            }
          >
            <option value="">Sem ordenação</option>
            <option value="asc">Menor preço</option>
            <option value="desc">Maior preço</option>
          </select>
        </label>

        <label className="manga-filters__field">
          <span>Autor</span>
          <select
            value={filters.author}
            onChange={(event) =>
              updateFilter("author", event.target.value)
            }
          >
            <option value="">Todos os autores</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </label>

        <label className="manga-filters__field">
          <span>Fonte</span>
          <select
            value={filters.source}
            onChange={(event) =>
              updateFilter("source", event.target.value)
            }
          >
            <option value="">Todas as fontes</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>

        <label className="manga-filters__field">
          <span>Loja</span>
          <select
            value={filters.shop}
            onChange={(event) =>
              updateFilter("shop", event.target.value)
            }
          >
            <option value="">Todas as lojas</option>
            {shops.map((shop) => (
              <option key={shop} value={shop}>
                {shop}
              </option>
            ))}
          </select>
        </label>

        <label className="manga-filters__field">
          <span>Preço em relação à média</span>
          <select
            value={filters.priceRange}
            onChange={(event) =>
              updateFilter("priceRange", event.target.value)
            }
          >
            <option value="">Todas as faixas</option>
            <option value="below">Abaixo da média</option>
            <option value="average">Na média</option>
            <option value="above">Acima da média</option>
          </select>
        </label>
      </div>
    </section>
  );
}
