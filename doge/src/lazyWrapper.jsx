import { lazy } from "react";
import NProgress from "nprogress";

const lazyWrapper = (importFn) => {
  return lazy(() => {
    NProgress.start();
    return importFn()
      .then((module) => {
        NProgress.done();
        return module;
      })
      .catch((err) => {
        NProgress.done();
        throw err;
      });
  });
};

export default lazyWrapper