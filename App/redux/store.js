import {configureStore} from "@reduxjs/toolkit";
import {logger} from "../utils/logger";
import rootReducer from "./reducers/rootReducer";

function configureAppStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    middleware: [logger],
    preloadedState
  })
}

export default configureAppStore