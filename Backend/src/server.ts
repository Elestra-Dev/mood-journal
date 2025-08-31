import { createApp } from "./app";
import { env } from "./config/env";

createApp().then(app => {
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API ready at http://localhost:${env.PORT}/graphql`);
  });
});
