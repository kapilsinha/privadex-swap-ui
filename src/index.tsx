import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DAppProvider, Config, Astar, Moonbeam, MetamaskConnector } from "@usedapp/core";
import { ColorModeScript } from "@chakra-ui/react";
import theme from './theme'


const config: Config = {
  // readOnlyChainId: ChainId.Moonbeam,
  networks: [Astar, Moonbeam],
  readOnlyUrls: {
    [Moonbeam.chainId]: 'https://moonbeam.api.onfinality.io/public',
    [Astar.chainId]: 'https://astar.api.onfinality.io/public',
  },
  connectors: {
    metamask: new MetamaskConnector(),
  },
  gasLimitBufferPercentage: 20 // The percentage by which the transaction may exceed the estimated gas limit
}

ReactDOM.render(
    <React.StrictMode>
      <DAppProvider config={config}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </DAppProvider>
    </React.StrictMode>,
  document.getElementById("root")
);
