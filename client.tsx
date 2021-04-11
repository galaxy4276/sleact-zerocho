import React from 'react';
import { render } from "react-dom";
import axios from 'axios';
import App from './layouts/App';
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'));

export const apiClient = axios.create({
  baseURL: 'http://localhost:3095/api'
});
