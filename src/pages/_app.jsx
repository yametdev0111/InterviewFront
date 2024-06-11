// ** Global css styles
import "../globals.css";
import { Provider, useStore } from "react-redux";
import store from "../store";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Head>
        <title>SeeAd</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;