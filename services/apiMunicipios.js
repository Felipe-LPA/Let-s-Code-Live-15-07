import axios from "axios";

export const apiMunicipios = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades/municipios",
});
