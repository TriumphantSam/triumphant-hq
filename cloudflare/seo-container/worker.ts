import { Container } from "@cloudflare/containers";
import { scannerGateway } from "./gateway";

type Env = {
  SEO_NODE_SHARED_SECRET: string;
  SEO_CONTAINER: { getByName(name: string): { fetch(request: Request): Promise<Response> } };
};

export class SeoScanner extends Container<Env> {
  defaultPort = 8080;
  sleepAfter = "30s";
  enableInternet = true;
  envVars = { SEO_NODE_SHARED_SECRET: this.env.SEO_NODE_SHARED_SECRET };
}

const worker = {
  async fetch(request: Request, env: Env) {
    // Authenticate before obtaining/starting the single container instance.
    return scannerGateway(request, env.SEO_NODE_SHARED_SECRET || "", req =>
      env.SEO_CONTAINER.getByName("scanner").fetch(req));
  },
};

export default worker;
