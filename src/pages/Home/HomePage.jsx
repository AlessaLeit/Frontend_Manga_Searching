import { useMemo, useState } from "react";

import { AppHeader } from "../../shared/components/AppHeader/AppHeader.jsx";
import { SearchBar } from "./components/SearchBar/SearchBar.jsx";
import { MangaCard } from "./components/MangaCard/MangaCard.jsx";
import { MangaFilters } from "./components/MangaFilters/MangaFilters.jsx";

import "./HomePage.css";

// Converte preços numéricos ou strings, incluindo valores brasileiros,
// como "R$ 1.234,56", para números que podem ser comparados.
function parsePrice(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (value == null || value === "") {
    return 0;
  }

  let text = String(value)
    .replace(/R\$/gi, "")
    .replace(/\s/g, "");

  if (text.includes(",")) {
    text = text.replace(/\./g, "").replace(",", ".");
  }

  const price = Number(text.replace(/[^\d.-]/g, ""));

  return Number.isFinite(price) ? price : 0;
}

// Padroniza textos para comparar sem depender de maiúsculas ou acentos.
function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const INITIAL_FILTERS = {
  condition: "",
  priceOrder: "",
  author: "",
  source: "",
  shop: "",
  priceRange: "",
};

export function HomePage() {
  const [result, setResult] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Sem o useMemo, `?? []` cria um array novo a cada render e invalida todos
  // os useMemo abaixo — os filtros seriam recalculados sem nada ter mudado.
  const mangas = useMemo(() => result?.options ?? [], [result]);
  const averagePrice = parsePrice(result?.priceAvg);

  // Os filtros são montados com base nos resultados da pesquisa atual.
  const authors = useMemo(() => {
    return [
      ...new Set(
        mangas
          .map((manga) => {
            const author = manga.autor?.trim();

            return !author || normalizeText(author) === "nao cadastrado"
              ? "Autor não informado"
              : author;
          })
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [mangas]);

  // A fonte é de onde o anúncio veio. Diferente da loja, ela vem sempre de um
  // conjunto fechado ("OLX", "Enjoei", "Bing Shopping"...), o que faz dela o
  // filtro mais confiável: a loja é texto livre do anúncio.
  const sources = useMemo(() => {
    return [
      ...new Set(
        mangas
          .map((manga) => manga.fonte?.trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [mangas]);

  const shops = useMemo(() => {
    return [
      ...new Set(
        mangas
          .map((manga) => manga.loja?.trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [mangas]);

  // Aplica todos os filtros e a ordenação sem alterar result.options.
  const filteredMangas = useMemo(() => {
    const filtered = mangas.filter((manga) => {
      const condition = normalizeText(manga.condicao);
      const author =
        !manga.autor ||
        normalizeText(manga.autor) === "nao cadastrado"
          ? "Autor não informado"
          : manga.autor.trim();

      const source = manga.fonte?.trim() ?? "";
      const shop = manga.loja?.trim() ?? "";
      const price = parsePrice(manga.preco);

      if (
        filters.condition &&
        !condition.includes(filters.condition)
      ) {
        return false;
      }

      if (
        filters.author &&
        normalizeText(author) !== normalizeText(filters.author)
      ) {
        return false;
      }

      if (
        filters.source &&
        normalizeText(source) !== normalizeText(filters.source)
      ) {
        return false;
      }

      if (
        filters.shop &&
        normalizeText(shop) !== normalizeText(filters.shop)
      ) {
        return false;
      }

      if (filters.priceRange === "below" && price >= averagePrice) {
        return false;
      }

      if (filters.priceRange === "above" && price <= averagePrice) {
        return false;
      }

      if (
        filters.priceRange === "average" &&
        Math.abs(price - averagePrice) >= 0.01
      ) {
        return false;
      }

      return true;
    });

    if (filters.priceOrder === "asc") {
      filtered.sort(
        (a, b) => parsePrice(a.preco) - parsePrice(b.preco),
      );
    } else if (filters.priceOrder === "desc") {
      filtered.sort(
        (a, b) => parsePrice(b.preco) - parsePrice(a.preco),
      );
    }

    return filtered;
  }, [mangas, filters, averagePrice]);

  const handleNewSearch = (newResult) => {
    setResult(newResult);
    setFilters({ ...INITIAL_FILTERS });
  };

  const resetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
  };

  return (
    <main
      className={`home-page ${
        result ? "home-page--has-result" : ""
      }`}
    >
      <AppHeader />

      <section
        className="home-page__content"
        aria-labelledby="home-title"
      >
        <h1 id="home-title" className="home-page__title">
          Manga Searching
        </h1>

        <SearchBar setResult={handleNewSearch} />

        {result && (
          <div className="home-page__results">
            <MangaFilters
              filters={filters}
              setFilters={setFilters}
              authors={authors}
              sources={sources}
              shops={shops}
              onReset={resetFilters}
            />

            <p
              className="manga-result__count"
              aria-live="polite"
            >
              {filteredMangas.length === mangas.length
                ? `${mangas.length} anúncios encontrados`
                : `${filteredMangas.length} de ${mangas.length} anúncios`}
            </p>

            {filteredMangas.length > 0 ? (
              <div className="manga-result">
                {filteredMangas.map((mangaInfo, index) => (
                  <MangaCard
                    key={`${mangaInfo.fonte}-${mangaInfo.nome}-${mangaInfo.loja}-${index}`}
                    mangaInfo={mangaInfo}
                    media={averagePrice}
                  />
                ))}
              </div>
            ) : (
              <p className="manga-result__empty" role="status">
                Nenhum anúncio corresponde aos filtros selecionados.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}