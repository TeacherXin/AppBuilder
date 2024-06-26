import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Page from './routes/page';
import UploadImage from './routes/uploadImage';
import DataBase from './routes/dataBase';
import { HashRouter as Router, Routes , Route} from "react-router-dom";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <Suspense>
    <Routes>
      <Route path={'/'} element={<Page />}></Route>
      <Route path={'/uploadImage'} element={<UploadImage />}></Route>
      <Route path={'/dataBase'} element={<DataBase />}></Route>
    </Routes>
    </Suspense>
  </Router>
);
