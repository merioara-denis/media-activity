import { useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import type { RouteComponentProps } from "react-router-dom";

interface DefaultComponentProps extends RouteComponentProps<any> {
  handler: () => void;
  service: Object;
}

const DefaultComponent = (props: DefaultComponentProps) => {
  const { handler } = props;
  return <button onClick={handler}>click</button>;
};

const ContentHOC = (props: Omit<DefaultComponentProps, "handler">) => {
  console.log(props);
  const {
    params: { id },
  } = (useRouteMatch("/:id") ?? { params: { id: null } }) as {
    params: { id: string | null };
  };
  const callback = useCallback(() => {
    if (id === null) return alert("Home page");

    alert("any page");
  }, [id]);

  return <DefaultComponent {...props} handler={callback} />;
};

export const Questions1309511 = () => {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </header>
        <div>
          <Switch>
            <Route
              exact
              render={(props: RouteComponentProps<any>) => (
                <ContentHOC {...props} service={{}} />
              )}
            />
            <Route
              path="/about"
              render={(props) => <ContentHOC {...props} service={{}} />}
            />
          </Switch>
        </div>
      </Router>
    </div>
  );
}
