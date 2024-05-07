import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout";
import Mainpage from "./components/Mainpage";
import Albums from "./components/Albums";
import Graph from "./components/Graph";
import AllImage from "./components/DisplayImageFromLocalStorage";
import Favorite from "./components/Favorite";
import SearchResults from "./components/ResultsSearchDisplay"
import RecomUv from "./components/RecomUv";
import RecomTemp from "./components/RecomTemp";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Mainpage />} />
      <Route path="Allimage" element={<AllImage />} />
      <Route path="RecomUv" element={<RecomUv />} />
      <Route path="RecomTemp" element={<RecomTemp />} />
      <Route path="Albums" index element={<Albums />} />
      <Route path="Favorite" element={<Favorite />} />
      <Route path="Graph" index element={<Graph />} />
      <Route path="/search" element={<SearchResults />} />
    </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
