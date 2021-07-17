import React, { useState, useEffect } from "react";
import "./App.css";
import { api } from "../services/api";
import { apiMunicipios } from "../services/apiMunicipios";

function App() {
  // Estados utilizados, ainda não descobri o motivo, porém tive que fazer
  // destructring nos estados pois na utilização direta existia um obj dentro
  // do estado com o mesmo nome Ex: city.city ou valid.valid.
  const [{ city }, setCity] = useState("");
  const [{ valid }, setValid] = useState("");
  const [{ collectionOfCity }, setCollectionOfCity] = useState("");
  const [{ weather }, setWeather] = useState("");

  //Hook effect utilizado para City e realizar as validações.
  useEffect(() => {
    getCity();
    // criação da variável para validação de cada char inserido, iniciando em 0
    // reprentando o false, fiz com 0 porém acredito que funcionaria utilizando
    // bool.
    let isvalid = 0;
    // primeiro testa se city e Collection foram já inseridas pois Collection é
    // armazena dados de uma api e city são os caracteres digitados, após
    // armazena o retorno da func validCity em isvalid.
    collectionOfCity && city && (isvalid = validCity());
    // determinar o valor de valid de acordo com o resultado de isvalid através
    // de um ternario
    isvalid
      ? setValid({ valid: "Procurando..." })
      : setValid({ valid: "Cidade não encontrada" });

    // novamente com um teste de Collection já armazenando seus dados executa
    // a func finalValidation
    collectionOfCity && finalValidation();
  }, [city]);

  // func assincrona que faz a requisição da API do IBGE que tem como response
  // os municipios brasileiros e armazena o resultado no estado Collection
  async function getCity() {
    const response = await apiMunicipios.get();
    const collectionOfCitys = response.data.map((dados) => dados.nome);
    setCollectionOfCity({ collectionOfCity: collectionOfCitys });
  }
  // func que realiza o teste se o valor contido em city existe em collection
  // Ex: city: "Cur" in "Curitiba", neste caso retorna o 1(true) para a sua
  // chamada no hook effect.
  const validCity = () => {
    for (const data of collectionOfCity) {
      if (data.indexOf(city) !== -1) {
        return 1;
      }
    }
  };
  // Func que realiza a validacao final, ou seja, ela verifica se o estado city
  // possui exatamente um valor contido dentro de collection
  const finalValidation = () => {
    for (const data of collectionOfCity) {
      if (city === data) {
        setValid({ valid: "Cidade encontrada" });
        setWeather({ weather: "" });
      }
    }
  };
  // func que faz a requisição da API caso o estado de valid esteja de acordo,
  // ou seja, caso o valor de city não possua um valor válido de uma cidade
  // existente a requisição não será realizada.
  async function handleGetWeather(e) {
    e.preventDefault();
    if (valid === "Cidade encontrada") {
      const response = await api.get(city);
      setWeather({ weather: response.data });
    }
  }
  // func que lida com a mudança de estado de city de acordo com o imput que
  // faz a chamada da mesma.
  const handleChange = (e) => {
    setCity({ city: e.target.value });
  };
  // func para limpar os dados do imput.
  const handleClear = (e) => {
    e.preventDefault();
    setCity({ city: "" });
  };
  return (
    // div principal
    <div className="App">
      {/* primeira sessao que possui o form com o imput e os 2 botões: enviar e limpar
      realizando a chamada das func explicadas acima */}
      <section>
        <form action="/">
          {/* realizar um curto circuito por um Warning do react sobre manipulação 
          de um input com valor inicial undefined */}
          <input type="text" onChange={handleChange} value={city || ""} />
          <button onClick={handleGetWeather}>enviar</button>
          <button onClick={handleClear}>Limpar</button>
        </form>
      </section>
      {/* Campo dinamico para informar se o digitado está correto até então */}
      <p className="Validate">{valid}</p>
      {/* primeiro é verificar se o estado weather já foi preenchido, caso sim
      verifica se o estado valid possui o valor desejado para renderizão e só 
      então é realizada a renderizão dos dados */}
      {weather && valid === "Cidade encontrada" && (
        <>
          <h1>{city}</h1>

          <section>
            <h1>Current Weather</h1>
            <p>Temperature: {weather.temperature}</p>
            <p>Wind: {weather.wind}</p>
            <p>Description: {weather.description}</p>
          </section>

          <section>
            <h1>Forecast</h1>
            <ol>
              {/* Aqui algo que me prendeu por um tempo e pode pegar desprevinido
              outros que assim como eu estão iniciando seus estudos com o react
              por padrão quando vc inicia uma função anonima assim como abaixo 
              no .map após o => é colocado o { } porém para renderição de tags
              html precisa ser o () e só quando for utilizado novamente código
              Js é utilizado o {}, eu estava utilizando o {} e não dava erro ou
              warning, porém não era renderizado o bloco. */}
              {weather.forecast.map((forecast) => (
                <li key={forecast.day}>
                  <p>Day:{forecast.day}</p>
                  <p>{forecast.temperature}</p>
                  <p>Wind: {forecast.wind}</p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
