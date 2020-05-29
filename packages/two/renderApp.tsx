import * as React from "react";
import * as ReactDOM from "react-dom";

const App: React.FC = () => (
  <section>
    <h1>Hello world</h1>
  </section>
);

const renderApp = (): void => {
  ReactDOM.hydrate(<App />, document.querySelector("#root"));

  if (module.hot) {
    console.log("Is hot");
    module.hot.accept(() => {
      console.log("Accepted");
    });
  }
};

export default renderApp;
