import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Fallback from './fallback';

export default function Routing({ pages }) {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {pages.map((page, index) => (
          <Route key={index} path={page.path} element={page.element} />
        ))}
      </Routes>
    </Suspense>
  );
}
