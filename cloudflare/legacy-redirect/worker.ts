const worker = {
  async fetch(request: Request): Promise<Response> {
    const destination = new URL(request.url);
    destination.protocol = "https:";
    destination.hostname = "triumphantech.com";
    destination.port = "";
    return Response.redirect(destination.toString(), 301);
  },
};
export default worker;
