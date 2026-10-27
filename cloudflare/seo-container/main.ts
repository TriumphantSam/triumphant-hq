import { createSeoServer } from "./server";
const port = Number(process.env.PORT || 8080);
createSeoServer(process.env.SEO_NODE_SHARED_SECRET || "").listen(port, "0.0.0.0", () => {
  console.log(`SEO scanner listening on ${port}`);
});
